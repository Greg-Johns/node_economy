import p5 from 'p5';
import type { Node } from '../Node';
import { ColorPallet } from '../ColorPallet';
import { Visualization } from '../Visualization';

/**
 * Draws a small filled circle (node body) plus a direction vector line from node.
 * Shows velocity intent clearly.
 */
export class NodeMotivationVisualization extends Visualization {
  public p: p5;
  public colorPallet: ColorPallet;
  public bodyRadius: number;
  public dirScale: number;
  public bodyColorIndex: number;
  public bodyColorAlpha: number;
  public lineColorIndex: number;
  public lineColorAlpha: number;

  public constructor(
    p: p5,
    colorPallet: ColorPallet,
    bodyRadius: number,
    dirScale: number,
    bodyColorIndex: number,
    bodyColorAlpha: number,
    lineColorIndex: number,
    lineColorAlpha: number
  ) {
    super();
    this.p = p;
    this.colorPallet = colorPallet;
    this.bodyRadius = bodyRadius;
    this.dirScale = dirScale;
    this.bodyColorIndex = bodyColorIndex;
    this.bodyColorAlpha = bodyColorAlpha;
    this.lineColorIndex = lineColorIndex;
    this.lineColorAlpha = lineColorAlpha;
  }

  public render(n: Node): void {
    const dir = n.getDirection();
    const speed = n.getSpeed();
    const endX = n.x + this.dirScale * speed * Math.cos(dir);
    const endY = n.y + this.dirScale * speed * Math.sin(dir);

    this.p.noStroke();
    this.p.fill(this.colorPallet.getColor(this.bodyColorIndex, this.bodyColorAlpha));
    this.p.circle(n.x, n.y, this.bodyRadius * 2);

    this.p.stroke(this.colorPallet.getColor(this.lineColorIndex, this.lineColorAlpha));
    this.p.strokeWeight(1);
    this.p.line(n.x, n.y, endX, endY);
  }
}
