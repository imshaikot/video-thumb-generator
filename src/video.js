import Canvas from './canvas';

export default class Video {
  constructor(uri) {
    this.node = document.createElement('video');
    this.node.setAttribute('src', uri);
    this.node.setAttribute('muted', true);
    this.node.style.display = 'none';
    this.node.addEventListener('error', this.error.bind(this));
    this.node.addEventListener('suspend', this.error.bind(this));
    this.node.addEventListener('abort', this.error.bind(this));
  }

  error(event) {
    throw new Error(`There's an error (${event.type}) occurred`);
  }
}
