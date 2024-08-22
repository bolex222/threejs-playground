export type SubscribeFunction = (
  width: number,
  height: number,
  dpr: number,
) => void;

class ScreenManager {
  public width: number = 0;
  public height: number = 0;
  public dpr: number = 1;

  private subscribers: Array<SubscribeFunction> = [];

  public constructor() {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", this.handleResize);
    const resizeObserver = new ResizeObserver(this.handleResize);
    resizeObserver.observe(document.body);
  }

  private handleResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = window.devicePixelRatio;
    this.notifyAllSubscribers();
  };

  private notifyAllSubscribers = () => {
    for (const subscriber of this.subscribers) {
      subscriber(this.width, this.height, this.dpr);
    }
  };

  public subscribe = (callback: SubscribeFunction) => {
    this.unsubscribe(callback);
    this.subscribers.push(callback);
  };

  public unsubscribe = (callback: SubscribeFunction) => {
    this.subscribers = this.subscribers.filter(
      (subscriber) => callback !== subscriber,
    );
  };
}

const screenManger = new ScreenManager();
export default screenManger;
