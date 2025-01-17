import { PBRMaterial } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

function createGround(scene, BABYLON) {
  const { Color3, Texture, MeshBuilder, StandardMaterial } = BABYLON;

  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 50, height: 50 },
    scene
  );

  // 강의에서는 standard Material로 진행했는데
  const groundMat = new PBRMaterial("groundMat", scene);
  const diffuseTex = new Texture("../textures/groundTexDiffuse.jpg", scene);
  const normalTex = new Texture("../textures/groundTexNormal.jpg", scene);

  groundMat.albedoTexture = diffuseTex;
  groundMat.bumpTexture = normalTex;
  // groundMat.normalTexture = normalTex;
  // normalTexture 속성은 standard material이랑 PBR material 에 둘 다 없음 !!

  diffuseTex.uScale = 10;
  diffuseTex.vScale = 10;
  normalTex.uScale = 10;
  normalTex.vScale = 10;

  groundMat.metallic = 0.5;
  groundMat.roughness = 0.5;

  groundMat.specularColor = new Color3(0, 0, 0);

  ground.material = groundMat;
}

export default async function gameScene(BABYLON, engine, currentScene) {
  const {
    SceneLoader,
    Vector3,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    ActionManager,
    ExecuteCodeAction,
    Matrix,
  } = BABYLON;

  let isMoving = false;
  let characterSpeed = 4;

  function Move(directionPos) {
    isMoving = true;
    const { x, z } = directionPos;
    characterBox.lookAt(new Vector3(x, characterBox.position.y, z), 0, 0, 0);
    animations.forEach((anime) => anime.name === "running" && anime.play(true));
  }

  function Stop() {
    targetBox.position.y = 100;
    isMoving = false;
    animations.forEach((anime) => anime.name === "running" && anime.stop(true));
  }

  const scene = new BABYLON.Scene(engine);
  // you can create multiple scene, bathroom scene ...
  // 예를들어서 게임에서 다른 방으로 향하는 문이 있고, 그 문 안으로 들어가면 그 전 환경은 disposed 됨

  const cam = new FreeCamera("first camera", new Vector3(0, 1, -5), scene);

  cam.attachControl();
  const light = new HemisphericLight("lisada", new Vector3(0, 10, 0), scene);
  // light creted in the scene

  const model = await SceneLoader.ImportMeshAsync(
    "",
    "../models/",
    "character.glb",
    scene
  );

  console.log(model);

  const animations = model.animationGroups;
  const meshes = model.meshes;

  // 0번이 root mesh -> parent of meshes, containers, if you move root mesh children will also follow
  const rootMesh = meshes[0];

  const characterBox = MeshBuilder.CreateBox(
    "characterBox",
    { size: 1, height: 2 },
    scene
  );

  rootMesh.parent = characterBox;
  characterBox.isVisible = 0;
  characterBox.position.y = +1;
  rootMesh.position.y = -1;
  console.log(meshes);

  animations.forEach((anim) => anim.name === "idle" && anim.play(true));

  const targetBox = MeshBuilder.CreateBox("targetBox", { size: 0.2 }, scene);
  targetBox.isPickable = false;
  targetBox.isVisible = 0;
  targetBox.actionManager = new ActionManager(scene);
  targetBox.actionManager.registerAction(
    new ExecuteCodeAction(
      {
        trigger: ActionManager.OnIntersectionEnterTrigger,
        parameter: characterBox,
      },
      (e) => {
        Stop();
      }
    )
  );

  createGround(scene, BABYLON);

  //camera container control = cam control
  const cameraContainer = MeshBuilder.CreateGround(
    "cameraContainer",
    { width: 0.5, height: 0.5 },
    scene
  );

  cameraContainer.position = new Vector3(0, 15, 0);
  cam.parent = cameraContainer;
  cam.setTarget(new Vector3(0, -10, 0));

  let camVertical = 0;
  let camHorizontal = 0;
  let camSpd = 3;

  window.addEventListener("keydown", (e) => {
    const theKey = e.key.toLowerCase();

    if (theKey === "arrowup") camVertical = 1;
    if (theKey === "arrowdown") camVertical = -1;
    if (theKey === "arrowleft") camHorizontal = -1;
    if (theKey === "arrowright") camHorizontal = 1;
  });

  window.addEventListener("keyup", (e) => {
    const theKey = e.key.toLowerCase();

    if (theKey === "arrowup") camVertical = 0;
    if (theKey === "arrowdown") camVertical = 0;
    if (theKey === "arrowleft") camHorizontal = 0;
    if (theKey === "arrowright") camHorizontal = 0;
  });

  scene.onPointerDown = (e) => {
    if (e.buttons === 1) {
      const pickInfo = scene.pick(scene.pointerX, scene.pointerY);

      console.log(pickInfo);
      if (pickInfo.pickedMesh.name === "ground") {
        targetBox.position = pickInfo.pickedPoint;
        Move(pickInfo.pickedPoint);
      }
    }
  };
  scene.registerAfterRender(() => {
    const deltaTime = engine.getDeltaTime() / 1000;
    cameraContainer.locallyTranslate(
      new Vector3(
        camHorizontal * camSpd * deltaTime,
        0,
        camVertical * camSpd * deltaTime
      )
    );

    if (isMoving)
      characterBox.locallyTranslate(
        new Vector3(0, 0, characterSpeed * deltaTime)
      );
  });

  await scene.whenReadyAsync();
  // Returns a promise that resolves when the scene is ready
  currentScene.dispose();

  return scene;
}
