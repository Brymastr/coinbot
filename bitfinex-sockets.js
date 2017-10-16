const WebSocket = require('ws');
const url = 'wss://api.bitfinex.com/ws/2';

const socket = new WebSocket(url);
socket.onmessage = message => {
  const data = JSON.parse(message.data);
  const channelId = data[0];
  const type = data[1];
  const info = data[2];
  if(type === 'tu') {
    let tradeId, timestamp, quantity, price;
    [tradeId, timestamp, quantity, price] = info;
    console.log(`${Math.abs(quantity)} BTC traded at $${price} USD`)
  }
};

socket.on('open', () => {
  socket.send(JSON.stringify({
    event: 'subscribe',
    channel: 'trades',
    symbol: 'tBTCUSD'
  }));
});