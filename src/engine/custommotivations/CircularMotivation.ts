import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Produces tangential/circular motion (radius and initial angle params).
 */
export class CircularMotivation extends Motivation {
  public radius: number;
  public angle: number;

  public constructor(radius: number, angle: number) {
    super();
    this.radius = radius;
    this.angle = angle;
  }

  public motivate(_n: Node): void {
    this.dx = -Math.sin(this.angle) * this.radius;
    this.dy = Math.cos(this.angle) * this.radius;
    this.angle += 0.1;
  }
}
