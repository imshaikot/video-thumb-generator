const singleton = Symbol();
const singletonEnforcer = Symbol();

const OBJECT_URL_TYPE = 'objectURL';
const DATA_URL_TYPE = 'base64';

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
    return new Promise((resolve, reject) => {
      const w = configs.size[0];
      const h = configs.size[1];
      const x = configs.xy[0];
      const y = configs.xy[1];
      this.node.width = w;
      this.node.height = h;
      this.node.getContext('2d').drawImage(videoNode, x, y, w, h);
      if (configs.returnType === OBJECT_URL_TYPE) {
        this.node.toBlob(blob => resolve(blob));
      } else if (configs.returnType === DATA_URL_TYPE) {
        resolve(this.node.toDataURL());
      } else {
        const err = {
          type: 'Canvas_Error',
          message: `type must be between ${OBJECT_URL_TYPE} or ${DATA_URL_TYPE} but found ${configs.returnType}`,
        };
        reject(err);
      }
    });
  }
}

export default Canvas.instance;
