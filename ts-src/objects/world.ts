import { vec3 } from "gl-matrix";
import {
  Color,
  ColorValues,
  EmissionObject,
  Luminosity,
  LuminosityValues,
  Shape,
  ShapeValues,
} from "./emission-object";

const targetPosition = vec3.fromValues(0.05, 1, -2.7);
const rightmostSpot = vec3.fromValues(-2.4, 1, 2.85);
const leftmostSpot = vec3.fromValues(2.5, 1, 2.85);

export class World {
  static targetObject: EmissionObject;
  static buildingBlocks: EmissionObject[];

  static init() {
    this.targetObject = new EmissionObject(
      targetPosition,
      Luminosity.Square,
      Shape.Pyramid,
      Color.Red
    );

    this.buildingBlocks = [];
    // this.initBuildingBlocks();
    this.initDebugBuildingBlocks();
  }

  static initBuildingBlocks() {
    const bbToCreate = 6;
    const offset = vec3.create();
    vec3.subtract(offset, rightmostSpot, leftmostSpot);
    vec3.scale(offset, offset, 1 / (bbToCreate - 1));
    for (let i = 0; i < bbToCreate; i++) {
      let bbPosition = vec3.clone(offset);
      vec3.scale(bbPosition, bbPosition, i);
      vec3.add(bbPosition, bbPosition, leftmostSpot);
      let color = Color.White;
      switch (i % 3) {
        case 0:
          color = Color.Red;
          break;
        case 1:
          color = Color.Green;
          break;
        case 2:
          color = Color.Blue;
          break;
      }
      this.buildingBlocks.push(
        new EmissionObject(bbPosition, undefined, undefined, color)
      );
    }
  }

  static initDebugBuildingBlocks() {
    const bbToCreate = Math.max(
      LuminosityValues.length,
      ShapeValues.length,
      ColorValues.length
    );
    const offset1 = vec3.create();
    vec3.subtract(offset1, rightmostSpot, leftmostSpot);
    vec3.scale(offset1, offset1, 1 / (bbToCreate - 1));
    const offset2 = vec3.create();
    vec3.rotateZ(offset2, offset1, vec3.create(), Math.PI / 4);

    LuminosityValues.forEach((value) => {
      const bbPosition = vec3.clone(offset1);
      vec3.scale(bbPosition, bbPosition, value);
      vec3.add(bbPosition, bbPosition, leftmostSpot);
      this.buildingBlocks.push(new EmissionObject(bbPosition, value));
    });

    ShapeValues.forEach((value) => {
      const bbPosition = vec3.clone(offset1);
      vec3.scale(bbPosition, bbPosition, value);
      vec3.add(bbPosition, bbPosition, vec3.fromValues(0, 1, 0));
      vec3.add(bbPosition, bbPosition, leftmostSpot);
      this.buildingBlocks.push(
        new EmissionObject(bbPosition, undefined, value)
      );
    });

    ColorValues.forEach((value) => {
      const bbPosition = vec3.clone(offset1);
      vec3.scale(bbPosition, bbPosition, value);
      vec3.add(bbPosition, bbPosition, vec3.fromValues(0, 2, 0));
      vec3.add(bbPosition, bbPosition, leftmostSpot);
      this.buildingBlocks.push(
        new EmissionObject(bbPosition, undefined, undefined, value)
      );
    });
  }
}
