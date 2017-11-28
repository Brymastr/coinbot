const WebSocket = require('ws');
const readline = require('readline');
const chalk = require('chalk');

function createSocket(url, exchange, onmessage) {
  const socket = new WebSocket(url);
  socket.onmessage = onmessage;
  socket.onopen = () => {
    socket.send(JSON.stringify({
      event: 'subscribe',
      channel: 'trades',
      symbol: `t${exchange}`
    }));
  }
}

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

  // write high price of time period
  // write low price of time period
  // write average price of time period
  // write difference over past time periods
  // write number of transactions per period
  // minutely, 5 minutes, hourly, 12 hours, 24 hours
}

function wait(minutes) {
  return new Promise(resolve => {
    setTimeout(resolve, minutes * 36000);
  });
}

class Snapshot {
  constructor(duration) {
    this.duration = duration;
    this.total = 0;
    this.transactionCount = 0;
    this.averagePrice = 0;
    this.lastPrice = 0;
  }

  push(price) {
    this.total += price;
    this.transactionCount++;
    this.averagePrice = this.total / this.transactionCount;
    this.lastPrice = price;
  }
}

async function main() {
  const url = 'wss://api.bitfinex.com/ws/2';
  const coin = (process.argv[2] || 'BTC').toUpperCase();
  const exchangeCoin = (process.argv[3] || 'USD').toUpperCase();
  const duration = process.argv[4] || 5;

  let currentSnapshot = null;

  const socket = createSocket(url, `${coin}${exchangeCoin}`, message => {
    try {
      const [channelId, type, info, ...rest] = JSON.parse(message.data);
      if(type === 'tu') {
        const [tradeId, timestamp, quantity, price] = info;
        currentSnapshot.push(price);
      }
  
    } catch(err) {
      // don't die
      // console.error(err);
    }
  });

  console.log(chalk`Exchange: {yellow ${coin}-${exchangeCoin} }`);

  const snapshots = [];
  while(true) {
    if(snapshots.length === 0) console.log('Averaging...\n')
    currentSnapshot = new Snapshot(duration);
    await wait(duration);
    if(currentSnapshot.averagePrice === 0) continue;
    if(snapshots.length >= 100) snapshots.shift();
    snapshots.push(currentSnapshot);
    writeSummary(snapshots);

  }

}

main();