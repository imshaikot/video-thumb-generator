import Video from './video';

const OBJECT_URL_TYPE = 'objectURL';
const DATA_URL_TYPE = 'dataURL';

class VideoToThumb {
  constructor(resource) {
    this.resource = resource;
  }

  load(positions = [], returnType = OBJECT_URL_TYPE) {
    return new Promise((resolve, reject) => {
      if (Blob && this.resource instanceof Blob) {
        this.resource = URL.createObjectURL(this.resource);
      } else if (typeof this.resource !== 'string') {
        reject('Resource reference was expecting whether a Blob/File Object or a string reference to a valid video URL');
      }
      const video = new Video(this.resource);
      return video
        .initialize()
        .then(() => {
          return Promise.all(positions.map(each => {
            return video.generateThumb(each)}))
          .then(() => {
            video.destroy();
            resolve(video.thumbs.map(thumb => {
              return URL.createObjectURL(thumb)
            }));
          });
        })
        .catch(event => console.error(`There's an error`, event));
    });
  }
}

window.VideoToThumb = VideoToThumb;

export default VideoToThumb;
