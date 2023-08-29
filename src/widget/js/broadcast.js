const _queue = {};
let _subscribeSeed = 0;
const generateSID = () => {
  return _subscribeSeed++;
};

export default class Broadcast {
  constructor(event, callback) {
    this._sid = generateSID();
    this.event = event;
    this.callback = callback;
  }
  static send(event, data) {
    if (event instanceof Array) {
      for (let i in event) {
        Broadcast.send(event[i], data);
      }
    } else {
      if (_queue[event]) {
        for (let i in _queue[event]) {
          _queue[event][i].callback(data);
        }
      }
    }
  }
  static subscribe(event, callback) {
    const sub = new Broadcast(event, callback);
    if (!_queue[event]) _queue[event] = [];
    _queue[event].push(sub);
    return sub;
  }
  static unsubscribe(subscriber) {
    const event = subscriber.event;
    if (_queue[event]) {
      for (let i in _queue[event]) {
        if (_queue[event][i]._sid === subscriber._sid) {
          _queue[event].splice(i, 1);
          break;
        }
      }
    }
  }
}
