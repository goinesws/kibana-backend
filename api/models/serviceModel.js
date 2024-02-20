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
}

module.exports = Service;


