
/**
 * Dependencies
 */

var ev = require('event'),
    delegate = require('delegate');

/**
 * Map touch events.
 * @type {Object}
 * @api private
 */

var mapper = {
	'click' : 'touchstart',
	'mousedown' : 'touchstart',
	'mouseup' : 'touchend',
	'mousemove' : 'touchmove'
};


/**
 * Expose 'Event plugin'
 */

module.exports = Events;


/**
 * Event plugin constructor
 * @param {Object} view event plugin scope
 * @param {Boolean} isTouch optional
 * @api public
 */

function Events(view, isTouch){
  this.view = view;
  this.listeners = [];
  this.isTouch = isTouch || (window.ontouchstart !== undefined);
}



/**
 * Listen events.
 * @param {HTMLElement} node 
 * @param {String} type event's type
 * @param {String} callback view's callback name
 * @param {String} capture useCapture
 * @api private
 */

Events.prototype.on = function(node, type, callback, capture) {
  var _this = this,
      cap = (capture === 'true'),
      cb = function(e) {
        _this.view[callback].call(_this.view, e, node);
      };
  ev.bind(node, this.map(type), cb, cap);
  this.listeners.push([node, this.map(type), cb, cap]);
};


/**
 * Event delegation.
 * @param {HTMLElement} node 
 * @param {String} selector
 * @param {String} type event's type
 * @param {String} callback view's callback name
 * @param {String} capture useCapture
 * @api private
 */

Events.prototype.delegate = function(node, selector, type, callback, capture) {
  var _this = this,
      cap = (capture === 'true'),
      cb = delegate.bind(node, selector, this.map(type), function(e){
      _this.view[callback].call(_this.view, e, node);
      }, cap);
  this.listeners.push([node, this.map(type), cb, cap]);
};


/**
 * Map events (desktop and mobile)
 * @param  {String} type event's name
 * @return {String} mapped event
 */

Events.prototype.map = function(type) {
	return this.isTouch ? (mapper[type] || type) : type;
};


/**
 * Remove all listeners.
 * @api public
 */

Events.prototype.destroy = function() {
  for(var l = this.listeners.length; l--;) {
    var listener = this.listeners[l];
    ev.unbind(listener[0], listener[1], listener[2], listener[3]);
  }
};