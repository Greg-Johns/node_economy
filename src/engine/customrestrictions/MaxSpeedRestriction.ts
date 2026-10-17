import type { Node } from '../Node';
import { Restriction } from '../Restriction';

/**
 * Clamps speed to maxSpeed. If over max, resets dx,dy to maxSpeed * unit vector
 * in current direction. Prevents runaway acceleration.
 */
export class MaxSpeedRestriction extends Restriction {
  public maxSpeed: number;

  public constructor(maxSpeed: number) {
    super();
    this.maxSpeed = maxSpeed;
  }

  public restrict(n: Node): void {
    const speed = n.getSpeed();
    if (speed > this.maxSpeed) {
      const dir = n.getDirection();
      n.dx = this.maxSpeed * Math.cos(dir);
      n.dy = this.maxSpeed * Math.sin(dir);
    }
  }
}
