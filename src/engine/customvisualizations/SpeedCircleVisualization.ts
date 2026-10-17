import p5 from 'p5';
import type { Node } from '../Node';
import { ColorPallet } from '../ColorPallet';
import { Visualization } from '../Visualization';

/**
 * Draws an ellipse/circle centered at node position with radius = scalingFactor * speed.
 * Supports stroke only or stroke+fill with separate palette indices/alphas.
 */
export class SpeedCircleVisualization extends Visualization {
  public p: p5;
  public colorPallet: ColorPallet;
  public scalingFactor: number;
  public strokeColorIndex: number;
  public strokeColorAlpha: number;
  public fillColorIndex: number;
  public fillColorAlpha: number;

  public constructor(
    p: p5,
    colorPallet: ColorPallet,
    scalingFactor: number,
    strokeColorIndex: number,
    strokeColorAlpha: number,
    fillColorIndex = 0,
    fillColorAlpha = 0
  ) {
    super();
    this.p = p;
    this.colorPallet = colorPallet;
    this.scalingFactor = scalingFactor;
    this.strokeColorIndex = strokeColorIndex;
    this.strokeColorAlpha = strokeColorAlpha;
    this.fillColorIndex = fillColorIndex;
    this.fillColorAlpha = fillColorAlpha;
  }

  public render(n: Node): void {
    this.p.stroke(this.colorPallet.getColor(this.strokeColorIndex, this.strokeColorAlpha));
    if (this.fillColorAlpha <= 0) {
      this.p.noFill();
    } else {
      this.p.fill(this.colorPallet.getColor(this.fillColorIndex, this.fillColorAlpha));
    }
    const radius = this.scalingFactor * n.getSpeed();
    this.p.ellipse(n.x, n.y, radius, radius);
  }
}
