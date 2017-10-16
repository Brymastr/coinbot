const request = require('request-promise-native');
const bitfinexUrl = 'https://api.bitfinex.com/v2';
const fixerio = 'http://api.fixer.io';

async function main() {

  const promises = [];
  const urls = [
    `${bitfinexUrl}/ticker/tBTCUSD`,
    `${fixerio}/latest?base=USD&symbols=CAD`
  ];

  urls.forEach(url => promises.push(request(url)));

  const result = await Promise.all(promises);
  
  // Get BTC price in USD
  let bid, bid_size, ask, ask_size, daily_change, daily_change_perc, last_price, volume, high, low;
  [bid, bid_size, ask, ask_size, daily_change, daily_change_perc, last_price, volume, high, low] = JSON.parse(result[0]);

  // Convert USD to CAD using Fixer.io
  const rate = JSON.parse(result[1]).rates['CAD'];
  
  console.log(`
  Last price of BTC:
    USD: ${last_price}
    CAD: ${rate * last_price}
  `);
}

main();