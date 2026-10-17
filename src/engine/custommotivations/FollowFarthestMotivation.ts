import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Steers toward the farthest node in the group.
 */
export class FollowFarthestMotivation extends Motivation {
  public motivate(n: Node): void {
    let farthest: Node | null = null;
    let maxD = 0;
    const group = n.group!;
    for (let i = 0; i < group.getNodeCount(); i++) {
      const other = group.getNode(i);
      if (other === n) continue;
      const d = n.getDistance(other);
      if (d > maxD) {
        maxD = d;
        farthest = other;
      }
    }
    if (farthest && maxD > 0) {
      this.dx = (farthest.x - n.x) / maxD;
      this.dy = (farthest.y - n.y) / maxD;
    }
  }
}
