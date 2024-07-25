import { vec3 } from "gl-matrix";

export enum Luminosity {
  Solid = 0,
  Sine = 1,
  Square = 2,
  Sawtooth = 3,
  Inverse = 4,
}
export const LuminosityValues = Object.keys(Luminosity)
  .filter((key) => !isNaN(Number(key)))
  .map((key) => Number(key));

export enum Shape {
  Sphere = 0,
  Cube = 1,
  Pyramid = 2,
  Cylinder = 3,
}
export const ShapeValues = Object.keys(Shape)
  .filter((key) => !isNaN(Number(key)))
  .map((key) => Number(key));

export class Color {
  static White = vec3.fromValues(1, 1, 1);
  static Red = vec3.fromValues(1, 0, 0);
  static Green = vec3.fromValues(0, 1, 0);
  static Blue = vec3.fromValues(0, 0, 1);
  static Yellow = vec3.fromValues(1, 1, 0);
  static Magenta = vec3.fromValues(1, 0, 1);
  static Cyan = vec3.fromValues(0, 1, 1);
}
export const ColorValues = [
  Color.White,
  Color.Red,
  Color.Green,
  Color.Blue,
  Color.Yellow,
  Color.Magenta,
  Color.Cyan,
];

export class EmissionObject {
  constructor(
    public position: vec3,
    public luminosity: Luminosity = Luminosity.Solid,
    public shape: Shape = Shape.Sphere,
    public color: vec3 = Color.White,
    public componentObjects?: Set<EmissionObject>
  ) {}

  traitsEqual(other: EmissionObject): boolean {
    return (
      this.luminosity === other.luminosity &&
      this.shape === other.shape &&
      this.color === other.color
    );
  }
}
