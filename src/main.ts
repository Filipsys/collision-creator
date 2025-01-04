interface VertexShape {
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

let elements: (VertexShape | CircleShape)[] = [];
let dots: [number, number][] = [];
let hitboxDots: [number, number][][] = [];
const collisionQuality = 16;
const degreeCheck = 10;

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

const createHitboxes = () => {
  const vertexShapes = elements.filter((element) => "verticies" in element);
  const vertexValues = vertexShapes.map((element) => element.verticies);

  const xPosValues = vertexValues.map((verticies) => verticies.map((vertex) => vertex[0]));
  const yPosValues = vertexValues.map((verticies) => verticies.map((vertex) => vertex[1]));

  const xMaxValues = xPosValues.map((list) => Math.max(...list));
  const yMaxValues = yPosValues.map((list) => Math.max(...list));
  const xMinValues = xPosValues.map((list) => Math.min(...list));
  const yMinValues = yPosValues.map((list) => Math.min(...list));

  let maxValues: [number, number][] = [];
  xMaxValues.forEach((_, index) => maxValues.push([xMaxValues[index], yMaxValues[index]]));
  let minValues: [number, number][] = [];
  xMinValues.forEach((_, index) => minValues.push([xMinValues[index], yMinValues[index]]));

  minValues.forEach((list, index) => {
    const centerX = list[0] + Math.abs(list[0] - maxValues[index][0]) / 2;
    const centerY = list[1] + Math.abs(list[1] - maxValues[index][1]) / 2;

    let currentHitbox: [number, number][] = [];
    for (let i = 1; i <= collisionQuality; i++) {
      const oneFourth = collisionQuality / 4;
      const oneHalf = collisionQuality / 2; //------------- TODO: Make the quality customisable
      const threeFourths = (collisionQuality / 4) * 3;

      let x: number;
      let y: number;

      if (i == oneFourth || i == threeFourths) {
        x = centerX;
      } else if (i > oneFourth && i < threeFourths) {
        x = centerX - Math.abs(list[0] - maxValues[index][0]) / 2;
      } else {
        x = centerX + Math.abs(list[0] - maxValues[index][0]) / 2;
      }

      if (i == 1 || i == oneHalf || i == collisionQuality) {
        y = centerY;
      } else if (i > 1 && i < oneHalf) {
        y = centerY - Math.abs(list[0] - maxValues[index][0]) / 2;
      } else {
        y = centerY + Math.abs(list[0] - maxValues[index][0]) / 2;
      }

      currentHitbox.push([x, y]);
    }
    hitboxDots.push(currentHitbox);

    dots.push([centerX, centerY]);
  });
};

// ---

const draw = () => {
  context.fillStyle = "white";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  elements.forEach((element) => {
    context.fillStyle = "black";
    context.beginPath();

    if ("verticies" in element) {
      // Start at the first vertex and move around
      context.moveTo(element.verticies[0][0], element.verticies[0][1]);
      element.verticies.forEach((vertex) => {
        context.lineTo(vertex[0], vertex[1]);
      });

      context.fill();
    } else {
      // TODO: Circle shape hitboxes
      // context.arc(element.center[0], element.center[1], element.radius, 0, 2 * Math.PI);
      // context.fill();
    }
  });

  // Center dots
  dots.forEach((location) => {
    context.fillStyle = "green";
    context.beginPath();
    context.arc(location[0], location[1], 3, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  });

  // Hitbox outline
  hitboxDots.forEach((list) => {
    context.fillStyle = "rgba(0, 0, 255, 0.2)";
    context.strokeStyle = "blue";
    context.beginPath();

    list.forEach((point) => {
      context.lineTo(point[0], point[1]);
    });
    context.closePath();
    context.stroke();
    context.fill();
  });

  // Hitbox vertex dots
  hitboxDots.forEach((list) => {
    context.fillStyle = "red";

    list.forEach((point) => {
      context.beginPath();
      context.arc(point[0], point[1], 3, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    });
  });
};

const update = () => {};

const loop = () => {
  update();
  draw();

  window.requestAnimationFrame(loop);
};

// ---

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
createRectangle([
  [400, 250],
  [500, 200],
  [500, 350],
  [400, 400],
]);
createCircle([400, 400], 50);
createHitboxes();

window.requestAnimationFrame(loop);
