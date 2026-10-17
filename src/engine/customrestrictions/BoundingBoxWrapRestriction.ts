import type { Node } from '../Node';
import { Restriction } from '../Restriction';

/**
 * Toroidal/wrapping bounds — if node exits box, teleports to opposite edge.
 */
export class BoundingBoxWrapRestriction extends Restriction {
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;

  public constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    this.x1 = x1 < x2 ? x1 : x2;
    this.y1 = y1 < y2 ? y1 : y2;
    this.x2 = x1 > x2 ? x1 : x2;
    this.y2 = y1 > y2 ? y1 : y2;
  }

  public restrict(n: Node): void {
    if (n.x < this.x1) {
      n.x = this.x2;
    } else if (n.x > this.x2) {
      n.x = this.x1;
    } else if (n.y < this.y1) {
      n.y = this.y2;
    } else if (n.y > this.y2) {
      n.y = this.y1;
    }
  }
}
