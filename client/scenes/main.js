// handle all the scene functionality
// if you when reaload project or browser, this will initialize scene ... ect

import gameScene from "./gameScene";

let scene = undefined;

export default async function main(BABYLON, engine, currentScene) {
  scene = await gameScene(BABYLON, engine, currentScene);

  engine.runRenderLoop(() => {
    scene.render();
  });
}
