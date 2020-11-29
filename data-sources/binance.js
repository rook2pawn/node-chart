//const WebSocket = require("ws");

const Binance = function () {
  this.ws;
};
Binance.prototype.subscribe = function (cb) {
  this.cb = cb;
};
Binance.prototype.start = function () {
  return new Promise((resolve, reject) => {
    this.ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/ltcbtc@miniTicker"
    );
    this.ws.onopen = () => {
      console.log("Connected to binance");
      return resolve();
    };
    this.ws.onmessage = (data) => {
      console.log("message:", data);
      this.cb(data);
    };
    this.ws.onerror = function (event) {
      console.error("WebSocket error observed:", event);
    };
  });
};
Binance.prototype.stop = function () {
  if (this.ws) this.ws.close();
};

module.exports = exports = Binance;
