import { simplify } from '../simplify.js';
import { parseDom } from '../domparser.js';

const DEFAULT_AGENT = 'Agent';
const DEFAULT_DURATION = 5000;

export default class NotificationElement {
  constructor(ticket, message) {
    this.ticket = ticket;
    this.message = message;
    this.element = parseDom(`<div class='-sbd-notification'>
            <div class='profile'>
              <img src='' alt='Profile' class='image'></img>
            </div>
            <div class='content'>
              <div class='name'>${DEFAULT_AGENT}</div>
              <div class='close'></div>
              <div class='text'></div>
            </div>
        </div>`);
    this.onClickHandler = null;
    this.element.on('click', () => {
      if (this.onClickHandler) {
        this.onClickHandler(this.ticket, this.message);
      }
    });

    const close = simplify(this.element.querySelector('.close'));
    close.on('click', e => {
      e.stopPropagation();
      e.preventDefault();
      this.close();
    });

    this.profile = simplify(this.element.querySelector('.profile'));
    this.profileImage = simplify(this.profile.querySelector('.image'));

    this.messageBox = simplify(this.element.querySelector('.content'));
    this.name = simplify(this.element.querySelector('.name'));
    this.messageText = simplify(this.messageBox.querySelector('.text'));
    this.render();
  }
  render() {
    const sender = this.message.sender || {};

    /// profile image
    if (sender.profileUrl) {
      this.profileImage.attr('src', sender.profileUrl);
      this.profileImage.show();
    } else {
      this.profileImage.hide();
    }

    /// name
    if (sender.name) {
      this.name.html(sender.name);
    }

    /// message
    if (this.message.isAdminMessage()) {
      this.messageText.html(this.message.message);
    } else if (this.message.isFileMessage()) {
      this.messageText.html(this.message.name);
    } else {
      this.messageText.html(this.message.message);
    }
  }
  open(widget, closeAfterMillisec = DEFAULT_DURATION) {
    this.widget = widget;
    this.element.addClass('fade-in');
    this.widget.element.appendChild(this.element);

    /// hide automatically
    setTimeout(() => {
      this.close();
    }, closeAfterMillisec);
  }
  close() {
    this.element.removeClass('fade-in');
    setTimeout(() => {
      if (this.element.parentNode) {
        this.widget.element.removeChild(this.element);
      }
    }, 2000);
  }
  onClick(handler) {
    this.onClickHandler = handler;
  }
}
