console.log('main.js connection success');

// ====== ======>
function getCanvasEllipseControls(...args) {
  const [containerClassName] = args;

  // refs
  const canvasContainerRef = document.querySelector(`.${containerClassName}`);
  const controllsShapeRef = canvasContainerRef.querySelector(
    '.js-controlls-shape'
  );
  const controllsCanvasRef = canvasContainerRef.querySelector(
    '.js-controlls-canvas'
  );

  // canvas
  const canvasRef = document.getElementById('canvas-ellipse');
  const ctx = canvasRef.getContext('2d');

  const controlValueRefs = {
    cx: canvasContainerRef.querySelector('[data-value = "cx"]'),
    cy: canvasContainerRef.querySelector('[data-value = "cy"]'),
    radiusX: canvasContainerRef.querySelector('[data-value = "radiusX"]'),
    radiusY: canvasContainerRef.querySelector('[data-value = "radiusY"]'),
    rotation: canvasContainerRef.querySelector('[data-value = "rotation"]'),
    startAngle: canvasContainerRef.querySelector('[data-value = "startAngle"]'),
    endAngle: canvasContainerRef.querySelector('[data-value = "endAngle"]'),
  };
  // ------------

  // get saved params
  const savedShapeParams = JSON.parse(localStorage.getItem('shapeParams'));
  // ------------

  const initialShapeParams = {
    cx: 0,
    cy: 0,
    radiusX: 0,
    radiusY: 0,
    rotation: 0,
    startAngle: 0,
    endAngle: 0,
    counterclockwise: true,
  };

  const shapeParams = savedShapeParams ?? initialShapeParams;

  controllsShapeRef.addEventListener('input', (e) => {
    // render controlls values
    if (e.target.type === 'range') {
      controlValueRefs[e.target.name].innerText = e.target.value;
    }
    // ------------

    shapeParams[e.target.name] =
      e.target.type === 'range' ? Number(e.target.value) : e.target.value;

    // save params
    localStorage.setItem('shapeParams', JSON.stringify(shapeParams));
    // ------------

    clearCanvas();
    drawEllipse();
  });

  drawEllipse();

  const controllsInputRefs =
    canvasContainerRef.querySelectorAll('.js-control-input');

  controllsInputRefs.forEach((inputItem) => {
    if (!savedShapeParams) return;

    const savedValue = savedShapeParams[inputItem.name];

    if (inputItem.type === 'range') {
      inputItem.value = savedValue;
      controlValueRefs[inputItem.name].innerText = inputItem.value;
    }

    if (inputItem.type === 'radio' && inputItem.value === savedValue) {
      inputItem.checked = true;
    }
  });

  // functions
  function clearCanvas() {
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
  }

  function drawEllipse() {
    // ctx.fillStyle = 'green';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.ellipse(
      shapeParams.cx,
      shapeParams.cy,
      shapeParams.radiusX,
      shapeParams.radiusY,
      shapeParams.rotation,
      shapeParams.startAngle,
      shapeParams.endAngle,
      shapeParams.counterclockwise
    );
    ctx.stroke();
    // ctx.fill();
  }

  // console.log('ctx', ctx);
}
getCanvasEllipseControls('canvas-ellipse');

// <===== ======

// ====== ======>
// <===== ======

// ====== ======>
// <===== =====

// ====== ======>
// <===== ======

// ====== ======>
// <===== ======
