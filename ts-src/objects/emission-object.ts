import { vec3 } from "gl-matrix";

export enum Luminosity {
  Solid = 0,
  Sine = 1,
  Square = 2,
  Sawtooth = 3,
}
export const LuminosityValues = Object.keys(Luminosity)
  .filter((key) => !isNaN(Number(key)))
  .map((key) => Number(key));

export enum Shape {
  Sphere = 0,
  Cube = 1,
  Pyramid = 2,
}
export const ShapeValues = Object.keys(Shape)
  .filter((key) => !isNaN(Number(key)))
  .map((key) => Number(key));

export enum Color {
  White = 0,
  Red = 1,
  Green = 2,
  Blue = 3,
}
export const ColorValues = Object.keys(Color)
  .filter((key) => !isNaN(Number(key)))
  .map((key) => Number(key));

export class EmissionObject {
  constructor(
    public position: vec3,
    public luminosity: Luminosity = Luminosity.Solid,
    public shape: Shape = Shape.Sphere,
    public color: Color = Color.White,
    public componentObjects?: Set<EmissionObject>
  ) {}

  getColor(): vec3 {
    switch (this.color) {
      case Color.White:
        return vec3.fromValues(1, 1, 1);
      case Color.Red:
        return vec3.fromValues(1, 0, 0);
      case Color.Green:
        return vec3.fromValues(0, 1, 0);
      case Color.Blue:
        return vec3.fromValues(0, 0, 1);
    }
  }

  traitsEqual(other: EmissionObject): boolean {
    return (
      this.luminosity === other.luminosity &&
      this.shape === other.shape &&
      this.color === other.color
    );
  }
}
