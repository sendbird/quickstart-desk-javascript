import DOMPurify from 'dompurify';

export const simplify = elem => {
  let _build = elem => {
    /** element control
     */
    elem.html = val => {
      if (val !== undefined) {
        const clean = DOMPurify.sanitize(val);
        elem.innerHTML = clean;
      }
      return elem.innerHTML;
    };
    elem.attr = (key, val) => {
      if (val !== undefined) {
        if (val) elem.setAttribute(key, val);
        else elem.removeAttribute(key);
      }
      return elem.getAttribute(key);
    };
    elem.val = val => {
      if (val !== undefined) {
        elem.value = val;
      }
      return elem.value;
    };
    elem.simplifiedChildren = () => {
      let list = [];
      for (let i = 0; i < elem.children.length; i++) {
        list.push(simplify(elem.children[i]));
      }
      return list;
    };
    elem.removeAll = targetClass => {
      if (targetClass) {
        let itemsToRemove = [];
        let children = elem.simplifiedChildren();
        for (let i in children) {
          if (children[i].hasClass(targetClass)) {
            itemsToRemove.push(children[i]);
          }
        }
        for (let i in itemsToRemove) elem.removeChild(itemsToRemove[i]);
      } else {
        elem.innerHTML = '';
      }
    };

    /** visibility control
     */
    elem.show = displayType => {
      displayType ? (elem.style.display = displayType) : (elem.style.display = '');
      return elem;
    };
    elem.hide = () => {
      elem.style.display = 'none';
      return elem;
    };
    elem.fadeIn = (duration = 300, handler) => {
      elem.style.opacity = 0;
      elem.style.display = 'inline-block';

      let timePassed = 0;
      const tick = 10;
      const interval = setInterval(() => {
        elem.style.opacity = Math.min(timePassed / duration, 1.0);
        timePassed += tick;
        if (timePassed > duration) {
          clearInterval(interval);
          if (handler) handler();
        }
      }, tick);
    };
    elem.fadeOut = (duration = 300, handler) => {
      elem.style.opacity = 1.0;
      let timePassed = 0;
      const tick = 10;
      const interval = setInterval(() => {
        elem.style.opacity = 1.0 - Math.min(timePassed / duration, 1.0);
        timePassed += tick;
        if (timePassed > duration) {
          clearInterval(interval);
          if (handler) handler();
        }
      }, tick);
    };

    /** class control
     */
    elem.hasClass = className => {
      return elem.classList
        ? elem.classList.contains(className)
        : new RegExp('(^| )' + className + '( |$)', 'gi').test(elem.className);
    };
    elem.addClass = classNames => {
      if (!Array.isArray(classNames)) {
        classNames = classNames ? [classNames] : [];
      }
      classNames.forEach(className => {
        if (elem.classList) {
          if (!(className in elem.classList)) {
            elem.classList.add(className);
          }
        } else {
          if (elem.className.indexOf(className) < 0) {
            elem.className += ' ' + className;
          }
        }
      });
      return elem;
    };
    elem.removeClass = className => {
      if (elem.classList) {
        elem.classList.remove(className);
      } else {
        elem.className = elem.className.replace(
          new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
          ''
        );
      }
      return elem;
    };
    elem.toggleClass = className => {
      if (elem.hasClass(className)) elem.removeClass(className);
      else elem.addClass(className);
    };

    /** event control
     */
    elem.on = (type, hdlr) => {
      elem.addEventListener(type, hdlr);
    };
    elem.off = (type, hdlr) => {
      elem.removeEventListener(type, hdlr);
    };
  };
  if (elem instanceof NodeList) elem = Array.from(elem);

  if (Array.isArray(elem)) {
    for (let i in elem) {
      _build(elem[i]);
    }
  } else if (elem instanceof HTMLElement) {
    _build(elem);
  }
  return elem;
};
