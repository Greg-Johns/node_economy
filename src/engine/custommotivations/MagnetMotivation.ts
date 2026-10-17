import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Attracts node toward a magnet node with spring-like terms:
 * dx += (magnet.x - n.x)/scaleX; dx *= dampeningX;
 * dy += (magnet.y - n.y)/scaleY; dy *= dampeningY.
 */
export class MagnetMotivation extends Motivation {
  public magnet: Node | null = null;
  public scaleX: number;
  public scaleY: number;
  public dampeningX: number;
  public dampeningY: number;

  public constructor(
    scaleX = 600,
    scaleY = 700,
    dampeningX = 0.964,
    dampeningY = 0.964
  ) {
    super();
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.dampeningX = dampeningX;
    this.dampeningY = dampeningY;
  }

  public motivate(n: Node): void {
    if (this.magnet == null) {
      return;
    }
    this.dx += (this.magnet.x - n.x) / this.scaleX;
    this.dx *= this.dampeningX;
    this.dy += (this.magnet.y - n.y) / this.scaleY;
    this.dy *= this.dampeningY;
  }
}
