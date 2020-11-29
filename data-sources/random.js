const Random = function () {};
Random.prototype.subscribe = function (cb) {
  this.cb = cb;
  this.timer;
};
Random.prototype.start = function () {
  return new Promise((resolve, reject) => {
    this.timer = setInterval(() => {
      this.cb(~~(Math.random() * 100));
    }, 1000);
    return resolve();
  });
};
Random.prototype.stop = function () {
  clearInterval(this.timer);
};

module.exports = exports = Random;
