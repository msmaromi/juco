const request = require('request');
const redis = require('redis');
const express = require('express');
const server = require('server');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express();
const dummyData = require('./dummy');

const { recreateData } = require('./helper');

// API from warta pasar ikan website
const WPI_API = require('./config').WPI;
// database client
// const dbClient = redis.createClient();
mongoose.connect('mongodb://localhost/juco', {
  useMongoClient: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const DataSchema = new Schema({
  data: Schema.Types.Mixed
});

const Data = mongoose.model('Data', DataSchema);
let data = new Data({ data: dummyData });

db.once('open', function() {
  // data.save((err, data) => {
  //   if (err) return console.error(err);
    
  //   console.log("Data saved", data);
  // })
});

// !!! wpi.kkp.go.id cannot be accessed !!!
// request(WPI_API, async (error, response, body) => {
//   console.log(body);
//   const bodyObj = JSON.parse(body);
//   const dataList = bodyObj.data;

//   const timestamp = new Date().getTime();
//   let createdDataList = [];
//   iterate over location
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

server(
  { port: 3333 }, 
  [
    ctx => header("Access-Control-Allow-Origin", "*"),
    ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),    
    get('/data', ctx => dummyData)
  ]
);