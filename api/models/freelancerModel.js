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

  static async getEducationHistory (userId) {
    let SP = `
    select degree, major, university, country, year as graduation_year from public.education p
    join
    public.freelancer f
    on
    p.freelancer_id = f.freelancer_id
    where
    f.user_id = '${userId}'
    `;

    let result = await db.any(SP);

    return result;
  }

  static async getSkill (userId) {
    let SP = `select skills from public.freelancer where user_id = '${userId}';`

    console.log(SP);

    let result = await db.any(SP);

    return result[0].skills;
  }

  static async getCV (userId) {
    let SP = `
    select cv as cv_url from public.freelancer where user_id = '${userId}';
    `;

    let result = await db.any(SP);

    return result[0];
  }

  static async getPortfolio (userId) {
    let SP = `
    select portfolio as portfolio_url from public.freelancer where user_id = '${userId}';
    `;

    let result = await db.any(SP);
    console.log(result[0])

    return result[0];
  }

  static async getOwnedService (userId) {
    let SPGetService = `select s.service_id as id, s.images as image_url, s.name, s.tags, s.price, s.working_time from public.service s 
    join 
    public.freelancer f 
    on 
    f.freelancer_id = s.freelancer_id
    where 
    f.user_id = '${userId}'; `;

    
  }

  static async getFreelancerByServiceId(serviceId) {
    let SPGetRegisteredFreelancer = `select public.freelancer.freelancer_id as id, public.client.profile_image as profile_image_url, public.client.name, freelancer.description
    from 
    public.client
    join 
    public.freelancer 
    on 
    public.freelancer.user_id = public.client.client_id
	join
	service on service.freelancer_id = freelancer.freelancer_id
   	where
    service.service_id = '${serviceId}';`;

    let result = await db.any(SPGetRegisteredFreelancer);

    return result[0];
  }

}