const OBJECT_URL_TYPE = 'objectURL';
const DATA_URL_TYPE = 'dataURL';

export default class VideoToThumb {
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
    });
  }
}
