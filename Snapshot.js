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

module.exports = Snapshot;