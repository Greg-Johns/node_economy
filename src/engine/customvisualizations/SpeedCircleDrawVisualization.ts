import p5 from 'p5';
import type { Node } from '../Node';
import { ColorPallet } from '../ColorPallet';
import { Visualization } from '../Visualization';

/**
 * Continuously draws a circle around the node's location given magnitude of the
 * direction vector and the scaling factor. Produces continuous curved trails.
 * Requires per-visualization state (lastx/lasty, angle, ready).
 */
export class SpeedCircleDrawVisualization extends Visualization {
  public p: p5;
  public colorPallet: ColorPallet;
  public scalingFactor: number;
  public angle: number;
  public dAngle: number;
  public strokeColorIndex: number;
  public strokeColorAlpha: number;
  public strokeColorWidth: number;
  public fillColorIndex: number;
  public fillColorAlpha: number;
  public fillColorWidth: number;
  private ready = false;
  private lastx = 0;
  private lasty = 0;

  public constructor(
    p: p5,
    colorPallet: ColorPallet,
    scalingFactor: number,
    angle: number,
    dAngle: number,
    strokeColorIndex: number,
    strokeColorAlpha: number,
    strokeColorWidth: number,
    fillColorIndex: number,
    fillColorAlpha: number,
    fillColorWidth: number
  ) {
    super();
    this.p = p;
    this.colorPallet = colorPallet;
    this.scalingFactor = scalingFactor;
    this.angle = angle;
    this.dAngle = dAngle;
    this.strokeColorIndex = strokeColorIndex;
    this.strokeColorAlpha = strokeColorAlpha;
    this.strokeColorWidth = strokeColorWidth;
    this.fillColorIndex = fillColorIndex;
    this.fillColorAlpha = fillColorAlpha;
    this.fillColorWidth = fillColorWidth;
  }

  public initialize(_n: Node): void {
    this.ready = false;
  }

  public render(n: Node): void {
    const radius = this.scalingFactor * n.getSpeed();
    this.angle = (this.angle + this.dAngle) % (2 * Math.PI);
    const tempx = this.lastx;
    const tempy = this.lasty;
    this.lastx = n.x + radius * Math.cos(this.angle);
    this.lasty = n.y + radius * Math.sin(this.angle);
    if (this.ready) {
      this.p.noFill();
      this.p.stroke(this.colorPallet.getColor(this.fillColorIndex, this.fillColorAlpha));
      this.p.strokeWeight(this.fillColorWidth);
      this.p.line(tempx, tempy, this.lastx, this.lasty);
      this.p.stroke(this.colorPallet.getColor(this.strokeColorIndex, this.strokeColorAlpha));
      this.p.strokeWeight(this.strokeColorWidth);
      this.p.line(tempx, tempy, this.lastx, this.lasty);
    } else {
      this.ready = true;
    }
  }
}
