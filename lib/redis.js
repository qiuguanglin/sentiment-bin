'use strict'

const redis = require('redis');
const ACCESS_COUNT = 'access-amt';
const SENTIMENTS_KEY = 'myanotherlist';

module.exports = CONFIG => {
  const {HOST, PORT} = CONFIG.get('REDIS');
  const client = redis.createClient(PORT, HOST);

  client.on('error', function(err){
    return console.log('failed to connect to Redis');
  });

  console.log('redis connected');

  return {
    accessIncr(cb){
      client.incr(ACCESS_COUNT, (err, data)=>{
        if(err)return cb(err);
        return cb(null, data);
      });
    },
    fetchAll(cb){
      client.lrange(SENTIMENTS_KEY, 0, -1, (err, data)=>{
        if(err)return cb(err);
        return cb(null, data);
      });
    },
    insert(value, cb){
      client.lpush(SENTIMENTS_KEY, value, (err, index)=>{
        if(err)return cb(err);
        return cb(null, index);
      });
    }
  };
}
