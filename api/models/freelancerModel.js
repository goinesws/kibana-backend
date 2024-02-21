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

  static async isFreelancer (userId) {
    let SPGetIsFreelancer = `select count(*) from public.freelancer where user_id = '${userId}';`

    let result = await db.any(SPGetIsFreelancer);

    if (result[0].count > 0) {
      return true;
    } else {
      return false;
    }
  }

  static async getDesc (userId) {
    let SP = `select description from public.freelancer where user_id='${userId}'`;

    let result = await db.any(SP);

    return result[0];
  }
}