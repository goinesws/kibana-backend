const express = require("express");
const db = require("../../db");
const imgur = require("../../imgur");
var multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const Requirement = require('../models/requirementModel.js');
const { v4: uuidv4 } = require('uuid');

class Service {
    constructor(){}

    static async getNewService(category_id) {
        try {
            var SP = `SELECT service_id as id, images as image_url, service.name,
            jsonb_build_object('image_url', client.profile_image, 'name', client.name) as freelancer,
            (SELECT AVG(rating)
            FROM
              review
            WHERE
            destination_id = service.service_id) as average_rating,
            (SELECT COUNT(rating)
            FROM 
            review
            WHERE 
            destination_id = service.service_id) as rating_amount,
            service.tags as tags,
            service.price,
            service.working_time
            FROM service
            inner join subcategory on
                            service.subcategory_id = subcategory.subcategory_id
            inner join category on
                            subcategory.category_id = category.category_id
            inner join freelancer on
                            service.freelancer_id = freelancer.freelancer_id
            inner join client on
                            freelancer.user_id = client.client_id
            where category.category_id = '${category_id}'
            ORDER BY
            service.created_date DESC
            LIMIT 4`
            const result = await db.any(SP);
            return result;
        } catch (error) {
            throw new Error('Failed to fetch user tasks');
        }
    }

    static async getNewServiceNoCat(category_id) {
        try {
            var SP = `SELECT service_id as id, images as image_url, service.name,
            jsonb_build_object('image_url', client.profile_image, 'name', client.name) as freelancer,
            (SELECT AVG(rating)
            FROM
              review
            WHERE
            destination_id = service.service_id) as average_rating,
            (SELECT COUNT(rating)
            FROM 
            review
            WHERE 
            destination_id = service.service_id) as rating_amount,
            service.tags as tags,
            service.price,
            service.working_time
            FROM service
            inner join freelancer on
                            service.freelancer_id = freelancer.freelancer_id
            inner join client on
                            freelancer.user_id = client.client_id
            ORDER BY
            service.created_date DESC
            LIMIT 4`;
            const result = await db.any(SP);
            return result;
        } catch (error) {
            throw new Error('Failed to fetch user tasks');
        }
    }

    // static async getSubcategoryByCategory(category_id) {
    //     try {
    //         var SP = `select service_id as id, service.name, service.description as desc, images as image_url from service
    //         inner join subcategory on
    //         subcategory.subcategory_id = service.subcategory_id
    //         where subcategory.category_id = '${category_id}'`;
    //         const result = await db.any(SP);
    //         return result;
    //     } catch (error) {
    //         throw new Error('Failed to fetch user tasks');
    //     }
    // }

    static async getServiceByCategory(category_id) {
        try {
            var SP = `select service_id as id, service.name, service.description as desc, images as image_url from service
            inner join subcategory on
            subcategory.subcategory_id = service.subcategory_id
            where subcategory.category_id = '${category_id}'`;
            const result = await db.any(SP);
            return result;
        } catch (error) {
            throw new Error('Failed to fetch user tasks');
        }
    }

    static async getServiceList(body) {
        const searchText = body['search_text'];
        const subcategory = body['sub_category'];
        const budget = body['budget'];
        const workingTime = body['working_time'];
    
        let SP = `SELECT service_id as id, images as image_url, service.name,
        jsonb_build_object('profile_image_url', client.profile_image, 'name', client.name) as freelancer,
        (SELECT AVG(rating)
        FROM
          review
        WHERE
        destination_id = service.service_id) as average_rating,
        (SELECT COUNT(rating)
        FROM 
        review
        WHERE 
        destination_id = service.service_id) as rating_amount,
        service.tags as tags,
        service.price,
        service.working_time
        FROM service
        inner join subcategory on
                        service.subcategory_id = subcategory.subcategory_id
        inner join category on
                        subcategory.category_id = category.category_id
        inner join freelancer on
                        service.freelancer_id = freelancer.freelancer_id
        inner join client on
                        freelancer.user_id = client.client_id`;
    
        if (searchText !== "" && searchText) {
          SP += ` WHERE (service.name || service.description ILIKE '%${searchText}%'
          OR '${searchText}' ILIKE ANY (service.tags))`;
        }
        if (subcategory !== "" && subcategory) {
          if(searchText!=="") SP +=` AND`
          else SP += ` WHERE`
          SP += ` service.subcategory_id = '${subcategory}'`;
        }

        if (budget !== "" && budget) {
          const budgetObject = JSON.parse(budget);
          const budgetStart = budgetObject.budget_start;
          const budgetEnd = budgetObject.budget_end;
    
          if(searchText!=="" || searchText !== null || subcategory!=="" || subcategory!== null) SP +=` AND`
          else SP += ` WHERE`
          if (budget.budget_end !== null) {
            SP += ` price BETWEEN '${budgetStart}' AND '${budgetEnd}'`;
          } else {
            SP += ` price > '${budgetStart}'`;
          }
        }

        if (workingTime !== "" && workingTime) {
            const workingTimeObject = JSON.parse(workingTime);
            const workingTimeStart = workingTimeObject.working_time_start;
            const workingTimeEnd = workingTimeObject.working_time_end;
      
            if(searchText!=="" || subcategory!=="" || budget!=="" || searchText!==null || subcategory!==null || budget!==null) SP +=` AND`
            else SP += ` WHERE`
            if (workingTimeEnd !== null) {
              SP += ` working_time BETWEEN '${workingTimeStart}' AND '${workingTimeEnd}'`;
            } else {
              SP += ` working_time > '${workingTimeStart}'`;
            }
          }

        SP += ` ORDER BY service.created_date DESC`
        let result = await db.any(SP);
    
        return result;
      }

      static async getServiceDetail(service_id) {
        try {
            var SP = `select service.service_id as id,
            images as image_url,
            service.name,
            service.tags,
            service.working_time,
            service.price,
            service.revision_count,
            (SELECT
              jsonb_agg(
                jsonb_build_object(
                  'title', question,
                  'is_supported', requirement.is_true
                )
              )
            FROM 
              additionalInfo
            JOIN 
              requirement on additionalInfo.additional_info_id = requirement.additional_info_id
            WHERE 
              requirement.service_id = 'S1'
            ) AS additional_info,
            service.description
            FROM service
            JOIN 
              requirement on service.service_id = requirement.service_id
            JOIN
              additionalInfo on requirement.additional_info_id = requirement.additional_info_id
            WHERE
              service.service_id = '${service_id}'
            GROUP BY 
              service.service_id`;
            const result = await db.any(SP);
            return result;
        } catch (error) {
            throw new Error('Failed to fetch user tasks');
        }
    }

    static async getServiceReview(service_id) {
      try {
          var SP = `SELECT 
            (SELECT AVG(rating)
            FROM
              review
            WHERE
            destination_id = service.service_id) as average_rating,
            (SELECT COUNT(rating)
            FROM 
            review
            WHERE 
            destination_id = service.service_id) as rating_amount,
        (SELECT
                  jsonb_agg(
                    jsonb_build_object(
              'name', client.name,
              'star', review.rating,
              'description', review.content,
              'timestamp', TO_CHAR(review.date, 'DD Mon YYYY')
                    )
                  )
                FROM 
                  review
                JOIN 
                  client on client.client_id = review.writer_id
                WHERE 
                  review.destination_id = service.service_id
                ) AS review_list
            FROM service
        WHERE service_id = '${service_id}'
        ORDER BY service.created_date DESC`
          const result = await db.any(SP);
          return result[0];
      } catch (error) {
          throw new Error('Failed to fetch user tasks');
      }
  }
  
  static async createNewService (images, data_incoming, clientId) {
    const serviceId = uuidv4();
    const data = JSON.parse(data_incoming);
    const name = data.name;
    const subCategory = data.sub_category;
    const workingTime = data.working_time;
    const revisionCount = data.revision_count;
    const description = data.description;
    const price = data.price;
    const tags = data.tags;
    const additionalInfo = data.additional_info;
    const freelancerId = clientId;

    console.log(clientId)

    // console.log(tags)
    additionalInfo.forEach((item, index) => {
      Requirement.createNewRequirement(item.id, serviceId, item.is_supported);
    });

    if(!name || !subCategory || !workingTime || !revisionCount || !description || !price || !tags || !additionalInfo || !freelancerId) return "";

    let SP = `
    INSERT INTO service (service_id, subcategory_id, freelancer_id, name, description, tags, price, working_time, images, revision_count, is_active, created_date)
    VALUES
    ('${serviceId}', '${subCategory}', '${freelancerId}', '${name}', '${description}', ARRAY['${tags.join("','")}'], ${price}, ${workingTime}, ARRAY['${images.join("','")}'], ${revisionCount}, TRUE, CURRENT_TIMESTAMP);
    `

    await db.any(SP)
  
    return serviceId; 
  }

  static async addServiceImage(image) {
    var link;
    const clientId = '33df5c9de1e057a';
    var axios = require('axios');
    var data = new FormData();
    data.append('image', image[0].buffer, { filename: `test.jpg` });
    // data.append('image', fs.createReadStream('/home/flakrim/Downloads/GHJQTpX.jpeg'));
  
    var config = {
      method: 'post',
    maxBodyLength: Infinity,
      url: 'https://api.imgur.com/3/image',
      headers: { 
        'Authorization': `Client-ID ${clientId}`, 
        ...data.getHeaders()
      },
      data : data
    };
  
    await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data.data.link));
      link = JSON.stringify(response.data.data.link);
      return response.data.data.link;
    })
    .catch(function (error) {
      console.log(error);
    });

    return link;
  }

  static async getOwnedService(freelancer_id) {
    try {
        var SP = `select
        service_id as id,
        name,
        working_time,
        tags,
        images as image_url,
        price,
        (SELECT AVG(rating)
        FROM
          review
        WHERE
        destination_id = service.service_id) as average_rating,
        (SELECT COUNT(rating)
        FROM 
        review
        WHERE 
        destination_id = service.service_id) as rating_amount,
        (SELECT COUNT(order_id)
        FROM 
          public.order
        WHERE 
        public.order.service_id = service.service_id
        AND
        status = 'Dalam Proses') as in_progress_transaction_amount,
        (SELECT 
           CASE
             WHEN is_active = TRUE THEN 1
             ELSE 2
         END AS status
        )
      
      from service
      where freelancer_id = '${freelancer_id}'`;
        const result = await db.any(SP);
        return result;
    } catch (error) {
        throw new Error('Failed to fetch owned services');
    }
}

}





module.exports = Service;


