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

  capture(videoNode, configs) {
    return new Promise(resolve => {
      const w = configs.size[0];
      const h = configs.size[1];
      const x = configs.xy[0];
      const y = configs.xy[1];
      this.node.width = w;
      this.node.height = h;
      this.node.getContext('2d').drawImage(videoNode, x, y, w, h);
      if (configs.returnType === 'objectURL') this.node.toBlob(blob => resolve(blob));
      if (configs.returnType === 'dataURL') resolve(this.node.toDataURL());
    });
  }
}

export default Canvas.instance;
