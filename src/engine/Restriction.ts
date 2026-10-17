import { Node } from './Node';

/**
 * Base class for all group restrictions on a node.
 */
export abstract class Restriction {
  /**
   * Perform any initialization necessary on the specified node.
   */
  public initialize(_n: Node): void { }

  /**
   * Restrict the specified node and update the node's
   * position, direction, health, etc if necessary.
   */
  public abstract restrict(n: Node): void;
}
