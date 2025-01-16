export default async function gameScene(BABYLON, engine, currentScene) {
  const { Vector3, FreeCamera, HemisphericLight, MeshBuilder } = BABYLON;
  const scene = new BABYLON.Scene(engine);
  // you can create multiple scene, bathroom scene ...
  // 예를들어서 게임에서 다른 방으로 향하는 문이 있고, 그 문 안으로 들어가면 그 전 환경은 disposed 됨

  const cam = new FreeCamera("first camera", new Vector3(0, 1, -5), scene);

  const light = new HemisphericLight("lisada", new Vector3(0, 10, 0), scene);
  // light creted in the scene

  // meshbuilder = creating shapes
  const box = MeshBuilder.CreateBox("name", { size: 1 }, scene);

  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 50, height: 50 },
    scene
  );

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

  window.addEventListener("keydown", (e) => {
    const theKey = e.key.toLowerCase();

    if (theKey === "arrowup") camVertical = 1;
    if (theKey === "arrowdown") camVertical = -1;
    if (theKey === "arrowleft") camHorizontal = -1;
    if (theKey === "arrowright") camHorizontal = 1;

    cameraContainer.locallyTranslate(
      new Vector3(camHorizontal, 0, camVertical)
    );
  });

  window.addEventListener("keyup", (e) => {
    const theKey = e.key.toLowerCase();

    if (theKey === "arrowup") camVertical = 0;
    if (theKey === "arrowdown") camVertical = 0;
    if (theKey === "arrowleft") camHorizontal = 0;
    if (theKey === "arrowright") camHorizontal = 0;
  });

  await scene.whenReadyAsync();
  // Returns a promise that resolves when the scene is ready
  currentScene.dispose();

  return scene;
}
