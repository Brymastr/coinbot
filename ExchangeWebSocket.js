const WebSocket = require('ws');

module.exports = class ExchangeWebSocket {
  constructor(url, exchange, onmessage) {
    this.url = url;
    this.exchange = exchange;
    this.connected = false;

    this.socket = this._createSocket(url, exchange, onmessage);
  }

  _createSocket(url, exchange, onmessage) {
    console.log(`Connecting ${exchange} socket...`);
    const socket = new WebSocket(url);
    socket.onmessage = onmessage.bind(this);
    socket.onopen = () => {
      console.log(`${exchange} socket connected`);
      socket.send(JSON.stringify({
        event: 'subscribe',
        channel: 'trades',
        symbol: `t${exchange}`
      }));

      this.connected = true;
    }

    socket.onclose = () => {
      this.connected = false;
    }

    return socket;
  }
}