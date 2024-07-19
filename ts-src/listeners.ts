import { Camera } from "./camera";

export function setupListeners(gl: WebGLRenderingContext) {
  setupResizeListener(gl);

  // This lets us keep the pointer in the window even when dragging the mouse around.
  // If the pointer lock isn't active then any mouse/keyboard events should be ignored.
  gl.canvas.addEventListener("click", () =>
    (gl.canvas as Element).requestPointerLock()
  );

  setupMouseListeners(gl.canvas as Element);
  setupKeyboardListeners(gl.canvas as Element);
}

function setupResizeListener(gl: WebGLRenderingContext) {
  // Setting the size in css without explicit values causes the resolution to be small and stretch.
  // This makes it so the resolution matches the viewport.
  function resizeCanvas() {
    gl.canvas.width = (gl.canvas as Element).clientWidth;
    gl.canvas.height = (gl.canvas as Element).clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // resize immediately on page load
}

function setupMouseListeners(element: Element) {
  element.addEventListener("pointermove", (event) => {
    if (!document.pointerLockElement) {
      // effectively tabbed out
      return;
    }
    if (!(event instanceof PointerEvent)) {
      return;
    }

    const sensitivity = 0.005;
    Camera.rotateX(event.movementX * sensitivity);
    Camera.rotateY(event.movementY * sensitivity);
  });
}

function setupKeyboardListeners(element: Element) {
  element.addEventListener("keydown", (event) => {
    if (!document.pointerLockElement) {
      // effectively tabbed out
      return;
    }
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    switch (event.code) {
      case "KeyW":
        Camera.moveForward();
        break;
      case "KeyS":
        Camera.moveBackward();
        break;
      case "KeyD":
        Camera.moveRight();
        break;
      case "KeyA":
        Camera.moveLeft();
        break;
    }
  });

  element.addEventListener("keyup", (event) => {
    if (!document.pointerLockElement) {
      // effectively tabbed out
      return;
    }
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    switch (event.code) {
      case "KeyW":
      case "KeyS":
        Camera.stopLateralMovement();
        break;
      case "KeyD":
      case "KeyA":
        Camera.stopHorizontalMovement();
        break;
    }
  });
}