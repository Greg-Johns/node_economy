import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Social/visibility-based force: visible radius, strength.
 */
export class SocialVisibleMotivation extends Motivation {
  public visibleRadius: number;
  public strength: number;

  public constructor(visibleRadius: number, strength: number) {
    super();
    this.visibleRadius = visibleRadius;
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
      if (d < this.visibleRadius && d > 0) {
        dx += (other.x - n.x) / d;
        dy += (other.y - n.y) / d;
        count++;
      }
    }
    if (count > 0) {
      this.dx = (dx / count) * this.strength;
      this.dy = (dy / count) * this.strength;
    }
  }
}
