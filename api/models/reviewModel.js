const express = require("express");
const db = require("../../db");

module.exports = class Review {
  static async getClientReviewByTaskID (taskId) {
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

  static async getClientReviewRatingAmountByTaskID (taskId) {
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

  static async getClientAvgRatingByTaskID (taskId) {
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
}