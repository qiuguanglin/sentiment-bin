'use strict';

const request = require('request');

module.exports = CONFIG => {
  return month => new Promise((resolve, fail) =>{
    request(`${CONFIG.get('HISTORY_BASE_URL')}/${month}.json`, (err, response, body)=>{
      if(err)fail('exception when querying history');
      resolve(body);
    });
  });
};
