import type { NodeGroup } from './NodeGroup';
import { ColorPallet } from './ColorPallet';

/**
 * Wraps a NodeGroup and a ColorPallet, providing the sketch-level orchestration
 * previously handled by the Processing AutonomousNodeEconomy (which registered
 * lifecycle hooks on a PApplet). In p5.js the sketch calls nodeGroup.render()
 * and removeUnhealthyNodes() directly from draw().
 */
export class AutonomousNodeEconomy {
  public nodeGroup: NodeGroup;
  public colorPallet: ColorPallet;

  public constructor(nodeGroup: NodeGroup, colorPallet: ColorPallet) {
    this.nodeGroup = nodeGroup;
    this.colorPallet = colorPallet;
  }
}
