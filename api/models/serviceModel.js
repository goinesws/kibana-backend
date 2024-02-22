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
    
        if (searchText !== "") {
          SP += ` WHERE (service.name || service.description ILIKE '%${searchText}%'
          OR '${searchText}' ILIKE ANY (service.tags))`;
        }
        if (subcategory !== "") {
          if(searchText!=="") SP +=` AND`
          else SP += ` WHERE`
          SP += ` service.subcategory_id = '${subcategory}'`;
        }

        if (budget !== "") {
          const budgetObject = JSON.parse(budget);
          const budgetStart = budgetObject.budget_start;
          const budgetEnd = budgetObject.budget_end;
    
          if(searchText!=="" || subcategory!=="") SP +=` AND`
          else SP += ` WHERE`
          if (budget.budget_end !== null) {
            SP += ` price BETWEEN '${budgetStart}' AND '${budgetEnd}'`;
          } else {
            SP += ` price > '${budgetStart}'`;
          }
        }

        if (workingTime !== "") {
            const workingTimeObject = JSON.parse(workingTime);
            const workingTimeStart = workingTimeObject.working_time_start;
            const workingTimeEnd = workingTimeObject.working_time_end;
      
            if(searchText!=="" || subcategory!=="" || budget!=="") SP +=` AND`
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
}

module.exports = Service;


