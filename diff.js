const calculateProfit = require('./math');
const ExchangeWebSocket = require('./ExchangeWebSocket');
const URL = 'wss://api.bitfinex.com/ws/2';

const prices = {
  BTCUSD: 0,
  ETHUSD: 0,
  ETHBTC: 0
};

async function main() {
  const capital = 100;
  const btcSocket = new ExchangeWebSocket(URL, 'BTCUSD', parseMessage)
  const ethSocket = new ExchangeWebSocket(URL, 'ETHUSD', parseMessage)
  const ethbtcSocket = new ExchangeWebSocket(URL, 'ETHBTC', parseMessage)

  while(true) {
    await wait(3000);
    const diff = calculateProfit(capital, prices);
    console.log(diff);
  }
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function parseMessage(message) {
  try {
    const [channelId, type, info, ...rest] = JSON.parse(message.data);
    if(type === 'tu') {
      const [tradeId, timestamp, quantity, price] = info;
      prices[this.exchange] = price;
    }

  } catch(err) {
    // don't die
    // console.error(err);
  }
}

main();