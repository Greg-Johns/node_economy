/**
 * Base class for all color pallets.
 * A color index of 0 always returns the background color.
 * A lower color index indicates a more dominant color.
 * The value returned by getColorCount only considers distinct colors
 * and does not include the background color in the count.
 */
export abstract class ColorPallet {
  /**
   * Get the specified color and give it the specified alpha value.
   * @param index the range is [ 0, getColorCount() ]
   * @param newAlphaValue the desired alpha value for this color
   * @return the desired color, or the background color if index out of range
   */
  public abstract getColor(index: number, newAlphaValue: number): [number, number, number, number];

  /**
   * Get the specified color interpolating between two indices and give it the specified alpha value.
   * @param index1 the range is [ 0, getColorCount() ]
   * @param index2 the range is [ 0, getColorCount() ]
   * @param offset the range is [ 0, 1 ]
   * @param newAlphaValue the desired alpha value for this color
   * @return the desired color, or the background color if index out of range
   */
  public abstract getColor(index1: number, index2: number, offset: number, newAlphaValue: number): [number, number, number, number];

  /**
   * Get the specified color using the normalized index and give it the specified alpha value.
   * @param nIndex normalized index
   * @param newAlphaValue the desired alpha value for this color
   * @return the desired color, or the background color if index out of range
   */
  public abstract getColor(nIndex: number, newAlphaValue: number): [number, number, number, number];

  /**
   * Get the specified color by using a function of normalized x, y and give it the specified alpha value.
   * @param nx normalized x value
   * @param ny normalized y value
   * @param newAlphaValue the desired alpha value for this color
   * @return the desired color, or the background color if index out of range
   */
  public abstract getColor(nx: number, ny: number, newAlphaValue: number): [number, number, number, number];

  /**
   * Get the number of colors in this pallet. The value returned only considers
   * distinct colors, it does not include the background color in the count.
   * @return the number of colors in this pallet, value may be INFINITE constant.
   */
  public abstract getColorCount(): number;

  public static readonly INFINITE = -1;
}
