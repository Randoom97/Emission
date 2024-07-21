import { Player } from "./objects/player";
import { setupListeners } from "./listeners";
import { drawScene } from "./renderer/draw-scene";
import { World } from "./objects/world";
import { RenderData } from "./renderer/render-data";

main();

async function main() {
  const canvas = <HTMLCanvasElement>document.querySelector("#glcanvas");
  const gl = <WebGLRenderingContext>canvas.getContext("webgl");

  setupListeners(gl);
  World.init();
  await RenderData.init(gl);

  function render() {
    drawScene(gl);
    Player.step();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
