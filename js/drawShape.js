// const drawShape = {
//   ellipse(canvasContext, shapeParams) {
//     canvasContext.fillStyle = shapeParams.fillStyle;
//     canvasContext.lineWidth = shapeParams.lineWidth;
//     canvasContext.strokeStyle = shapeParams.strokeStyle;
//     canvasContext.lineCap = shapeParams.lineCap;
//     canvasContext.beginPath();
//     canvasContext.ellipse(
//       shapeParams.cx,
//       shapeParams.cy,
//       shapeParams.radiusX,
//       shapeParams.radiusY,
//       shapeParams.rotation,
//       shapeParams.startAngle,
//       shapeParams.endAngle,
//       shapeParams.counterclockwise
//     );
//     if (shapeParams.lineWidth > 0) canvasContext.stroke();
//     if (shapeParams.fill) canvasContext.fill();
//     canvasContext.closePath();
//   },
//   shape(canvasContext, shapeParams) {
//     console.log(canvasContext);
//     console.log(shapeParams);
//     console.log(shapeParams.a + shapeParams.b);
//   }
// };

// drawShape.shape('ctx', { a: 10, b: 5 });
// let shapeType='shape';
// drawShape[shapeType]('ctx', { a: 10, b: 5 });

const drawShape = (canvasContext, shapeType, shapeParams) => {
  switch (shapeType) {
    case 'ellipse':
      canvasContext.fillStyle = shapeParams.fillStyle;
      canvasContext.lineWidth = shapeParams.lineWidth;
      canvasContext.strokeStyle = shapeParams.strokeStyle;
      canvasContext.lineCap = shapeParams.lineCap;
      canvasContext.beginPath();
      canvasContext.ellipse(
        shapeParams.cx,
        shapeParams.cy,
        shapeParams.radiusX,
        shapeParams.radiusY,
        shapeParams.rotation,
        shapeParams.startAngle,
        shapeParams.endAngle,
        shapeParams.counterclockwise
      );
      if (shapeParams.lineWidth > 0) canvasContext.stroke();
      if (shapeParams.fill) canvasContext.fill();
      canvasContext.closePath();
      break;

    default:
      break;
  }
};
