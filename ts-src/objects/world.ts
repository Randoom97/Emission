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
import { getRandomInt, raySphereIntersect, shuffle } from "../helpers";

const targetPosition = vec3.fromValues(0.05, 1, -2.7);
const rightmostSpot = vec3.fromValues(-2.4, 1, 2.85);
const leftmostSpot = vec3.fromValues(2.5, 1, 2.85);

export class World {
  static targetObject: EmissionObject;
  static buildingBlocks: EmissionObject[];

  static init() {
    let targetProperties = this.generateTargetProperties();
    while (
      (targetProperties.color === Color.White &&
        targetProperties.luminosity == Luminosity.Solid,
      targetProperties.shape === Shape.Sphere)
    ) {
      targetProperties = this.generateTargetProperties();
    }

    this.targetObject = new EmissionObject(
      vec3.clone(targetPosition),
      targetProperties.luminosity,
      targetProperties.shape,
      targetProperties.color
    );

    this.buildingBlocks = [];
    this.initBuildingBlocks();
    // this.initDebugBuildingBlocks();
  }

  static objectAtRay(origin: vec3, lookRay: vec3) {
    let objects = [];
    for (let object of [World.targetObject, ...World.buildingBlocks]) {
      if (raySphereIntersect(origin, lookRay, object.position, 0.1)) {
        objects.push(object);
      }
    }
    if (objects.length === 0) {
      return undefined;
    }
    const distances = objects.map((object) => {
      const distanceVector = vec3.create();
      vec3.subtract(distanceVector, object.position, origin);
      return [vec3.length(distanceVector), object];
    });

    distances.sort();
    return distances[0][1] as EmissionObject;
  }

  static generateTargetProperties() {
    return {
      luminosity: LuminosityValues[getRandomInt(LuminosityValues.length - 1)],
      shape: ShapeValues[getRandomInt(ShapeValues.length - 1)],
      color: ColorValues[getRandomInt(ColorValues.length - 1)],
    };
  }

  static initBuildingBlocks() {
    let basicProperties = this.allBasicProperties();
    const basicLuminosity = basicProperties.find(
      (properties) => properties.luminosity === this.targetObject.luminosity
    )!;
    const basicShape = basicProperties.find(
      (properties) => properties.shape === this.targetObject.shape
    )!;
    const basicColor = basicProperties.find(
      (properties) => properties.color === this.targetObject.color
    )!;

    const toCreateSet = new Set<typeof basicLuminosity>([
      basicLuminosity,
      basicShape,
      basicColor,
    ]);

    basicProperties = basicProperties.filter(
      (properties) => !toCreateSet.has(properties)
    );

    shuffle(basicProperties);

    const bbToCreate = 8;
    while (toCreateSet.size < bbToCreate) {
      toCreateSet.add(basicProperties.pop()!);
    }

    const offset = vec3.create();
    vec3.subtract(offset, rightmostSpot, leftmostSpot);
    vec3.scale(offset, offset, 1 / (bbToCreate - 1));

    const toCreateList = [...toCreateSet];
    shuffle(toCreateList);
    toCreateList.forEach((properties, i) => {
      let bbPosition = vec3.clone(offset);
      vec3.scale(bbPosition, bbPosition, i);
      vec3.add(bbPosition, bbPosition, leftmostSpot);
      this.buildingBlocks.push(
        new EmissionObject(
          bbPosition,
          properties.luminosity,
          properties.shape,
          properties.color
        )
      );
    });
  }

  static initDebugBuildingBlocks() {
    const basicProperties = this.allBasicProperties();

    const bbToCreate = basicProperties.length;
    const offset = vec3.create();
    vec3.subtract(offset, rightmostSpot, leftmostSpot);
    vec3.scale(offset, offset, 1 / (bbToCreate - 1));
    for (let i = 0; i < bbToCreate; i++) {
      let bbPosition = vec3.clone(offset);
      vec3.scale(bbPosition, bbPosition, i);
      vec3.add(bbPosition, bbPosition, leftmostSpot);
      const properties = basicProperties[i];
      this.buildingBlocks.push(
        new EmissionObject(
          bbPosition,
          properties.luminosity,
          properties.shape,
          properties.color
        )
      );
    }
  }

  private static allBasicProperties() {
    const defaultPropertySet = {
      luminosity: Luminosity.Solid,
      shape: Shape.Sphere,
      color: Color.White,
    };

    const objects: Array<typeof defaultPropertySet> = [];
    LuminosityValues.filter((value) => value !== Luminosity.Solid).forEach(
      (value) => objects.push({ ...defaultPropertySet, luminosity: value })
    );
    ShapeValues.filter((value) => value !== Shape.Sphere).forEach((value) =>
      objects.push({ ...defaultPropertySet, shape: value })
    );
    ColorValues.filter((value) => value !== Color.White).forEach((value) =>
      objects.push({ ...defaultPropertySet, color: value })
    );

    return objects;
  }
}
