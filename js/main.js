// ====== ======>
function getCanvasEllipseControls(...args) {
  const [containerClassName] = args;

  // refs
  const canvasContainerRef = document.querySelector(`.${containerClassName}`);
  const controlsShapeRef =
    canvasContainerRef.querySelector('.js-controls-shape');
  const controlsCanvasRef = canvasContainerRef.querySelector(
    '.js-controls-canvas'
  );
  const controlsInputRefs =
    canvasContainerRef.querySelectorAll('.js-control-input');
  const controlsMaxValueRefs = canvasContainerRef.querySelectorAll(
    '[data-type="max-value"]'
  );

  // canvas
  const canvasRef = document.getElementById('canvas-ellipse');
  const ctx = canvasRef.getContext('2d');
  //------------

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
  const savedControlMaxValues = JSON.parse(
    localStorage.getItem('controlMaxValues')
  );
  // ------------

  const initialControlMaxValues = {
    cx: canvasRef.width,
    cy: canvasRef.height,
    radiusX: 100,
    radiusY: 100,
    rotation: 360,
    startAngle: 360,
    endAngle: 360,
  };

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

  const controlMaxValues = savedControlMaxValues ?? initialControlMaxValues;
  const shapeParams = savedShapeParams ?? initialShapeParams;

  controlsShapeRef.addEventListener('change', (e) => {
    if (e.target.type === 'range') {
      renderControlsValues(e);
    }

    if (e.target.dataset.type === 'max-value') {
      setControlMaxValues(e);
    } else {
      setShapeParams(e);
    }

    clearCanvas();
    drawEllipse();
  });
  controlsShapeRef.addEventListener('mousewheel', (e) => {
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
    renderControlsValues(e);

    clearCanvas();
    drawEllipse();
  });

  initControlsValues();
  drawEllipse();

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

  function renderControlsValues(e) {
    controlValueRefs[e.target.name].innerText = e.target.value;
  }

  function setControlMaxValues(e) {
    controlsInputRefs.forEach((controlItem) => {
      if (controlItem.name === e.target.dataset.for) {
        controlItem.max = e.target.value;
        controlMaxValues[controlItem.name] = Number(e.target.value);
      }
    });

    localStorage.setItem('controlMaxValues', JSON.stringify(controlMaxValues));
  }

  function initControlsValues() {
    controlsInputRefs.forEach((inputItem) => {
      if (!savedShapeParams) return;

      const savedValue = savedShapeParams[inputItem.name];

      if (inputItem.type === 'range') {
        inputItem.value =
          inputItem.dataset.type === 'angle'
            ? convertRadianToGrad(savedValue)
            : savedValue;

        inputItem.max = controlMaxValues[inputItem.name];

        controlValueRefs[inputItem.name].innerText = inputItem.value;
      }

      if (inputItem.type === 'radio' && inputItem.value === savedValue) {
        inputItem.checked = true;
      }
    });
    controlsMaxValueRefs.forEach((controlItem) => {
      controlItem.value = controlMaxValues[controlItem.dataset.for];
    });
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
