const request = require('request');
const redis = require('redis');
const express = require('express');

const app = express();

const { recreateData } = require('./helper');

// API from warta pasar ikan website
const WPI_API = require('./config').WPI;
// database client
const dbClient = redis.createClient();

request(WPI_API, async (error, response, body) => {
  const bodyObj = JSON.parse(body);
  const dataList = bodyObj.data;

  const timestamp = new Date().getTime();
  let createdDataList = [];
  // iterate over location
  for (const data of dataList) {
    const createdData = await recreateData(data);
    createdDataList.push(createdData);
  }
  
  dbClient.zadd(['data', timestamp, JSON.stringify(createdDataList)], redis.print);
});

