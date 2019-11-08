import UIDGenerator from 'uid-generator';
import p5 from 'p5';
//@ts-ignore
const uidgen = new UIDGenerator();

export default class Plant {
  public position: p5.Vector;
  public uid: string;

  constructor(x: number, y: number) {
    this.position = window.p5.createVector(x, y);
    this.uid = uidgen.generateSync();
  }

  display() {
    const { x, y } = this.position;
    window.p5.image(window.imgs[2], x - window.offsetX, y - window.offsetY);
  }
}
