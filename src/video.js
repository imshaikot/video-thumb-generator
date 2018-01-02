import Canvas from './canvas';

export default class Video {
  constructor(uri) {
    this.node = document.createElement('video');
    this.node.setAttribute('src', uri);
    this.node.setAttribute('muted', true);
    this.node.setAttribute('controls', true);
    this.node.style.display = 'none';
    this.node.width = 320;
    this.thumbs = [];
  }

  initialize(configs) {
    [this.node.width, this.node.height] = configs.size;
    this.configs = configs;
    return new Promise((resolve, reject) => {
      const MediaError = (event) => {
        const err = {
          type: `media_${event.type}`,
          error: event,
        };
        reject(err);
      };

      this.node.addEventListener('error', MediaError);
      this.node.addEventListener('abort', MediaError);

      this.node.addEventListener('canplaythrough', () => {
        this.node.removeEventListener('error', MediaError);
        this.node.removeEventListener('abort', MediaError);
        resolve();
      });
    });
  }

  getSnaps(position = 1) {
    return new Promise((resolve, reject) => {
      if (position > this.node.duration) return resolve();
      const onMediaError = (event) => {
        const err = {
          type: `media_${event.type}`,
          error: event,
        };
        reject(err);
      };
      this.node.addEventListener('suspend', onMediaError);
      this.node.addEventListener('abort', onMediaError);
      const onSeeked = () => {
        this.node.removeEventListener('suspend', onMediaError);
        this.node.removeEventListener('abort', onMediaError);
        this.node.removeEventListener('seeked', onSeeked);
        Canvas.capture(this.node, this.configs).then((data) => {
          this.thumbs.push(data);
          resolve();
        }).catch(reject);
      };
      this.node.addEventListener('seeked', onSeeked);
      this.node.currentTime = Number(position);
      return null;
    });
  }

  destroy() {
    return this.node.remove();
  }
}
