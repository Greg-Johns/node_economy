import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Pulls toward fixed axis Y position with strength factor.
 */
export class TowardsYMotivation extends Motivation {
  public targetY: number;
  public strength: number;

  public constructor(targetY: number, strength: number) {
    super();
    this.targetY = targetY;
    this.strength = strength;
  }

  public motivate(n: Node): void {
    this.dy += (this.targetY - n.y) * this.strength;
  }
}
