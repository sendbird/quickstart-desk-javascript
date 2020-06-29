import { simplify } from './simplify.js';

export const parseDom = es => {
  var $ = document.createElement('div');
  $.innerHTML = es.trim();
  $ = simplify($.firstChild);
  if ($.parentNode) $.parentNode.removeChild($);
  return $;
};
