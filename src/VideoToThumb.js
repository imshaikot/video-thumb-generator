import 'weakmap-polyfill';
import { polyfill } from 'es6-object-assign';
import Video from './video';

const _PRIVATE = new WeakMap();
polyfill();

const OBJECT_URL_TYPE = 'objectURL';

class VideoToThumb {
  /**
   * @param {*} resource
   */
  constructor(resource) {
    this.resource = resource;
    _PRIVATE.set(this, {
      resource,
      prepareURL: () => {
        if (Blob && _PRIVATE.get(this).resource instanceof Blob) {
          _PRIVATE.get(this).resource = URL.createObjectURL(resource);
        } else if (typeof this.resource !== 'string') {
          _PRIVATE.get(this).__errorCB('Resource reference was expecting whether a Blob/File Object or a string reference to a valid video URL');
        }
      },
      mergeConfig: () => {
        Object.keys(_PRIVATE.get(this).__configStack).forEach((key) => {
          _PRIVATE.get(this).__settings[key] = _PRIVATE.get(this).__configStack[key];
        });
      },
      __configStack: {},
      __errorCB: () => {},
      __settings: {
        xy: [0, 0],
        size: [320, 240],
        returnType: OBJECT_URL_TYPE,
        skips: [0],
      },
    });
  }

  load() {
    return this;
  }

  /**
   * @param {*} val
   */
  xy(val = [0, 0]) {
    _PRIVATE.get(this).__configStack.xy = val;
    return this;
  }
  /**
   * @param {*} val
   */
  size(val = [320, 240]) {
    _PRIVATE.get(this).__configStack.size = val;
    return this;
  }
  /**
   * @param {*} val
   */
  type(val = OBJECT_URL_TYPE) {
    _PRIVATE.get(this).__configStack.returnType = val;
    return this;
  }
  /**
   * @param {*} val
   */
  positions(val = [0]) {
    _PRIVATE.get(this).__configStack.skips = val;
    return this;
  }
  /**
   * @param {*} callback
   */
  error(callback) {
    _PRIVATE.get(this).__errorCB = callback;
    return this;
  }
  /**
   * @param {*} successCB
   * @param {*} errorCB
   */
  done(successCB) {
    _PRIVATE.get(this).prepareURL();
    _PRIVATE.get(this).mergeConfig();
    const positions = [..._PRIVATE.get(this).__settings.skips];
    const video = new Video(_PRIVATE.get(this).resource);
    try {
      video
        .initialize(_PRIVATE.get(this).__settings)
        .then(() => {
          if (!positions.length) return successCB([]);
          const reverseOrder = () => {
            positions.shift();
            if (!positions.length) {
              return successCB(video.thumbs.map(thumb => (_PRIVATE.get(this)
                .__settings.returnType === OBJECT_URL_TYPE ?
                URL.createObjectURL(thumb) : thumb)));
            }
            return video.getSnaps(positions[0])
              .then(reverseOrder);
          };
          return video.getSnaps(positions[0]).then(reverseOrder);
        }).catch(_PRIVATE.get(this).__errorCB);
    } catch (err) {
      _PRIVATE.get(this).__errorCB(err);
    }
    return this;
  }
}

window.VideoToThumb = VideoToThumb;

export default VideoToThumb;
