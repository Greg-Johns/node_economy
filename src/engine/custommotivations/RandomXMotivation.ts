import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Adds a small random impulse in X per frame.
 */
export class RandomXMotivation extends Motivation {
  public amount: number;

  public constructor(amount: number) {
    super();
    this.amount = amount;
  }

  public motivate(_n: Node): void {
    this.dx = (Math.random() * 2 - 1) * this.amount;
  }
}
