const express = require("express");
const db = require("../../db");

module.exports = class Review {
  async getClientReviewByTaskID (taskId) {
    let SPGetClientReviewList = `select public.client.name as name, rating as star, content as description, to_char(date, 'DD Month YYYY') as timestamp
    from 
    public.review
    join 
    public.task
    on
    public.task.client_id = public.review.destination_id
    join 
    public.freelancer
    on
    public.review.writer_id = public.freelancer.freelancer_id
    join
    public.client
    on 
    public.freelancer.user_id = public.client.client_id
    and
    public.task.task_id = '${taskId}'; `;

    let result = await db.any(SPGetClientReviewList);

    return result;
  }

  async getClientReviewRatingAmountByTaskID (taskId) {
    let SPGetClientReviewRatingAmount = `select count(*) as rating_amount 
    from 
    public.review
    join 
    public.task
    on
    public.task.client_id = public.review.destination_id
    join 
    public.freelancer
    on
    public.review.writer_id = public.freelancer.freelancer_id
    join
    public.client
    on 
    public.freelancer.user_id = public.client.client_id
    and
    public.task.task_id = '${taskId}'; `;

    let result = await db.any(SPGetClientReviewRatingAmount);

    return result[0];
  }

  async getClientAvgRatingByTaskID (taskId) {
    let SPGetClientAverageRating = `select round(avg(public.review.rating), 1) as average_rating
    from 
    public.review
    join 
    public.task
    on
    public.task.client_id = public.review.destination_id
    join 
    public.freelancer
    on
    public.review.writer_id = public.freelancer.freelancer_id
    join
    public.client
    on 
    public.freelancer.user_id = public.client.client_id
    and
    public.task.task_id = '${taskId}';`;

    let result = await db.any(SPGetClientAverageRating);

    return result[0];
  }

  async getClientReviewByUserId (userId) {
    let SP = `select 
    c.name,
    r.rating as star,
    r.content as description,
    r.date as timestamp
    from public.review r
    join
    public.freelancer f 
    on
    r.writer_id = f.freelancer_id
    join
    public.client c
    on
    f.user_id = c.client_id
    where 
    destination_id = '${userId}';`;

    let result = db.any(SP);

    return result;
  }

  async getClientAverageRatingByUserId (userId) {
    let SP = `select 
    round(avg(r.rating), 1) as average_rating
    from public.review r
    join
    public.freelancer f 
    on
    r.writer_id = f.freelancer_id
    join
    public.client c
    on
    f.user_id = c.client_id
    where 
    destination_id = '${userId}';`;

    let result = await db.any(SP);

    return result[0].average_rating;
  }

  async getClientReviewRatingAmountByUserId (userId) {
    let SP = `
    select 
    count(*)
    from public.review r
    join
    public.freelancer f 
    on
    r.writer_id = f.freelancer_id
    join
    public.client c
    on
    f.user_id = c.client_id
    where 
    destination_id = '${userId}';`;

    let result = await db.any(SP);

    return result[0].count;
  }
}