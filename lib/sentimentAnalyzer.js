'use strict';

const BaiduNLPClient = require('baidu-aip-sdk').nlp;

module.exports = CONFIG =>{
  const {API_ID, API_KEY, API_SECRET_KEY} = CONFIG.get('API_INFO');
  const client = new BaiduNLPClient(API_ID, API_KEY, API_SECRET_KEY);
  return phrase => client.sentimentClassify(phrase);
}
