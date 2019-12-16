'use strict';

const request = require('request');

module.exports = CONFIG => {
  return ipaddress => new Promise((resolve, fail) =>{
    request(CONFIG.get('LOCATION_BASE_URL') + ipaddress, (err, response, body) => {
        if(err)fail('exception when querying location');
        resolve(body);
    });
  });
}
