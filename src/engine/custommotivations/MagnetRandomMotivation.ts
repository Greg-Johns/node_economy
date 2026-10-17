import type { Node } from '../Node';
import { MagnetMotivation } from './MagnetMotivation';

/**
 * Magnet assigned to a random other node (dynamic/chaotic linking).
 */
export class MagnetRandomMotivation extends MagnetMotivation {
  public constructor(
    scaleX = 50,
    scaleY = 50,
    dampeningX = 0.964,
    dampeningY = 0.964
  ) {
    super(scaleX, scaleY, dampeningX, dampeningY);
  }

  public initialize(n: Node): void {
    if (this.magnet == null) {
      const group = n.group!;
      const count = group.getNodeCount();
      let idx = Math.floor(Math.random() * count);
      while (idx === group.getNodeIndex(n) && count > 1) {
        idx = Math.floor(Math.random() * count);
      }
      this.magnet = group.getNode(idx);
    }
  }
}
