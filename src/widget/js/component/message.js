import SendBirdDesk from 'sendbird-desk';
import moment from 'moment';

import { simplify } from '../simplify.js';
import { parseDom } from '../domparser.js';
import { getSb } from '../globalStore.js';

export default class MessageElement {
  constructor(message, streak) {
    this.message = message;
    this.streak = !!streak;
    this.element = parseDom(`<div class='-sbd-message-item'>
            <div class='profile'>
                <img src='' alt='Profile' class='image'></img>
            </div>
            <div class='content'>
                <div class='media'>
                    <img src='' alt='Image' class='image'></img>
                    <video src='' controls='controls' width='240' height='200' class='video'></video>
                </div>
                <div class='preview'>
                    <img src='' alt='Image' class='image'></img>
                    <div class='title'></div>
                    <div class='description'></div>
                </div>
                <div class='message'>
                  <div class='file'></div>
                  <div class='text'></div>
                </div>
                <div class='rating'>
                  <div class='rating-message'></div>
                  <div class='rating-score'>
                    <div class='rating-item'></div>
                    <div class='rating-item'></div>
                    <div class='rating-item'></div>
                    <div class='rating-item'></div>
                    <div class='rating-item'></div>
                  </div>
                  <div class='rating-form'>
                    <textarea class='rating-comment' placeholder='(Optional)'></textarea>
                    <button class='rating-submit'>Submit</button>
                  </div>
                </div>
                <div class='rating-result'>
                  <div class='rating-message'>Thank you!</div>
                  <div class='rating-description'>Your submission has been received</div>
                  <div class='line'></div>
                  <div class='rating-result-score'>
                    <div class='rating-result-item'></div>
                    <div class='rating-result-item'></div>
                    <div class='rating-result-item'></div>
                    <div class='rating-result-item'></div>
                    <div class='rating-result-item'></div>
                    <div class='rating-result-number'></div>
                  </div>
                  <div class='rating-result-comment'></div>
                </div>
                <div class='created-at'></div>
            </div>
            <div class='confirm-end-of-chat'>
              <div class='message'></div>
              <div class='confirm'>
                <div class='yes button'>Yes</div>
                <div class='no button'>No</div>
              </div>
            </div>
        </div>`);

    this.isSatisfactionForm = false;
    this.satisfaction = {
      score: null,
      comment: null,
      sent: false
    };

    this.content = simplify(this.element.querySelector('.content'));
    this.media = simplify(this.content.querySelector('.media'));
    this.image = simplify(this.media.querySelector('.image'));
    this.video = simplify(this.media.querySelector('.video'));

    this.preview = simplify(this.element.querySelector('.preview'));
    this.previewImage = simplify(this.preview.querySelector('.image'));
    this.previewTitle = simplify(this.preview.querySelector('.title'));
    this.previewDescription = simplify(this.preview.querySelector('.description'));

    this.profile = simplify(this.element.querySelector('.profile'));
    this.profileImage = simplify(this.profile.querySelector('.image'));

    this.messageBox = simplify(this.element.querySelector('.content .message'));
    this.messageFile = simplify(this.messageBox.querySelector('.file'));
    this.messageText = simplify(this.messageBox.querySelector('.text'));
    this.createdAt = simplify(this.element.querySelector('.created-at'));

    this.confirmEndOfChat = simplify(this.element.querySelector('.confirm-end-of-chat'));
    this.confirmMessage = simplify(this.confirmEndOfChat.querySelector('.message'));
    this.confirm = simplify(this.confirmEndOfChat.querySelector('.confirm'));
    this.yes = simplify(this.confirm.querySelector('.yes'));
    this.no = simplify(this.confirm.querySelector('.no'));

    this.yes.on('click', () => {
      this.ticket.instanceConfirmEndOfChat(this.message, 'yes');
    });
    this.no.on('click', () => {
      this.ticket.instanceConfirmEndOfChat(this.message, 'no');
    });

    this.rating = simplify(this.element.querySelector('.rating'));
    this.ratingMessage = simplify(this.rating.querySelector('.rating-message'));
    this.ratingItems = simplify(this.rating.querySelectorAll('.rating-item'));

    this.ratingForm = simplify(this.rating.querySelector('.rating-form'));
    this.ratingComment = simplify(this.rating.querySelector('.rating-comment'));
    this.ratingSubmit = simplify(this.rating.querySelector('.rating-submit'));

    this.ratingItems.forEach((elem, index) => {
      elem.on('click', () => {
        if (!this.satisfaction.sent) {
          for (let i = 0; i < this.ratingItems.length; i++) {
            if (i <= index) {
              this.ratingItems[i].addClass('selected');
            } else {
              this.ratingItems[i].removeClass('selected');
            }
          }
          this.satisfaction.score = index + 1;
          this.ratingForm.show();
        }
      });
    });
    this.ratingSubmit.on('click', () => {
      if (!this.satisfaction.sent) {
        const commentText = this.ratingComment.val();
        this.ticket.instanceSubmitFeedback(this.message, this.satisfaction.score, commentText, (res, err) => {
          if (!err) {
            this.satisfaction.comment = commentText;
            this.satisfaction.sent = true;
          }
        });
      }
    });

    this.ratingResult = simplify(this.element.querySelector('.rating-result'));
    this.ratingResultItems = simplify(this.ratingResult.querySelectorAll('.rating-result-item'));
    this.ratingResultNumber = simplify(this.ratingResult.querySelector('.rating-result-number'));
    this.ratingResultComment = simplify(this.ratingResult.querySelector('.rating-result-comment'));

    this.render();
  }
  addTicket(ticket) {
    this.ticket = ticket;
  }
  render() {
    const sb = getSb();
    const sender = this.message.sender || {};
    if (sb.currentUser.userId === sender.userId) {
      this.messageFile.removeClass('file');
      this.messageFile.addClass('my-file');
      this.element.addClass('-sbd-my-message');
    }
    if (this.message.isAdminMessage()) {
      this.element.addClass('-sbd-admin-message');
    }

    try {
      const messageData = JSON.parse(this.message.data);
      if (messageData.type === 'SENDBIRD_DESK_CUSTOMER_SATISFACTION') {
        this.isSatisfactionForm = true;
        this.satisfaction.ticketId = messageData.body.ticketId;
        if (messageData.body.status !== 'WAITING') {
          this.satisfaction.score = messageData.body.customerSatisfactionScore;
          this.satisfaction.comment = messageData.body.customerSatisfactionComment;
          this.satisfaction.sent = true;
        }
      }
    } catch (e) {
      // console.log(e);
    }

    /// profile image
    if (sender.profileUrl) {
      this.profileImage.attr('src', sender.profileUrl);
      this.profileImage.show();
    } else if (this.message.isAdminMessage()) {
      this.profileImage.attr('src', '');
    } else {
      this.profileImage.hide();
    }

    /// data
    if (!this.isSatisfactionForm) {
      this.preview.hide();
      if (this.message.data) {
        try {
          const data = JSON.parse(this.message.data);
          switch (data.type) {
            case SendBirdDesk.Message.DataType.URL_PREVIEW:
              this.message.message = this.message.message.replace(
                SendBirdDesk.Message.UrlRegExp,
                url => `<a href='${url}' target='_blank'>${url}</a>`
              );
              if (data.body.url && data.body.title) {
                this.preview.attr('href', data.body.url);
                this.previewTitle.html(data.body.title);

                if (data.body.image) {
                  this.previewImage.attr('src', data.body.image);
                  this.previewImage.show();
                } else {
                  this.previewImage.hide();
                }
                if (data.body.description) {
                  this.previewDescription.html(data.body.description);
                }
                this.preview.on('click', () => window.open(data.body.url, '_blank'));
                this.preview.show();
              }
              break;

            case SendBirdDesk.Message.DataType.TICKET_FEEDBACK:
              // TODO:
              break;
          }
        } catch (e) {
          // DO NOTHING
        }
      }

      /// message
      if (this.message.isAdminMessage()) {
        this.messageFile.hide();
        this.media.hide();
        this.messageBox.show();
        this.messageText.html(this.message.message);
      } else if (this.message.isFileMessage()) {
        if (this.message.type.indexOf('image') >= 0) {
          this.messageBox.hide();
          this.video.hide();
          this.image.attr('src', this.message.url);
        } else if (this.message.type.indexOf('video') >= 0) {
          this.messageBox.hide();
          this.image.hide();
          this.video.attr('src', this.message.url);
        } else {
          this.messageFile.show('inline-block');
          this.media.hide();
          this.messageBox.show();
          this.messageText.html(this.message.name);
          this.messageText.addClass('file-name');
          this.messageText.on('click', () => {
            window.open(this.message.url, '_blank');
          });
        }
      } else {
        this.messageFile.hide();
        this.media.hide();
        this.messageBox.show();
        this.messageText.html(this.message.message);
      }

      if (this.streak) this.createdAt.hide();
      this.createdAt.html(moment(this.message.createdAt).fromNow());

      let data = null;
      try {
        data = this.message.data ? JSON.parse(this.message.data) : null;
      } catch (e) {
        throw e;
      }
      const isClosureInquired = data && data.type === SendBirdDesk.Message.DataType.TICKET_INQUIRE_CLOSURE;
      if (isClosureInquired) {
        const closureInquiry = data.body;
        switch (closureInquiry.state) {
          case SendBirdDesk.Message.ClosureState.WAITING:
            this.profile.hide();
            this.content.hide();
            this.confirmMessage.html(this.message.message);
            this.confirmEndOfChat.show();
            break;

          default:
            this.confirmEndOfChat.hide();
        }
      } else {
        this.confirmEndOfChat.hide();
      }
      this.rating.hide();
      this.ratingResult.hide();
    } else {
      this.preview.hide();
      this.media.hide();
      this.messageBox.hide();
      this.confirmEndOfChat.hide();

      if (this.satisfaction.sent) {
        this.rating.hide();
        this.ratingResult.show();
        this.ratingResultItems.forEach((elem, index) => {
          if (index + 1 <= this.satisfaction.score) {
            elem.addClass('selected');
          }
        });
        this.ratingResultNumber.html(this.satisfaction.score);
        if (this.satisfaction.comment) {
          this.ratingResultComment.html(this.satisfaction.comment);
        } else {
          this.ratingResultComment.hide();
        }
      } else {
        this.rating.show();
        this.ratingResult.hide();
        this.ratingMessage.html(this.message.message);
      }
      this.ratingForm.hide();
    }
  }

  static get Script() {
    return {
      TICKET_ASSIGNED: 'Ticket assigned.',
      TICKET_CLOSED: 'Ticket closed.',
      TICKET_START: 'Hi, what can I help you?'
    };
  }
  static isVisible(message) {
    let data = null;
    try {
      data = message.data ? JSON.parse(message.data) : null;
    } catch (e) {
      throw e;
    }
    message.isSystemMessage = message.customType === 'SENDBIRD_DESK_ADMIN_MESSAGE_CUSTOM_TYPE';
    message.isAssigned = data && data.type === SendBirdDesk.Message.DataType.TICKET_ASSIGN;
    message.isTransferred = data && data.type === SendBirdDesk.Message.DataType.TICKET_TRANSFER;
    message.isClosed = data && data.type === SendBirdDesk.Message.DataType.TICKET_CLOSE;
    return !message.isSystemMessage && !message.isAssigned && !message.isTransferred && !message.isClosed;
  }
}
