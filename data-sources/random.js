const Random = function () {};
Random.prototype.subscribe = function (cb) {
  this.cb = cb;
  this.timer;
  this.flipTimer;
  this.isFlipped = false;
};
Random.prototype.start = function () {
  return new Promise((resolve, reject) => {
    this.flipTimer = setInterval(() => {
      this.isFlipped = !this.isFlipped;
    }, 10 * 1000);
    this.timer = setInterval(() => {
      let number = this.isFlipped ? Math.random() * 100 : Math.random() * 10;
      this.cb(number);
    }, 1000);
    return resolve();
  });
};
Random.prototype.stop = function () {
  clearInterval(this.timer);
  clearInterval(this.flipTimer);
};

module.exports = exports = Random;
