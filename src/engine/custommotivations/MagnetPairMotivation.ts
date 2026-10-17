import type { Node } from '../Node';
import { MagnetMotivation } from './MagnetMotivation';

/**
 * Sets magnet to the paired node (even index paired with index+1, odd with index-1)
 * in initialize(). Common in Scratchpad (1000 nodes even) to form coupled pairs.
 */
export class MagnetPairMotivation extends MagnetMotivation {
  public constructor(
    scaleX = 100,
    scaleY = 100,
    dampeningX = 0.64,
    dampeningY = 0.64
  ) {
    super(scaleX, scaleY, dampeningX, dampeningY);
  }

  public initialize(n: Node): void {
    if (this.magnet == null) {
      const myIndex = n.group!.getNodeIndex(n);
      if (myIndex % 2 === 0) {
        this.magnet = n.group!.getNode(myIndex + 1);
      } else {
        this.magnet = n.group!.getNode(myIndex - 1);
      }
    }
  }
}
