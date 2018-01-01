const singleton = Symbol();
const singletonEnforcer = Symbol();

class Canvas {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) throw new Error('Cannot construct singleton');
    this.node = document.createElement('canvas');
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new Canvas(singletonEnforcer);
    }
    return this[singleton];
  }

  capture(videoNode, scale = 0.25) {
    return new Promise(resolve => {
      const w = videoNode.videoWidth * scale;
      const h = videoNode.videoHeight * scale;
      this.node.width = w;
      this.node.height = h;
      this.node.getContext('2d').drawImage(videoNode, 0, 0, w, h);
      this.node.toBlob(blob => resolve(blob));
    });
  }
}

export default Canvas.instance;
