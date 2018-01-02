import Video from './video';

const _PRIVATE = new WeakMap();

const OBJECT_URL_TYPE = 'objectURL';
const DATA_URL_TYPE = 'dataURL';

class VideoToThumb {
  constructor(resource) {
    this.resource = resource;
    _PRIVATE.set(this, {
      resource,
      prepareURL: () => {
        if (Blob && _PRIVATE.get(this).resource instanceof Blob) {
          _PRIVATE.get(this).resource = URL.createObjectURL(resource);
        } else if (typeof this.resource !== 'string') {
          throw new Error('Resource reference was expecting whether a Blob/File Object or a string reference to a valid video URL');
        }
      },
      __settings: {
        xy: [0, 0],
        size: [320, 240],
        returnType: OBJECT_URL_TYPE,
        skips: [0],
      },
    });
  }

  xy(val = [0, 0]) {
    _PRIVATE.get(this).__settings.xy = val;
    return this;
  }

  size(val = [320, 240]) {
    _PRIVATE.get(this).__settings.size = val;
    return this;
  }

  type(val = OBJECT_URL_TYPE) {
    _PRIVATE.get(this).__settings.returnType = val;
    return this;
  }

  positions(val = [0]) {
    _PRIVATE.get(this).__settings.skips = val;
    return this;
  }

  done(successCB, errorCB) {
    const positions = [..._PRIVATE.get(this).__settings.skips];
    const video = new Video(_PRIVATE.get(this).resource);
    try {
      video
      .initialize(_PRIVATE.get(this).__settings)
      .then(() => {
        if (!positions.length) return successCB([]);
        const reverseOrder = () => {
          positions.shift();
          if (!positions.length) return successCB(video.thumbs.map(thumb => {
              return URL.createObjectURL(thumb);
            }));
            return video.generateThumb(positions[0]).then(reverseOrder);
        };
        video.generateThumb(positions[0]).then(reverseOrder);
      });
    } catch (err) {
      errorCB(err);
    }
    return this;
  }

  load() {
    _PRIVATE.get(this).prepareURL();
    return this;
  }
}

window.VideoToThumb = VideoToThumb;

export default VideoToThumb;
