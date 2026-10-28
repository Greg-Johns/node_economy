import type { Node } from '../Node';
import { Motivation } from '../Motivation';

type Velocity = {
  vx: number;
  vy: number;
};

/**
 * Boids-style flocking motivation using separation, alignment, and cohesion.
 *
 * This implementation keeps per-node velocity in a static cache so flocking
 * can work with the existing node motivate loop (which resets node dx/dy each frame).
 */
export class BoidsMotivation extends Motivation {
  private static readVelocityCache: WeakMap<Node, Velocity> = new WeakMap();
  private static writeVelocityCache: WeakMap<Node, Velocity> = new WeakMap();

  public perceptionRadius: number;
  public separationRadius: number;
  public maxSpeed: number;
  public maxForce: number;
  public maxNeighbors: number;

  public separationWeight: number;
  public alignmentWeight: number;
  public cohesionWeight: number;

  public constructor(
    perceptionRadius = 42,
    separationRadius = 20,
    maxSpeed = 2.2,
    maxForce = 0.045,
    maxNeighbors = 18,
    separationWeight = 1.7,
    alignmentWeight = 1,
    cohesionWeight = 0.75
  ) {
    super();
    this.perceptionRadius = perceptionRadius;
    this.separationRadius = separationRadius;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.maxNeighbors = maxNeighbors;
    this.separationWeight = separationWeight;
    this.alignmentWeight = alignmentWeight;
    this.cohesionWeight = cohesionWeight;
  }

  public motivate(n: Node): void {
    this.dx = 0;
    this.dy = 0;

    const group = n.group;
    if (!group) {
      return;
    }

    // Start of a new frame: move the freshly-written cache into read-only cache.
    if (group.getNodeIndex(n) === 0) {
      BoidsMotivation.readVelocityCache = BoidsMotivation.writeVelocityCache;
      BoidsMotivation.writeVelocityCache = new WeakMap();
    }

    const currentVelocity = BoidsMotivation.readVelocityCache.get(n) ?? { vx: 0, vy: 0 };

    let separationX = 0;
    let separationY = 0;
    let separationCount = 0;

    let alignmentX = 0;
    let alignmentY = 0;
    let alignmentCount = 0;

    let cohesionX = 0;
    let cohesionY = 0;
    let cohesionCount = 0;

    const nodeCount = group.getNodeCount();
    for (let i = 0; i < nodeCount; i++) {
      if (alignmentCount >= this.maxNeighbors && cohesionCount >= this.maxNeighbors) {
        break;
      }

      const other = group.getNode(i);
      if (other === n) {
        continue;
      }

      const offsetX = other.x - n.x;
      const offsetY = other.y - n.y;
      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

      if (distance <= 0) {
        continue;
      }

      if (distance < this.separationRadius && separationCount < this.maxNeighbors) {
        // Stronger push when closer.
        separationX += (n.x - other.x) / distance;
        separationY += (n.y - other.y) / distance;
        separationCount++;
      }

      if (distance < this.perceptionRadius) {
        if (alignmentCount < this.maxNeighbors) {
          const otherVelocity = BoidsMotivation.readVelocityCache.get(other) ?? { vx: 0, vy: 0 };
          alignmentX += otherVelocity.vx;
          alignmentY += otherVelocity.vy;
          alignmentCount++;
        }

        if (cohesionCount < this.maxNeighbors) {
          cohesionX += other.x;
          cohesionY += other.y;
          cohesionCount++;
        }
      }
    }

    const separationSteer = this.calculateSteer(
      separationCount > 0 ? separationX / separationCount : 0,
      separationCount > 0 ? separationY / separationCount : 0,
      currentVelocity
    );

    const alignmentSteer = this.calculateSteer(
      alignmentCount > 0 ? alignmentX / alignmentCount : 0,
      alignmentCount > 0 ? alignmentY / alignmentCount : 0,
      currentVelocity
    );

    const cohesionSteer = this.calculateSteerToTarget(
      cohesionCount > 0 ? cohesionX / cohesionCount : n.x,
      cohesionCount > 0 ? cohesionY / cohesionCount : n.y,
      n,
      currentVelocity
    );

    let steerX = 0;
    let steerY = 0;
    steerX += separationSteer.vx * this.separationWeight;
    steerY += separationSteer.vy * this.separationWeight;
    steerX += alignmentSteer.vx * this.alignmentWeight;
    steerY += alignmentSteer.vy * this.alignmentWeight;
    steerX += cohesionSteer.vx * this.cohesionWeight;
    steerY += cohesionSteer.vy * this.cohesionWeight;

    const limitedSteer = this.limitVector(steerX, steerY, this.maxForce);
    const nextVelocity = this.limitVector(
      currentVelocity.vx + limitedSteer.vx,
      currentVelocity.vy + limitedSteer.vy,
      this.maxSpeed
    );

    this.dx = nextVelocity.vx;
    this.dy = nextVelocity.vy;
    BoidsMotivation.writeVelocityCache.set(n, nextVelocity);
  }

  private calculateSteer(targetX: number, targetY: number, currentVelocity: Velocity): Velocity {
    const desired = this.limitVector(targetX, targetY, this.maxSpeed);
    const steerX = desired.vx - currentVelocity.vx;
    const steerY = desired.vy - currentVelocity.vy;
    return this.limitVector(steerX, steerY, this.maxForce);
  }

  private calculateSteerToTarget(targetX: number, targetY: number, n: Node, currentVelocity: Velocity): Velocity {
    const desiredX = targetX - n.x;
    const desiredY = targetY - n.y;
    const desired = this.limitVector(desiredX, desiredY, this.maxSpeed);
    const steerX = desired.vx - currentVelocity.vx;
    const steerY = desired.vy - currentVelocity.vy;
    return this.limitVector(steerX, steerY, this.maxForce);
  }

  private limitVector(vx: number, vy: number, maxMagnitude: number): Velocity {
    const magnitude = Math.sqrt(vx * vx + vy * vy);
    if (magnitude <= maxMagnitude || magnitude === 0) {
      return { vx, vy };
    }

    const scale = maxMagnitude / magnitude;
    return {
      vx: vx * scale,
      vy: vy * scale,
    };
  }
}
