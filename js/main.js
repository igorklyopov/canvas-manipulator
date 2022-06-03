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
    if (e.target.type === 'range') {
      renderControllsValues(e);
    }

    setShapeParams(e);

    clearCanvas();
    drawEllipse();
  });
  controllsShapeRef.addEventListener('mousewheel', (e) => {
    if (e.target.type !== 'range') {
      return;
    }

    const maxValue = Number(e.target.max);
    const minValue = Number(e.target.min);
    const step = Number(e.target.step);
    const currentValue = Number(e.target.value);

    if (e.deltaY < 0 && currentValue < maxValue) {
      e.target.value = currentValue + step;
    } else if (e.deltaY > 0 && currentValue > minValue) {
      e.target.value = currentValue - step;
    }

    setShapeParams(e);
    renderControllsValues(e);

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
      inputItem.value =
        inputItem.dataset.type === 'angle'
          ? convertRadianToGrad(savedValue)
          : savedValue;

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

  function setShapeParams(e) {
    // set params
    shapeParams[e.target.name] =
      e.target.type === 'range' ? Number(e.target.value) : e.target.value;

    if (e.target.dataset.type === 'angle') {
      shapeParams[e.target.name] = convertGradToRadian(e.target.value);
    }
    // ------------

    // save params
    localStorage.setItem('shapeParams', JSON.stringify(shapeParams));
    // ------------
  }

  function renderControllsValues(e) {
    controlValueRefs[e.target.name].innerText = e.target.value;
  }

  // console.log('ctx', ctx);
}
getCanvasEllipseControls('canvas-ellipse');

// utils
function convertGradToRadian(deg) {
  return Number(((deg / 180) * Math.PI).toFixed(4));
}

function convertRadianToGrad(rad) {
  return Number(((rad * 180) / Math.PI).toFixed());
}
// ------------

// <===== ======

// ====== ======>
//
// <===== ======

// ====== ======>
//
// <====== ======

// ====== ======>
// <===== ======

// ====== ======>
//
// <===== ======
