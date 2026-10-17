import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Pulls toward fixed axis X position with strength factor.
 */
export class TowardsXMotivation extends Motivation {
  public targetX: number;
  public strength: number;

  public constructor(targetX: number, strength: number) {
    super();
    this.targetX = targetX;
    this.strength = strength;
  }

  public motivate(n: Node): void {
    this.dx += (this.targetX - n.x) * this.strength;
  }
}
