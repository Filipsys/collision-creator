interface vertexShape {
  verticies: number[][];
}

interface CircleShape {
  center: [number, number];
  radius: number;
}

// ---

const canvas = document.getElementById("app") as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas not found");

const context = canvas.getContext("2d") as CanvasRenderingContext2D;
if (!context) throw new Error("Context not found");

// ---

let elements: (vertexShape | CircleShape)[] = [];
const collisionQuality = 5;
const degreeCheck = 30;

const createRectangle = (inputVerticies: number[][]) => {
  elements.push({
    verticies: inputVerticies,
  });
};

const createCircle = (centerLoc: [number, number], radiusAmount: number) => {
  elements.push({
    center: centerLoc,
    radius: radiusAmount,
  });
};

// ---

const draw = () => {
  context.fillStyle = "black";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  elements.forEach((element) => {
    context.fillStyle = "white";
    context.beginPath();

    if ("verticies" in element) {
      // Start at the first vertex and move around
      context.moveTo(element.verticies[0][0], element.verticies[0][1]);
      element.verticies.forEach((vertex) => {
        context.lineTo(vertex[0], vertex[1]);
      });

      context.fill();
    } else {
      // Circle shape
      context.arc(element.center[0], element.center[1], element.radius, 0, 2 * Math.PI);
      context.fill();
    }
  });

  // Display the colliders
  // elements.forEach((element) => {
  //   const centerOfElement = element;
  // });
};

const update = () => {};

const loop = () => {
  update();
  draw();

  window.requestAnimationFrame(loop);
};

createRectangle([
  [100, 100],
  [200, 100],
  [200, 200],
  [100, 200],
]);
createRectangle([
  [200, 200],
  [300, 200],
  [300, 300],
  [200, 300],
]);
createCircle([400, 400], 50);

window.requestAnimationFrame(loop);
