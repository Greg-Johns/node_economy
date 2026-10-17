import { Node } from './Node';

/**
 * Base class for all visualizations for a node.
 */
export abstract class Visualization {
  /**
   * Perform any initialization necessary on the specified node.
   */
  public initialize(_n: Node): void { }

  /**
   * Draw the specified node on the current canvas.
   */
  public abstract render(n: Node): void;
}
