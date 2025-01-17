import * as BABYLON from "@babylonjs/core";
import main from "./scenes/main";

const log = console.log;

let engine = new BABYLON.Engine(document.querySelector("canvas"));
let currentScene = new BABYLON.Scene(engine);
// you can create multiple scenes or engines, but very rare

await main(BABYLON, engine, currentScene);
