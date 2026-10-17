import type { Node } from '../Node';
import { MagnetMotivation } from './MagnetMotivation';

/**
 * Forms chains (links to next/previous in group) creating linked structures.
 */
export class MagnetChainMotivation extends MagnetMotivation {
  public constructor(
    scaleX = 5,
    scaleY = 5,
    dampeningX = 0.964,
    dampeningY = 0.964
  ) {
    super(scaleX, scaleY, dampeningX, dampeningY);
  }

  public initialize(n: Node): void {
    if (this.magnet == null) {
      const myIndex = n.group!.getNodeIndex(n);
      this.magnet = n.group!.getNode((myIndex + 1) % n.group!.getNodeCount());
    }
  }
}
