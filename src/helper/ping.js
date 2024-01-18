export class Ping {
  constructor(times, interval) {
    this.times = times;
    this.interval = interval;
  }
  
  count = 0;
  async execute(fn) {
    console.log(`ping: times ${this.times}, interval ${this.interval}`);
    if (this.count < this.times) {
      await fn();
      this.count++;
      setTimeout(async () => {
        await this.execute(fn);
      }, this.interval);
    }
  }
}
