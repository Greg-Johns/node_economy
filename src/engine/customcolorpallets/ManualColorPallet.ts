import { ColorPallet } from '../ColorPallet';

/**
 * Build your own pallet.
 * Note, you MUST add the background color first, then the rest of the colors in order.
 */
export class ManualColorPallet extends ColorPallet {
  public constructor() {
    super();
    this.palletVector = [];
  }

  public addColor(r: number, g: number, b: number): void {
    this.palletVector.push(this.color(r, g, b));
  }

  public getColor(
    index: number,
    newAlpha: number
  ): [number, number, number, number];
  public getColor(
    index1: number,
    index2: number,
    offset: number,
    newAlpha: number
  ): [number, number, number, number];
  public getColor(
    nIndex: number,
    newAlpha: number
  ): [number, number, number, number];
  public getColor(
    nx: number,
    ny: number,
    newAlpha: number
  ): [number, number, number, number];
  public getColor(
    a: number,
    b?: number,
    c?: number,
    d?: number
  ): [number, number, number, number] {
    // 4-arg: getColor(index1, index2, offset, newAlpha)
    if (b !== undefined && c !== undefined && d !== undefined) {
      const index1 = a;
      const index2 = b;
      const offset = c;
      const newAlpha = d;
      const c1 = this.getColor(index1, newAlpha);
      const c2 = this.getColor(index2, newAlpha);
      let o = offset;
      if (o < 0) {
        o = 0;
      } else if (o > 1) {
        o = 1;
      }
      return [
        c1[0] + o * (c2[0] - c1[0]),
        c1[1] + o * (c2[1] - c1[1]),
        c1[2] + o * (c2[2] - c1[2]),
        newAlpha,
      ];
    }
    // 3-arg: getColor(nx, ny, newAlpha)
    if (b !== undefined && c !== undefined && d === undefined) {
      const nx = a;
      const ny = b;
      const newAlpha = c;
      if (nx < 0 || nx > this.palletVector.length || ny < 0 || ny > 1) {
        return this.getColor(0, newAlpha); // return background
      }
      const c1 = this.getColor(0, newAlpha);
      const c2 = this.getColor(nx, newAlpha);
      return [
        c1[0] + ny * (c2[0] - c1[0]),
        c1[1] + ny * (c2[1] - c1[1]),
        c1[2] + ny * (c2[2] - c1[2]),
        newAlpha,
      ];
    }
    // 2-arg: getColor(index, newAlpha)  (index-based lookup; index 0 = background)
    const index = a;
    const newAlpha = b ?? 255;
    if (index < 0 || index >= this.palletVector.length) {
      return this.getColor(0, newAlpha);
    }
    const col = this.palletVector[index];
    return this.colorWithAlpha(col[0], col[1], col[2], newAlpha);
  }

  public getColorCount(): number {
    return this.palletVector.length;
  }

  private palletVector: [number, number, number][] = [];

  private color(x: number, y: number, z: number): [number, number, number] {
    let rx = x;
    let ry = y;
    let rz = z;
    if (rx > 255) rx = 255; else if (rx < 0) rx = 0;
    if (ry > 255) ry = 255; else if (ry < 0) ry = 0;
    if (rz > 255) rz = 255; else if (rz < 0) rz = 0;
    return [rx, ry, rz];
  }

  private colorWithAlpha(r: number, g: number, b: number, a: number): [number, number, number, number] {
    let ra = r;
    let gb = g;
    let bc = b;
    let aa = a;
    if (aa > 255) aa = 255; else if (aa < 0) aa = 0;
    if (ra > 255) ra = 255; else if (ra < 0) ra = 0;
    if (gb > 255) gb = 255; else if (gb < 0) gb = 0;
    if (bc > 255) bc = 255; else if (bc < 0) bc = 0;
    return [ra, gb, bc, aa];
  }
}
