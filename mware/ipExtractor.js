'use strict';

const IP_ADDRESS_REGEXP = /^(\d{1,3}\.)+\d{1,3}$/;

module.exports = (req, res, next) => {
  let remoteIP;
  const rawRemoteAddressHeader = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  if(IP_ADDRESS_REGEXP.test(rawRemoteAddressHeader)){
    remoteIP = rawRemoteAddressHeader;
  }else{
    try{
        remoteIP = rawRemoteAddressHeader.match(/\d.+\d$/)[0];
    }catch(err){
      console.log('cannot extract the remote IP address from', rawRemoteAddressHeader);
      remoteIP = rawRemoteAddressHeader;
    }
  }

  req.remoteIP = remoteIP;
  next();
};
