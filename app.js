const request = require('request');
const redis = require('redis');
const express = require('express');
const server = require('server');

const app = express();

const { recreateData } = require('./helper');

// API from warta pasar ikan website
const WPI_API = require('./config').WPI;
// database client
const dbClient = redis.createClient();
// 
// request(WPI_API, async (error, response, body) => {
//   const bodyObj = JSON.parse(body);
//   const dataList = bodyObj.data;

//   const timestamp = new Date().getTime();
//   let createdDataList = [];
//   // iterate over location
//   for (const data of dataList) {
//     const createdData = await recreateData(data);
//     createdDataList.push(createdData);
//   }
  
//   dbClient.zadd(['data', timestamp, JSON.stringify(createdDataList)], redis.print);
// });

// --------------------
// --- API server ---//
// --------------------
const { get, post } = server.router;
const { render, json, header } = server.reply;

const getData = get('/data', async ctx => {
  let p = new Promise((resolve, reject) => {
    // get last data
    dbClient.zrange('data', -1, -1, (error, reply) => {
      if(error) reject(error)
      resolve(reply)
    })
  })

  let data = null
  try {
    data = await p;
  } catch (error) {
    console.log(error)
  }
  
  return JSON.parse(data[0]);
});

server(
  { port: 3333 }, 
  [
    ctx => header("Access-Control-Allow-Origin", "*"),
    ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),    
    getData
  ]
);


