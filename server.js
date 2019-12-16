'use strict';

//configuration
const path = require('path');
const nconf = require('nconf');
nconf
  .env()
  .defaults({'conf': path.join(__dirname, `${process.argv[2]}config.json`)})
  .file(nconf.get('conf'));

//lib
const Location = require('./lib/location')(nconf);
const History = require('./lib/history')(nconf);
const Quote = require('./lib/quote')(nconf);
const SentimentAnalyzer = require('./lib/sentimentAnalyzer')(nconf);
const HistoryEntity = require('./entity/historyEntity');
const Redis = require('./lib/redis')(nconf);

//constants
const STRIP_HTML_REGEXP = /(\<a[\"\=\s\w\.\:\/]+\>|\<\/a\>)/g;
const IP_ADDRESS_REGEXP = /^(\d{1,3}\.)+\d{1,3}$/;
const USER_INPUT_FILTER_REGEXP = /(\{|\}|\<\/?\s*script\s*\>)/g;

const date = new Date();
const month = date.getMonth() + 1;
const today =  month + '' + date.getDate();

//express
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(morgan('dev'));
app.use(require('./mware/ipExtractor'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()).use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  Redis.accessIncr((err, data)=>{
    if(err)return res.status(503);
    console.log('updated access count', data);
    res.render('main');
  });
});

app.post('/sentiment', (req, res) => {
  let feelings = req.body.feelings.replace(USER_INPUT_FILTER_REGEXP, '');
  SentimentAnalyzer(feelings).then(sentimentAnalasisResult=>{
    Redis.insert(JSON.stringify(sentimentAnalasisResult), (err, data)=>{
      if(err)return res.status(503);
      res.status(200).json(data)}
    );
  }).catch(err=>{
    console.log(err);
    res.status(500);
  });
});

app.get('/allSentiments', (req, res)=>{
  Redis.fetchAll((err, results) => {
    if(err)return res.status(503);
    res.status(200).send(results);
  })
})

app.get('/quote', (req, res) =>{
  res.status(200).json(Quote());
});

app.get('/location', (req, res) =>{
  if(!req.remoteIP){
    return res.status(400).send('resource not available');
  }

  Location(req.remoteIP)
    .then(JSON.parse)
    .then(obj=> res.status(200).json(obj))
    .catch(err=>{
      console.log(err);
      res.status(500);
    });
});

app.get('/history', (req, res) =>{
  History(month)
    .then(JSON.parse)
    .then(historyObj => historyObj[month][today])
    .then(hisListRaw => hisListRaw.map(hisRaw => new HistoryEntity(
        hisRaw.year,
        hisRaw.title.replace(STRIP_HTML_REGEXP, ''))))
    .then(hisList => res.status(200).json(hisList))
    .catch(err=>{
      console.log(err);
      res.status(500);
    });
});

const port = nconf.get('NODE_APP_PORT');
app.listen(port, ()=>console.log('sever started at ' + port));
