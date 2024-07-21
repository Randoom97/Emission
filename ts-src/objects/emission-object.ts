import { vec3 } from "gl-matrix";

enum Luminosity {
  Solid,
  Sine,
  Square,
  Sawtooth,
}

enum Shape {
  Sphere,
  Cube,
  Pyramid,
}

enum Color {
  White,
  Red,
  Green,
  Blue,
}

export class EmissionObject {
  constructor(
    public position: vec3,
    luminosity: Luminosity = Luminosity.Solid,
    shape: Shape = Shape.Sphere,
    color: Color = Color.White
  ) {}
}
