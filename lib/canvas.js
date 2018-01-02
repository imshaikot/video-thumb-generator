'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var singleton = Symbol();
var singletonEnforcer = Symbol();

var OBJECT_URL_TYPE = 'objectURL';
var DATA_URL_TYPE = 'base64';

var Canvas = function () {
  function Canvas(enforcer) {
    _classCallCheck(this, Canvas);

    if (enforcer !== singletonEnforcer) throw new Error('Cannot construct singleton');
    this.node = document.createElement('canvas');
  }

  _createClass(Canvas, [{
    key: 'capture',
    value: function capture(videoNode, configs) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var w = configs.size[0];
        var h = configs.size[1];
        var x = configs.xy[0];
        var y = configs.xy[1];
        _this.node.width = w;
        _this.node.height = h;
        _this.node.getContext('2d').drawImage(videoNode, x, y, w, h);
        if (configs.returnType === OBJECT_URL_TYPE) {
          _this.node.toBlob(function (blob) {
            return resolve(blob);
          });
        } else if (configs.returnType === DATA_URL_TYPE) {
          resolve(_this.node.toDataURL());
        } else {
          var err = {
            type: 'Canvas_Error',
            message: 'type must be between ' + OBJECT_URL_TYPE + ' or ' + DATA_URL_TYPE + ' but found ' + configs.returnType
          };
          reject(err);
        }
      });
    }
  }], [{
    key: 'instance',
    get: function get() {
      if (!this[singleton]) {
        this[singleton] = new Canvas(singletonEnforcer);
      }
      return this[singleton];
    }
  }]);

  return Canvas;
}();

exports.default = Canvas.instance;