import {
  Scene,
  HemisphericLight,
  Vector3,
  Engine,
  Mesh,
  ArcRotateCamera,
  TransformNode,
}  from "babylonjs";
import * as GUI from "babylonjs-gui";
// Get the canvas DOM element
var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
// Load the 3D engine
var engine: Engine = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
};

var createScene = async function () {


  var scene = new Scene(engine);
  var camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), scene);
  var anchor = new TransformNode("");

  var light = new HemisphericLight(
    "light1",
    new Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;

  const env = scene.createDefaultEnvironment();

  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [env.ground],
  });


  camera.wheelDeltaPercentage = 0.01;
  camera.attachControl(canvas, true);

  // Create the 3D UI manager
  var manager = new GUI.GUI3DManager(scene);

  var panel = new GUI.CylinderPanel();
  panel.margin = 0.2;

  manager.addControl(panel);
  panel.linkToTransformNode(anchor);
  panel.position.z = -1.5;

  // Let's add some buttons!
  var addButton = function() {
      var button = new GUI.HolographicButton("orientation");
      panel.addControl(button);

      button.text = "Button #" + panel.children.length;
  }

  panel.blockLayout = true;
  for (var index = 0; index < 60; index++) {
      addButton();    
  }
  panel.blockLayout = false;
  return scene;
};

try {
  engine = createDefaultEngine();
} catch (e) {
  console.log(
    "the available createEngine function failed. Creating the default engine instead"
  );
  engine = createDefaultEngine();
}
if (!engine) throw "engine should not be null.";

createScene().then((returnedScene) => {
  sceneToRender = returnedScene;
});

engine.runRenderLoop(function () {
  if (sceneToRender) {
    sceneToRender.render();
  }
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
