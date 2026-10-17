import { Node } from './Node';

/**
 * Base class for all motivations for a node.
 */
export abstract class Motivation {
  /**
   * Direction vector for the influence of motivation.
   */
  public dx = 0;
  public dy = 0;

  /**
   * Perform any initialization necessary on the specified node.
   */
  public initialize(_n: Node): void { }

  /**
   * Motivate the specified node and update the direction vector for this motivation.
   */
  public abstract motivate(n: Node): void;
}
