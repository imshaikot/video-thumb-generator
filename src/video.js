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

  initialize() {
    return new Promise((resolve, reject) => {
      //this.node.addEventListener('error', reject);
      //this.node.addEventListener('suspend', reject);
      this.node.addEventListener('abort', reject);

      this.node.addEventListener('canplaythrough', () => {
        //this.node.removeEventListener('error', reject);
        //this.node.removeEventListener('suspend', reject);
        this.node.removeEventListener('abort', reject);
        resolve();
      });
    });
  }

  generateThumb(position = 1, scale = 0.25) {
    return new Promise((resolve, reject) => {
      this.node.addEventListener('suspend', reject);
      this.node.addEventListener('abort', reject);
      const onSeeked = () => {
        this.node.removeEventListener('suspend', reject);
        this.node.removeEventListener('abort', reject);
        this.node.removeEventListener('seeked', onSeeked);
        Canvas.capture(this.node, scale).then(data => {
          this.thumbs.push(data);
          resolve();
        });
      };
      this.node.addEventListener('seeked', onSeeked);
      this.node.currentTime = Number(position);
    });
  }

  destroy() {
    return this.node.remove();
  }
}
