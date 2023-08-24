import { simplify } from './simplify.js';
import DOMPurify from 'dompurify';

export const parseDom = es => {
  var $ = document.createElement('div');
  let clean = DOMPurify.sanitize(es);
  $.innerHTML = clean.trim();
  $ = simplify($.firstChild);
  if ($.parentNode) $.parentNode.removeChild($);
  return $;
};
