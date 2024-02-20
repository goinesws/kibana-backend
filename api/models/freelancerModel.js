const express = require("express");
const db = require("../../db");

module.exports = class Freelancer {
  static async getFreelancerByTaskID(taskId) {
    let SPGetRegisteredFreelancer = `select public.freelancer.freelancer_id as id, public.client.profile_image as profile_image_url, public.client.name
    from 
    public.client
    join 
    public.freelancer 
    on 
    public.freelancer.user_id = public.client.client_id
    join
    public.task_enrollment
    on 
    public.task_enrollment.freelancer_id = public.freelancer.freelancer_id
    join
    public.task
    on 
    public.task.task_id = public.task_enrollment.task_id
    and 
    public.task.task_id = '${taskId}';`;

    let result = await db.any(SPGetRegisteredFreelancer);

    return result;
  }
}