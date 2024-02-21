const express = require("express");
const db = require("../../db");

module.exports = class Client {
  static async getClientByTaskID (taskId) {
    // SP buat get Client Details 
    let SPGetClient = `select public.client.client_id as id, profile_image as profile_image_url, public.client.name from public.client 
    join 
    public.task 
    on
    public.client.client_id = public.task.client_id
    and
    public.task.task_id = '${taskId}';`;

    let result = await db.any(SPGetClient);

    return result[0];
  }

  static async getOtherClientProfile (userId) {
    let SPGetClientDetails = `select client_id as id, profile_image as profile_image_url, name, client_id as username from public.client where client_id = '${userId}'; `

    let result = await db.any(SPGetClientDetails);

    return result[0];
  }
}