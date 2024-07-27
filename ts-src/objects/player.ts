import { mat3, vec2, vec3 } from "gl-matrix";
import { Color, EmissionObject, Luminosity, Shape } from "./emission-object";
import { World } from "./world";
import { raySphereIntersect } from "../helpers";
import { DOMHandler } from "../dom-handler";

export class Player {
  private static position: vec3 = vec3.fromValues(0.05, 1, 0);
  static rotation: vec2 = vec2.create();
  private static heldObject: EmissionObject | undefined;
  private static lastStepTime: number;

  private static movingLeft: boolean;
  private static movingRight: boolean;
  private static movingForward: boolean;
  private static movingBackward: boolean;

  static moveForward() {
    this.movingForward = true;
  }

  static moveBackward() {
    this.movingBackward = true;
  }

  static moveLeft() {
    this.movingLeft = true;
  }

  static moveRight() {
    this.movingRight = true;
  }

  static stopMovingForward() {
    this.movingForward = false;
  }

  static stopMovingBackward() {
    this.movingBackward = false;
  }

  static stopMovingLeft() {
    this.movingLeft = false;
  }

  static stopMovingRight() {
    this.movingRight = false;
  }

  static step() {
    let delta = 16;
    if (this.lastStepTime) {
      const now = Date.now();
      delta = now - this.lastStepTime;
      this.lastStepTime = now;
    }
    let speed = 1 / delta;

    const movementVector = vec3.create();
    if (this.movingForward) {
      vec3.add(movementVector, movementVector, vec3.fromValues(0, 0, -1));
    }
    if (this.movingBackward) {
      vec3.add(movementVector, movementVector, vec3.fromValues(0, 0, 1));
    }
    if (this.movingLeft) {
      vec3.add(movementVector, movementVector, vec3.fromValues(-1, 0, 0));
    }
    if (this.movingRight) {
      vec3.add(movementVector, movementVector, vec3.fromValues(1, 0, 0));
    }

    if (vec3.len(movementVector) == 0) {
      return;
    }

    vec3.rotateY(
      movementVector,
      movementVector,
      vec3.create(),
      this.rotation[0]
    );

    vec3.normalize(movementVector, movementVector);
    vec3.scale(movementVector, movementVector, speed);
    vec3.add(this.position, this.position, movementVector);
    if (this.heldObject) {
      vec3.add(
        this.heldObject.position,
        this.heldObject.position,
        movementVector
      );
    }
  }

  static getPosition() {
    return this.position;
  }

  static rotateX(xrot: number) {
    this.rotation[0] += xrot;
    this.rotation[0] = this.rotation[0] % (2 * Math.PI);

    if (this.heldObject) {
      vec3.rotateY(
        this.heldObject.position,
        this.heldObject.position,
        this.position,
        xrot
      );
    }
  }

  static rotateY(yrot: number) {
    const rotationBefore = this.rotation[1];
    this.rotation[1] += yrot;
    if (this.rotation[1] > Math.PI / 2) {
      this.rotation[1] = Math.PI / 2;
    }
    if (this.rotation[1] < -Math.PI / 2) {
      this.rotation[1] = -Math.PI / 2;
    }

    if (this.heldObject) {
      const totalRotation = this.rotation[1] - rotationBefore;
      const objPos = this.heldObject.position;
      vec3.rotateY(objPos, objPos, this.position, -this.rotation[0]);
      vec3.rotateX(objPos, objPos, this.position, totalRotation);
      vec3.rotateY(objPos, objPos, this.position, this.rotation[0]);
    }
  }

  static interact() {
    if (this.heldObject) {
      this.heldObject = undefined;
      return;
    }

    const object = World.objectAtRay(this.position, this.lookVector());
    if (object !== undefined) {
      this.heldObject = object;
    }
  }

  static moveHeldObject(distance: number) {
    if (!this.heldObject) {
      return;
    }

    const lookVector = this.lookVector();
    vec3.scale(lookVector, lookVector, distance);
    const objPos = this.heldObject.position;
    vec3.add(objPos, objPos, lookVector);
  }

  static combine() {
    if (!this.heldObject) {
      return;
    }
    // not allowed to combine the target object
    if (this.heldObject === World.targetObject) {
      return;
    }

    // find all objects close enough
    const position = vec3.clone(this.heldObject.position);
    const candidates = [
      this.heldObject,
      ...World.buildingBlocks.filter(
        (object) => vec3.distance(object.position, position) < 0.4
      ),
    ];

    // only retain one for each trait
    const luminosityObject = candidates.find(
      (object) => object.luminosity !== Luminosity.Solid
    );
    const shapeObject = candidates.find(
      (object) => object.shape !== Shape.Sphere
    );
    const colorObject = candidates.find(
      (object) => object.color !== Color.White
    );

    const toRemove = new Set(
      [luminosityObject, shapeObject, colorObject].filter(
        (object) => object !== undefined
      )
    );

    // only found the held object
    if (toRemove.size <= 1) {
      return;
    }

    // update positions to be relative to held object for breaking apart
    toRemove.forEach((object) =>
      vec3.subtract(object.position, object.position, position)
    );
    const newObject = new EmissionObject(
      position,
      luminosityObject?.luminosity,
      shapeObject?.shape,
      colorObject?.color,
      toRemove
    );
    World.buildingBlocks = World.buildingBlocks.filter(
      (object) => !toRemove.has(object)
    );
    World.buildingBlocks.push(newObject);
    this.heldObject = newObject;
  }

  static break() {
    if (!this.heldObject) {
      return;
    }
    // can't break apart a non component object
    if (this.heldObject.componentObjects === undefined) {
      return;
    }

    World.buildingBlocks = World.buildingBlocks.filter(
      (object) => object !== this.heldObject
    );

    const position = this.heldObject.position;
    const componentObjects = this.heldObject.componentObjects;
    componentObjects.forEach((object) =>
      vec3.add(object.position, object.position, position)
    );
    World.buildingBlocks.push(...componentObjects);
    this.heldObject = undefined;
  }

  static submit() {
    let object;
    if (!this.heldObject) {
      object = World.objectAtRay(this.position, this.lookVector());
    } else {
      object = this.heldObject;
    }

    if (object === undefined || object === World.targetObject) {
      return;
    }

    if (object.traitsEqual(World.targetObject)) {
      DOMHandler.incrementScore();
      World.init();
      this.heldObject = undefined;
    }
  }

  private static lookVector() {
    const zero = vec3.create();
    const lookRay = vec3.fromValues(0, 0, -1);
    vec3.rotateX(lookRay, lookRay, zero, this.rotation[1]);
    vec3.rotateY(lookRay, lookRay, zero, this.rotation[0]);

    return lookRay;
  }
}
