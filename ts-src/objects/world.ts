import { vec3 } from "gl-matrix";
import { EmissionObject } from "./emission-object";

const targetPosition = vec3.fromValues(0.05, 1, -2.7);
const rightmostSpot = vec3.fromValues(-2.4, 1, 2.85);
const leftmostSpot = vec3.fromValues(2.5, 1, 2.85);

export class World {
  static targetObject: EmissionObject;
  static buildingBlocks: EmissionObject[] = [];

  static init() {
    this.targetObject = new EmissionObject(targetPosition);

    const bbToCreate = 5;
    const offset = vec3.create();
    vec3.subtract(offset, leftmostSpot, rightmostSpot);
    vec3.scale(offset, offset, 1 / (bbToCreate - 1));
    for (let i = 0; i < bbToCreate; i++) {
      let bbPosition = vec3.clone(offset);
      vec3.scale(bbPosition, bbPosition, i);
      vec3.add(bbPosition, bbPosition, rightmostSpot);
      this.buildingBlocks.push(new EmissionObject(bbPosition));
    }
  }
}
