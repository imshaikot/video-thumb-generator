import Video from './video';

const OBJECT_URL_TYPE = 'objectURL';
const DATA_URL_TYPE = 'dataURL';

class VideoToThumb {
  constructor(resource) {
    this.resource = resource;
  }


  prepareURL() {
    if (Blob && this.resource instanceof Blob) {
      this.resource = URL.createObjectURL(this.resource);
    } else if (typeof this.resource !== 'string') {
      throw new Error('Resource reference was expecting whether a Blob/File Object or a string reference to a valid video URL');
    }
  }

  load() {
    this.prepareURL();
    const video = new Video(this.resource);
    const thumbs = [];
    const context = {
      __settings: {
        xy: [0, 0],
        size: [320, 240],
        returnType: OBJECT_URL_TYPE,
        skips: [0],
      },
      xy: (val = [0, 0]) => {
        context.__settings.xy = val;
        return context;
      },
      size: (val = [320, 240]) => {
        context.__settings.size = val;
        return this;
      },
      returnType: (val = OBJECT_URL_TYPE) => {
        context.__settings.returnType = val;
        return context;
      },
      positions: (val = [0]) => {
        context.__settings.skips = val;
        return context;
      },
      done: (successCB, errorCB) => {
        const positions = [...context.__settings.skips];
        try {
          video
          .initialize(context.__settings)
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
        return context;
      }
    };
    return context;
  }
}

window.VideoToThumb = VideoToThumb;

export default VideoToThumb;
