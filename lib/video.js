'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = require('./canvas');

var _canvas2 = _interopRequireDefault(_canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Video = function () {
  function Video(uri) {
    _classCallCheck(this, Video);

    this.node = document.createElement('video');
    this.node.setAttribute('src', uri);
    this.node.setAttribute('muted', true);
    this.node.setAttribute('controls', true);
    this.node.style.display = 'none';
    this.node.width = 320;
    this.thumbs = [];
  }

  _createClass(Video, [{
    key: 'initialize',
    value: function initialize(configs) {
      var _this = this;

      var _configs$size = _slicedToArray(configs.size, 2);

      this.node.width = _configs$size[0];
      this.node.height = _configs$size[1];

      this.configs = configs;
      return new Promise(function (resolve, reject) {
        var MediaError = function MediaError(event) {
          var err = {
            type: 'media_' + event.type,
            error: event
          };
          reject(err);
        };

        _this.node.addEventListener('error', MediaError);
        _this.node.addEventListener('abort', MediaError);

        _this.node.addEventListener('canplaythrough', function () {
          _this.node.removeEventListener('error', MediaError);
          _this.node.removeEventListener('abort', MediaError);
          resolve();
        });
      });
    }
  }, {
    key: 'getSnaps',
    value: function getSnaps() {
      var _this2 = this;

      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      return new Promise(function (resolve, reject) {
        if (position > _this2.node.duration) return resolve();
        var onMediaError = function onMediaError(event) {
          var err = {
            type: 'media_' + event.type,
            error: event
          };
          reject(err);
        };
        _this2.node.addEventListener('suspend', onMediaError);
        _this2.node.addEventListener('abort', onMediaError);
        var onSeeked = function onSeeked() {
          _this2.node.removeEventListener('suspend', onMediaError);
          _this2.node.removeEventListener('abort', onMediaError);
          _this2.node.removeEventListener('seeked', onSeeked);
          _canvas2.default.capture(_this2.node, _this2.configs).then(function (data) {
            _this2.thumbs.push(data);
            resolve();
          }).catch(reject);
        };
        _this2.node.addEventListener('seeked', onSeeked);
        _this2.node.currentTime = Number(position);
        return null;
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return this.node.remove();
    }
  }]);

  return Video;
}();

exports.default = Video;