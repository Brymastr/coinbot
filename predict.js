const WebSocket = require('ws');
const readline = require('readline');
const chalk = require('chalk');
const Snapshot = require('./Snapshot');
const ExchangeWebSocket = require('./ExchangeWebSocket');



function writeSummary(snapshots) {
  readline.moveCursor(process.stdout, -100, -2);
  readline.clearScreenDown();

  const getAverage = numberOfSnapshots => {
    let total = 0;
    if(snapshots.length < numberOfSnapshots) return null;
    for(let i = snapshots.length - 1; i >= snapshots.length - numberOfSnapshots; i--) {
      const currentSnapshot = snapshots[i];
      total += currentSnapshot.averagePrice;
    }
    return total / numberOfSnapshots;
  }
  
  const five = snapshots[snapshots.length - 1].averagePrice;
  const fifteen = getAverage(3);
  const hour = getAverage(12);

  const text = chalk` 5 minutes: {yellow ${parseFloat(five.toFixed(4))} }
15 minutes: ${fifteen > 0 ? chalk`{yellow ${parseFloat(fifteen.toFixed(4))} }` : ''}
    1 hour: ${hour > 0 ? chalk`{yellow ${parseFloat(hour.toFixed(4))} }`: ''}`;

  process.stdout.write(text);
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function onMessage(message) {
  console.log(message);

  // const [channelId, type, info, ...rest] = JSON.parse(message.data);
  // if(type === 'tu') {
  //   const [tradeId, timestamp, quantity, price] = info;
  //   currentSnapshot.push(price);
  // }
}

async function main() {
  const url = 'wss://api.bitfinex.com/ws/2';
  const coin = (process.argv[2] || 'BTC').toUpperCase();
  const exchangeCoin = (process.argv[3] || 'USD').toUpperCase();

  const connection = new ExchangeWebSocket(url, `${coin}${exchangeCoin}`, onMessage);
  const socketState = connection.socket.readyState;

  while(socketState === 'CONNECTING' || socketState === 'OPEN') {
    await wait(1000);
    console.log(socketState);
  }

}

main();