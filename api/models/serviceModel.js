const express = require("express");
const db = require("../../db");

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

    static async getServiceList(headers) {
        const searchText = headers['search_text'];
        const subcategory = headers['sub_category'];
        const budget = headers['budget'];
        const workingTime = headers['working_time'];
    
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
}



module.exports = Service;


