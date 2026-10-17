import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Social/visibility-based force: personal radius, influence strength.
 * Creates clustering/avoidance.
 */
export class SocialPersonalMotivation extends Motivation {
  public personalRadius: number;
  public strength: number;

  public constructor(personalRadius: number, strength: number) {
    super();
    this.personalRadius = personalRadius;
    this.strength = strength;
  }

  public motivate(n: Node): void {
    let dx = 0;
    let dy = 0;
    let count = 0;
    const group = n.group!;
    for (let i = 0; i < group.getNodeCount(); i++) {
      const other = group.getNode(i);
      if (other === n) continue;
      const d = n.getDistance(other);
      if (d < this.personalRadius && d > 0) {
        dx += (n.x - other.x) / d;
        dy += (n.y - other.y) / d;
        count++;
      }
    }
    if (count > 0) {
      this.dx = (dx / count) * this.strength;
      this.dy = (dy / count) * this.strength;
    }
  }
}
