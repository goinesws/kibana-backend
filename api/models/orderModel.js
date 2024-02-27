const express = require("express");
const db = require("../../db");

module.exports = class Order {
  async getFreelancerProjectByUserId(userId) {
    let SP = `
    select 
    s.name as project_name,
    r.rating as star,
    s.description as description,
    o.delivery_date as timestamp
    from 
    public.order o
    join
    public.service s
    on
    o.service_id = s.service_id
    join
    public.freelancer f
    on
    f.freelancer_id = s.freelancer_id
    left join
    public.review r
    on
    r.transaction_id = o.order_id
    where
    f.user_id = '${userId}'
    `;

    let result = await db.any(SP);

    return result;
  }
};
