import type { Node } from './Node';
import { Restriction } from './Restriction';

/**
 * This class represents a group of nodes.
 */
export class NodeGroup {
  public constructor() {
    this.nodeVector = [];
    this.nodeRestrictions = [];
  }

  /**
   * Initialize all nodes and their motivations/visualizations.
   */
  public initialize(): void {
    for (let i = 0; i < this.nodeVector.length; i++) {
      const currentNode = this.getNode(i);
      currentNode.initialize();
    }
  }

  /**
   * Ask each node to:
   * 1: motivate itself
   * 2: apply each group restriction
   * 3: move itself according to the motivations above
   * 4: render itself
   */
  public render(): void {
    for (let i = 0; i < this.nodeVector.length; i++) {
      const currentNode = this.getNode(i);
      currentNode.motivate();
      for (let j = 0; j < this.nodeRestrictions.length; j++) {
        const currentRestriction = this.nodeRestrictions[j];
        currentRestriction.restrict(currentNode);
      }
      currentNode.move();
      currentNode.render();
    }
  }

  public addNode(newNode: Node): void {
    this.nodeVector.push(newNode);
    newNode.group = this;
  }

  /**
   * How many nodes are there in this group.
   */
  public getNodeCount(): number {
    return this.nodeVector.length;
  }

  /**
   * Get the node instance given the index.
   */
  public getNode(index: number): Node {
    return this.nodeVector[index];
  }

  /**
   * Given a particular node, what is the index for it in the group.
   */
  public getNodeIndex(n: Node): number {
    for (let i = 0; i < this.nodeVector.length; i++) {
      const currentNode = this.getNode(i);
      if (currentNode === n) {
        return i;
      }
    }
    return -1;
  }

  public getNextNode(n: Node): Node | null {
    const i = this.getNodeIndex(n);
    if (i === -1) {
      return null;
    }
    return this.getNode((i + 1) % this.nodeVector.length);
  }

  public getPreviousNode(n: Node): Node | null {
    const i = this.getNodeIndex(n);
    if (i === -1) {
      return null;
    } else if (i === 0) {
      return this.getNode(this.nodeVector.length - 1);
    }
    return this.getNode((i - 1) % this.nodeVector.length);
  }

  public addNodeRestriction(newRestriction: Restriction): void {
    this.nodeRestrictions.push(newRestriction);
  }

  /**
   * Are any nodes in the group moving, or have they all stopped.
   */
  public isGroupMoving(): boolean {
    const s = this.getNodeCount();
    for (let i = 0; i < s; i++) {
      if (this.getNode(i).getSpeed() > 0.01) {
        return true;
      }
    }
    return false;
  }

  /**
   * Remove any node from this group that is unhealthy (e.g. negative health).
   * @return true if any nodes were removed.
   */
  public removeUnhealthyNodes(): boolean {
    let removed = false;
    for (let i = this.nodeVector.length - 1; i >= 0; i--) {
      if (this.getNode(i).getHealth() < 0) {
        this.nodeVector.splice(i, 1);
        removed = true;
      }
    }
    if (removed) {
      // eslint-disable-next-line no-console
      console.log(`Node(s) Removed : New Node Count = ${this.nodeVector.length}`);
    }
    return removed;
  }

  /**
   * TODO: How do you determine what a rogue node is?
   */
  public removeRogueNodes(): boolean {
    return false;
  }

  private nodeVector: Node[];
  private nodeRestrictions: Restriction[];
}
