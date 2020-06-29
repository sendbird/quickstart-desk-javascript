import { simplify } from './simplify.js';
import { parseDom } from './domparser.js';

import Broadcast from './broadcast.js';
import Widget from './widget.js';

const ADVANCED_OPTION = true;

const LOGIN_CACHE_KEY_APP_ID = 'sb-desk-appId';
const LOGIN_CACHE_KEY_USER_ID = 'sb-desk-userId';
const LOGIN_CACHE_KEY_NICKNAME = 'sb-desk-nickname';
const LOGIN_CACHE_KEY_ADVANCED = 'sb-desk-advanced';
const LOGIN_CACHE_KEY_ADVANCED_WS_HOST = 'sb-desk-advanced-wshost';
const LOGIN_CACHE_KEY_ADVANCED_API_HOST = 'sb-desk-advanced-apihost';
const LOGIN_CACHE_KEY_ADVANCED_DESK_API_HOST = 'sb-desk-advanced-deskApihost';

export default class Login {
  constructor() {
    const caching = !!window.localStorage;
    const cachedUser = {
      appId: '',
      userId: '',
      nickname: ''
    };
    const cachedAdvanced = {
      active: false,
      wsHost: '',
      apiHost: ''
    };
    if (caching) {
      cachedUser.appId = localStorage.getItem(LOGIN_CACHE_KEY_APP_ID) || '';
      cachedUser.userId = localStorage.getItem(LOGIN_CACHE_KEY_USER_ID) || '';
      cachedUser.nickname = localStorage.getItem(LOGIN_CACHE_KEY_NICKNAME) || '';

      /// advanced option
      cachedAdvanced.active = localStorage.getItem(LOGIN_CACHE_KEY_ADVANCED) === 'true' || false;
      cachedAdvanced.wsHost = localStorage.getItem(LOGIN_CACHE_KEY_ADVANCED_WS_HOST) || '';
      cachedAdvanced.apiHost = localStorage.getItem(LOGIN_CACHE_KEY_ADVANCED_API_HOST) || '';
      cachedAdvanced.deskApiHost = localStorage.getItem(LOGIN_CACHE_KEY_ADVANCED_DESK_API_HOST) || '';
    }

    this.element = parseDom(`<div class='-sbd-login-background'>
          <div class='-sbd-login'>
            <div class='logo'></div>
            <div class='title'><span class='bold'>Desk Widget</span> Login</div>
            <div class='panel'>
              <div class='form form-login'>
                <span class='input-label'>App ID</span>
                <input class='appId input' placeholder='App ID' value='${cachedUser.appId}'></input>
                <span class='input-label'>User ID</span>
                <input class='userId input' placeholder='User ID' value='${cachedUser.userId}'></input>
                <span class='input-label'>Name</span>
                <input class='nickname input' placeholder='Name' value='${cachedUser.nickname}'></input>
                <div class='error'></div>
              </div>
              <div class='separator'></div>
              <div class='control'>
                <div class='advanced'>
                  <div class='label'>Advanced</div>
                </div>
                <div class='login button'>Login</div>
              </div>
              <div class='form form-advanced'>
                <span class='input-label'>Custom WebSocket host</span>
                <input class='wsHost input' placeholder='Custom WebSocket host' value='${
                  cachedAdvanced.wsHost
                }'></input>
                <span class='input-label'>Custom API host</span>
                <input class='apiHost input' placeholder='Custom API host' value='${cachedAdvanced.apiHost}'></input>
                <span class='input-label'>Custom Desk API host</span>
                <input class='deskApiHost input' placeholder='Custom Desk API host' value='${
                  cachedAdvanced.deskApiHost
                }'></input>
              </div>
            </div>
          </div>
        </div>`);

    const appId = simplify(this.element.querySelector('.form-login .appId'));
    const userId = simplify(this.element.querySelector('.form-login .userId'));
    const nickname = simplify(this.element.querySelector('.form-login .nickname'));

    let advancedActive = cachedAdvanced.active;
    const advancedLabel = simplify(this.element.querySelector('.advanced .label'));
    const advancedForm = simplify(this.element.querySelector('.form-advanced'));
    advancedLabel.on('click', () => {
      advancedLabel.toggleClass('open');
      advancedActive = !advancedActive;
      if (advancedActive) advancedForm.show();
      else advancedForm.hide();
    });
    if (advancedActive) advancedForm.show();
    else advancedForm.hide();

    const wsHost = simplify(this.element.querySelector('.form-advanced .wsHost'));
    const apiHost = simplify(this.element.querySelector('.form-advanced .apiHost'));
    const deskApiHost = simplify(this.element.querySelector('.form-advanced .deskApiHost'));
    if (!ADVANCED_OPTION) {
      advancedLabel.hide();
    }

    const error = simplify(this.element.querySelector('.form-login .error'));
    const login = simplify(this.element.querySelector('.control .login'));

    login.on('click', () => {
      const user = {
        appId: appId.val(),
        userId: userId.val(),
        nickname: nickname.val()
      };
      if (user.appId && user.userId && user.nickname) {
        const options = {};
        if (caching) {
          localStorage.setItem(LOGIN_CACHE_KEY_APP_ID, user.appId);
          localStorage.setItem(LOGIN_CACHE_KEY_USER_ID, user.userId);
          localStorage.setItem(LOGIN_CACHE_KEY_NICKNAME, user.nickname);
          if (advancedActive) {
            options.wsHost = wsHost.val();
            options.apiHost = apiHost.val();
            options.deskApiHost = deskApiHost.val();
            localStorage.setItem(LOGIN_CACHE_KEY_ADVANCED_WS_HOST, options.wsHost);
            localStorage.setItem(LOGIN_CACHE_KEY_ADVANCED_API_HOST, options.apiHost);
            localStorage.setItem(LOGIN_CACHE_KEY_ADVANCED_DESK_API_HOST, options.deskApiHost);
          }
          localStorage.setItem(
            LOGIN_CACHE_KEY_ADVANCED,
            advancedActive && options.wsHost && options.apiHost && options.deskApiHost ? 'true' : 'false'
          );
        }
        new Widget(user, options);
        this.hide();
      } else {
        error.html('Insert app ID, user ID and name to login.');
        error.show();
      }
    });
    Broadcast.subscribe('signout', () => this.show());
    this.show();
  }
  show() {
    document.body.appendChild(this.element);
    this.element.addClass('shown');
  }
  hide() {
    this.element.removeClass('shown');
    setTimeout(() => {
      document.body.removeChild(this.element);
    }, 2000);
  }
}
window.onload = () => {
  new Login();
};
