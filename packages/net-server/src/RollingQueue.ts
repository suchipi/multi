export default class RollingQueue<T> {
  items: Array<T>;
  maxSize: number;

  constructor(maxSize: number) {
    this.items = [];
    this.maxSize = maxSize;
  }

  add(item: T) {
    this.items.push(item);
    if (this.items.length > this.maxSize) {
      this.items.shift();
    }
  }

  find(predicate: (item: T) => boolean) {
    return this.items.find(predicate);
  }

  mostRecent(): T {
    return this.items[this.items.length - 1];
  }
}
