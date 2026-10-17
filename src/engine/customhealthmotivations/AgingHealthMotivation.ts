import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Health-related motivation: subtracts dHealth each frame via changeHealth,
 * causing nodes to eventually become unhealthy and be removed.
 */
export class AgingHealthMotivation extends Motivation {
  public dHealth: number;

  public constructor(dHealth: number) {
    super();
    this.dHealth = dHealth;
  }

  public motivate(n: Node): void {
    n.changeHealth(this.dHealth);
  }
}
