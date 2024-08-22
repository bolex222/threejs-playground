import Stats from "stats.js";

type ITickerCallback = (time: number, deltaTime: number, frame: number) => void;

class Ticker {
  private subscribers: Array<{ callback: ITickerCallback; priority: number }> =
    [];
  private stats?: Stats;
  private currentRaf: number | null = null;
  private frame = 0;
  private previouseTime = 0;

  constructor() {
    if (window.location.hash === "#debug") {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom as HTMLElement);
    }
    this.currentRaf = requestAnimationFrame(this.tick);
  }

  public subscribe = (
    callback: ITickerCallback,
    priority: undefined | number = undefined,
  ) => {
    this.subscribers.push({
      callback,
      priority: priority !== undefined ? priority : this.subscribers.length,
    });
    this.sortSubscribers();
  };

  public unsubscribe = (callback: ITickerCallback) => {
    this.subscribers = this.subscribers.filter((c) => c.callback !== callback);
  };

  private sortSubscribers = () => {
    this.subscribers.sort((a, b) => {
      return a.priority - b.priority;
    });
  };

  private tick = (time: number) => {
    this.stats?.begin();
    const deltaTime = time - this.previouseTime;
    this.frame++;
    for (const s of this.subscribers) {
      s.callback(time, deltaTime, this.frame);
    }
    this.previouseTime = time;
    this.stats?.end();
    this.currentRaf = requestAnimationFrame(this.tick);
  };

  kill = () => {
    if (this.currentRaf !== null) cancelAnimationFrame(this.currentRaf);

    this.subscribers = [];
  };
}

const globalTicker = new Ticker();
export default globalTicker;
