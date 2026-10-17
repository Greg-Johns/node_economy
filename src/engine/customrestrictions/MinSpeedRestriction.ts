import type { Node } from '../Node';
import { Restriction } from '../Restriction';

/**
 * Enforces a minimum speed floor.
 */
export class MinSpeedRestriction extends Restriction {
  public minSpeed: number;

  public constructor(minSpeed: number) {
    super();
    this.minSpeed = minSpeed;
  }

  public restrict(n: Node): void {
    const speed = n.getSpeed();
    if (speed < this.minSpeed && speed > 0) {
      const dir = n.getDirection();
      n.dx = this.minSpeed * Math.cos(dir);
      n.dy = this.minSpeed * Math.sin(dir);
    }
  }
}
