import p5 from 'p5';
import type { Node } from '../Node';
import { ColorPallet } from '../ColorPallet';
import { Visualization } from '../Visualization';

/**
 * Draws a single pixel at node position with fixed palette index and alpha.
 */
export class PixelVisualization extends Visualization {
  public p: p5;
  public colorPallet: ColorPallet;
  public index: number;
  public alpha: number;

  public constructor(p: p5, colorPallet: ColorPallet, index: number, alpha: number) {
    super();
    this.p = p;
    this.colorPallet = colorPallet;
    this.index = index;
    this.alpha = alpha;
  }

  public render(n: Node): void {
    this.p.stroke(this.colorPallet.getColor(this.index, this.alpha));
    this.p.strokeWeight(1);
    this.p.point(n.x, n.y);
  }
}
