import { DOMHandler } from "./dom-handler";
import { Player } from "./objects/player";

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
    Player.rotateX(-event.movementX * sensitivity);
    Player.rotateY(-event.movementY * sensitivity);
  });

  element.addEventListener("pointerdown", (event) => {
    if (!document.pointerLockElement) {
      // effectively tabbed out
      return;
    }
    if (!(event instanceof PointerEvent)) {
      return;
    }

    if (event.button === 0) {
      Player.interact();
    } else {
      Player.submit();
    }
  });

  element.addEventListener("wheel", (event) => {
    if (!document.pointerLockElement) {
      // effectively tabbed out
      return;
    }
    if (!(event instanceof WheelEvent)) {
      return;
    }

    Player.moveHeldObject(-event.deltaY * 0.002);
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
        Player.moveForward();
        break;
      case "KeyS":
        Player.moveBackward();
        break;
      case "KeyD":
        Player.moveRight();
        break;
      case "KeyA":
        Player.moveLeft();
        break;
      case "KeyE":
        Player.interact();
        break;
      case "KeyC":
        Player.combine();
        break;
      case "KeyB":
        Player.break();
        break;
      case "KeyQ":
        Player.submit();
        break;
      case "KeyH":
        DOMHandler.toggleControls();
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
        Player.stopMovingForward();
        break;
      case "KeyS":
        Player.stopMovingBackward();
        break;
      case "KeyD":
        Player.stopMovingRight();
        break;
      case "KeyA":
        Player.stopMovingLeft();
        break;
    }
  });
}
