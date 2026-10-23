import p5 from 'p5';
import type { Node } from '../Node';
import { ColorPallet } from '../ColorPallet';
import { Visualization } from '../Visualization';

/**
 * For each other node within neighborRadius, draws a line between them.
 * Visual encodes distance: alpha decreases linearly with distance, palette index
 * shifts toward higher index (less dominant) with distance.
 * Optional toggleEnabled alternates stroke between background (index 0) and the
 * distance-based palette color each neighbor pair (strobing effect).
 */
export class NeighborVisualization extends Visualization {
  public p: p5;
  public colorPallet: ColorPallet;
  public neighborRadius: number;
  public maxAlpha: number;
  public toggleEnabled: boolean;

  public constructor(
    p: p5,
    colorPallet: ColorPallet,
    neighborRadius: number,
    maxAlpha: number,
    toggleEnabled: boolean
  ) {
    super();
    this.p = p;
    this.colorPallet = colorPallet;
    this.neighborRadius = neighborRadius;
    this.maxAlpha = maxAlpha;
    this.toggleEnabled = toggleEnabled;
  }

  public render(n: Node): void {
    const colorCount = this.colorPallet.getColorCount();
    for (let i = 0; i < n.group!.getNodeCount(); i++) {
      const cn = n.group!.getNode(i);
      if (cn !== n && n.getDistance(cn) < this.neighborRadius) {
        const dist = n.getDistance(cn);
        const palletIndex = Math.floor(colorCount * dist / this.neighborRadius);
        const colorAlpha = this.maxAlpha - this.maxAlpha * dist / this.neighborRadius;
        if (this.toggleEnabled) {
          this.p.stroke(this.colorPallet.getColor(0, colorAlpha));
        } else {
          this.p.stroke(this.colorPallet.getColor(palletIndex, colorAlpha));
        }
        this.p.strokeWeight(1);
        this.p.line(n.x, n.y, cn.x, cn.y);
      }
    }
  }
}
