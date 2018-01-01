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

  }
}

export default Canvas.instance;
