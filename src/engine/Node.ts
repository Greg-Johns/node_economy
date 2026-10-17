import type { NodeGroup } from './NodeGroup';
import { Motivation } from './Motivation';
import { Visualization } from './Visualization';

/**
 * This class represents a single node.
 */
export class Node {
  public static readonly INIT_HEALTH = 100;

  public group: NodeGroup | null = null;

  public x = 0;
  public y = 0;
  public dx = 0;
  public dy = 0;

  private health = Node.INIT_HEALTH;
  private motivations: Motivation[] = [];
  private visualizations: Visualization[] = [];

  constructor(newX: number, newY: number, newHealth = Node.INIT_HEALTH) {
    this.x = newX;
    this.y = newY;
    this.dx = 0;
    this.dy = 0;
    this.health = newHealth;
  }

  /**
   * Health functions.
   * A positive health is good, a negative health is bad (and waiting to die).
   */
  public killHealth(): void {
    this.health = -1;
  }

  public changeHealth(dHealth: number): number {
    this.health += dHealth;
    return this.health;
  }

  public getHealth(): number {
    return this.health;
  }

  /**
   * The current speed of the node (e.g. magnitude of the direction vector).
   */
  public getSpeed(): number {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }

  /**
   * The current direction the node is desiring to travel.
   */
  public getDirection(): number {
    return Math.atan2(this.dy, this.dx);
  }

  /**
   * The linear distance between this node and the one passed.
   */
  public getDistance(node: Node): number {
    return Math.sqrt((this.x - node.x) ** 2 + (this.y - node.y) ** 2);
  }

  /**
   * Initialize this node and set everything up that it may need.
   */
  public initialize(): void {
    for (const motivation of this.motivations) {
      motivation.initialize(this);
    }
    for (const visualization of this.visualizations) {
      visualization.initialize(this);
    }
  }

  /**
   * Motivate and update this node's dx, dy.
   */
  public motivate(): void {
    this.dx = 0;
    this.dy = 0;
    for (const motivation of this.motivations) {
      motivation.motivate(this);
      this.dx += motivation.dx;
      this.dy += motivation.dy;
    }
  }

  /**
   * Move the node according to the dx, dy.
   */
  public move(): void {
    this.x += this.dx;
    this.y += this.dy;
  }

  /**
   * Render this node via its visualizations.
   */
  public render(): void {
    for (const visualization of this.visualizations) {
      visualization.render(this);
    }
  }

  public addMotivation(newMotivation: Motivation): void {
    this.motivations.push(newMotivation);
  }

  public addVisualization(newVisualization: Visualization): void {
    this.visualizations.push(newVisualization);
  }
}
