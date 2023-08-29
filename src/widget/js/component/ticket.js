import moment from 'moment';

import { simplify } from '../simplify.js';
import { parseDom } from '../domparser.js';

const NO_MESSAGE = 'No message';
const MAX_BADGE_COUNT = 99;

export default class TicketElement {
  constructor(widget, ticket) {
    this.ticket = ticket;
    this.element = parseDom(`<div class='-sbd-ticket-item'>
            <div class='profile'>
                <img src='${ticket.agent ? ticket.agent.profileUrl : ''}' alt='Profile' class='image'></img>
                <div class='badge'></div>
            </div>
            <div class='content'>
                <div class='name'>${ticket.agent ? ticket.agent.name : ticket.title}</div>
                <div class='last'>${ticket.channel.lastMessage.message || NO_MESSAGE}</div>
            </div>
            <div class='updated-at'></div>
        </div>`);

    this.profileImage = simplify(this.element.querySelector('.profile .image'));
    this.badge = simplify(this.element.querySelector('.profile .badge'));
    this.name = simplify(this.element.querySelector('.content .name'));
    this.last = simplify(this.element.querySelector('.content .last'));
    this.updatedAt = simplify(this.element.querySelector('.updated-at'));
    this.render();

    this.element.on('click', () => {
      widget.startNewDialog(this.ticket);
    });
  }
  render() {
    const agent = this.ticket.agent;
    if (agent && agent.profileUrl) {
      this.profileImage.attr('src', agent.profileUrl);
      this.profileImage.show();
    } else {
      this.profileImage.hide();
    }

    let n = this.ticket.channel.unreadMessageCount;
    if (n > 0) {
      if (n >= MAX_BADGE_COUNT) {
        n = n + '+';
      }
      this.badge.html(n);
      this.badge.show();
    } else {
      this.badge.hide();
    }

    this.name.html(agent ? agent.name : this.ticket.title);
    if (this.ticket.channel.lastMessage) {
      if (this.ticket.channel.lastMessage.isFileMessage()) {
        this.last.html(this.ticket.channel.lastMessage.name);
      } else {
        this.last.html(this.ticket.channel.lastMessage.message);
      }
    }
    this.updatedAt.html(
      moment(this.ticket.channel.lastMessage ? this.ticket.channel.lastMessage.createdAt : null).fromNow()
    );
  }
}
