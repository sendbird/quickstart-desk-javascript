import { parseDom } from '../domparser.js';

export default class Spinner {
  constructor() {
    this.attachCount = 0;
    this.element = parseDom(`<div class='-sbd-spinner'>
            <div class='-sbd-spinner-wrapper'>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>`);
  }
  isAttached() {
    return !!this.element.parentNode;
  }
  attachTo(elem) {
    this.attachCount++;
    if (!this.isAttached()) elem.appendChild(this.element);
  }
  detach() {
    this.attachCount--;
    if (this.isAttached() && this.attachCount === 0) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
