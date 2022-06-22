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
