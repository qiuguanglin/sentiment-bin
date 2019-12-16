'use strict'

const fs = require('fs');
const path = require('path');

module.exports = CONFIG => {
  const QUOTES = JSON.parse(fs.readFileSync(path.join('data', CONFIG.get('QUOTE_FILE_NAME'))));
  console.log('quotes initialized');
  return () => QUOTES[Math.floor(QUOTES.length * Math.random())];
}
