'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _video = require('./video');

var _video2 = _interopRequireDefault(_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _PRIVATE = new WeakMap();

var OBJECT_URL_TYPE = 'objectURL';

var VideoToThumb = function () {
  /**
   * @param {*} resource
   */
  function VideoToThumb(resource) {
    var _this = this;

    _classCallCheck(this, VideoToThumb);

    this.resource = resource;
    _PRIVATE.set(this, {
      resource: resource,
      prepareURL: function prepareURL() {
        if (Blob && _PRIVATE.get(_this).resource instanceof Blob) {
          _PRIVATE.get(_this).resource = URL.createObjectURL(resource);
        } else if (typeof _this.resource !== 'string') {
          throw new Error('Resource reference was expecting whether a Blob/File Object or a string reference to a valid video URL');
        }
      },
      __settings: {
        xy: [0, 0],
        size: [320, 240],
        returnType: OBJECT_URL_TYPE,
        skips: [0]
      }
    });
  }

  _createClass(VideoToThumb, [{
    key: 'load',
    value: function load() {
      _PRIVATE.get(this).prepareURL();
      return this;
    }

    /**
     * @param {*} val
     */

  }, {
    key: 'xy',
    value: function xy() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0];

      _PRIVATE.get(this).__settings.xy = val;
      return this;
    }
    /**
     * @param {*} val
     */

  }, {
    key: 'size',
    value: function size() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [320, 240];

      _PRIVATE.get(this).__settings.size = val;
      return this;
    }
    /**
     * @param {*} val
     */

  }, {
    key: 'type',
    value: function type() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : OBJECT_URL_TYPE;

      _PRIVATE.get(this).__settings.returnType = val;
      return this;
    }
    /**
     * @param {*} val
     */

  }, {
    key: 'positions',
    value: function positions() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0];

      _PRIVATE.get(this).__settings.skips = val;
      return this;
    }
    /**
     * @param {*} successCB
     * @param {*} errorCB
     */

  }, {
    key: 'done',
    value: function done(successCB, errorCB) {
      var _this2 = this;

      var positions = [].concat(_toConsumableArray(_PRIVATE.get(this).__settings.skips));
      var video = new _video2.default(_PRIVATE.get(this).resource);
      try {
        video.initialize(_PRIVATE.get(this).__settings).then(function () {
          if (!positions.length) return successCB([]);
          var reverseOrder = function reverseOrder() {
            positions.shift();
            if (!positions.length) {
              return successCB(video.thumbs.map(function (thumb) {
                return _PRIVATE.get(_this2).__settings.returnType === OBJECT_URL_TYPE ? URL.createObjectURL(thumb) : thumb;
              }));
            }
            return video.getSnaps(positions[0]).then(reverseOrder);
          };
          return video.getSnaps(positions[0]).then(reverseOrder);
        }).catch(errorCB);
      } catch (err) {
        errorCB(err);
      }
      return this;
    }
  }]);

  return VideoToThumb;
}();

window.VideoToThumb = VideoToThumb;

exports.default = VideoToThumb;