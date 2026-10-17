import type { Node } from '../Node';
import { Motivation } from '../Motivation';

/**
 * Oscillatory force in Y (amplitude, phase, damping factor).
 */
export class SineYMotivation extends Motivation {
  public amplitude: number;
  public phase: number;
  public damping: number;

  public constructor(amplitude: number, phase: number, damping: number) {
    super();
    this.amplitude = amplitude;
    this.phase = phase;
    this.damping = damping;
  }

  public motivate(_n: Node): void {
    this.dy = Math.sin(this.phase) * this.amplitude;
    this.dy *= this.damping;
    this.phase += 0.1;
  }
}
