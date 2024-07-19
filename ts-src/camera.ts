import { vec2, vec3 } from "gl-matrix";

enum Horizontal {
  Left,
  Right,
}

enum Lateral {
  Forward,
  Backward,
}

export class Camera {
  private static position: vec3 = vec3.fromValues(0, -1, 0);
  private static rotation: vec2 = vec2.create();

  private static horizontalMovement: Horizontal | undefined;
  private static lateralMovement: Lateral | undefined;

  static moveForward() {
    this.lateralMovement = Lateral.Forward;
  }

  static moveBackward() {
    this.lateralMovement = Lateral.Backward;
  }

  static moveLeft() {
    this.horizontalMovement = Horizontal.Left;
  }

  static moveRight() {
    this.horizontalMovement = Horizontal.Right;
  }

  static stopLateralMovement() {
    this.lateralMovement = undefined;
  }

  static stopHorizontalMovement() {
    this.horizontalMovement = undefined;
  }

  static step() {
    let speed = 0.07;

    const movementVector = vec3.create();
    if (this.lateralMovement !== undefined) {
      movementVector[2] = this.lateralMovement === Lateral.Forward ? 1 : -1;
    }
    if (this.horizontalMovement !== undefined) {
      movementVector[0] = this.horizontalMovement === Horizontal.Left ? 1 : -1;
    }

    if (vec3.len(movementVector) == 0) {
      return;
    }

    vec3.rotateY(
      movementVector,
      movementVector,
      vec3.create(),
      -this.rotation[0]
    );

    vec3.normalize(movementVector, movementVector);
    vec3.scale(movementVector, movementVector, speed);
    vec3.add(this.position, this.position, movementVector);
  }

  static getPosition() {
    return this.position;
  }

  static rotateX(xrot: number) {
    this.rotation[0] += xrot;
    this.rotation[0] = this.rotation[0] % (2 * Math.PI);
  }

  static rotateY(yrot: number) {
    this.rotation[1] += yrot;
    if (this.rotation[1] > Math.PI / 2) {
      this.rotation[1] = Math.PI / 2;
    }
    if (this.rotation[1] < -Math.PI / 2) {
      this.rotation[1] = -Math.PI / 2;
    }
  }

  static getRotation() {
    return this.rotation;
  }
}
