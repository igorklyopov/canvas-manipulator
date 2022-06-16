// ====== Get shape controls ======>
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
  const controlValueRefs = canvasContainerRef.querySelectorAll('[data-value]');

  // canvas
  const canvasRef = document.getElementById(containerClassName);
  const ctx = canvasRef.getContext('2d');
  //------------

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
    lineWidth: 100,
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
    lineCap: 'butt',
    strokeStyle: '#000000',
    lineWidth: 2,
    fill: true,
    fillStyle: '#ffffff',
  };

  const controlMaxValues = savedControlMaxValues ?? initialControlMaxValues;
  const shapeParams = savedShapeParams ?? initialShapeParams;

  controlsShapeRef.addEventListener('change', (e) => {
    if (e.target.type === 'range') {
      renderControlsValues(e.target);
    }

    if (e.target.dataset.type === 'max-value') {
      setControlMaxValues(e);
    } else {
      setShapeParams(e);
    }

    if (e.target.type === 'color') {
      for (const inputItem of controlsInputRefs) {
        if (inputItem.name === e.target.name && inputItem.type === 'text') {
          inputItem.value = e.target.value;
        }
      }
    }

    clearCanvas();
    drawEllipse();
  });

  controlsShapeRef.addEventListener('mousewheel', (e) => {
    if (e.target.type !== 'range') {
      return;
    }

    e.preventDefault();

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
    renderControlsValues(e.target);

    clearCanvas();
    drawEllipse();
  });

  controlsCanvasRef.addEventListener('change', (e) => {
    switch (e.target.name) {
      case 'canvas-width':
        canvasRef.width = e.target.value;
        break;

      case 'canvas-height':
        canvasRef.height = e.target.value;
        break;

      default:
        break;
    }

    const canvasParams = {
      width: canvasRef.width,
      height: canvasRef.height,
    };

    localStorage.setItem('canvasParams', JSON.stringify(canvasParams));

    drawEllipse();
  });

  initCanvasParams();
  initControlsValues();
  initControlsMaxValues();
  drawEllipse();

  // functions
  function clearCanvas() {
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
  }

  function drawEllipse() {
    ctx.fillStyle = shapeParams.fillStyle;
    ctx.lineWidth = shapeParams.lineWidth;
    ctx.strokeStyle = shapeParams.strokeStyle;
    ctx.lineCap = shapeParams.lineCap;
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
    if (shapeParams.lineWidth > 0) ctx.stroke();
    if (shapeParams.fill) ctx.fill();
    ctx.closePath();
  }

  function setShapeParams(e) {
    // set params
    shapeParams[e.target.name] =
      e.target.type === 'range' ? Number(e.target.value) : e.target.value;

    if (e.target.dataset.type === 'angle') {
      shapeParams[e.target.name] = convertGradToRadian(e.target.value);
    }

    if (e.target.type === 'radio' && e.target.dataset.type === 'boolean') {
      shapeParams[e.target.name] = e.target.value === 'true';
    }

    if (e.target.type === 'checkbox' && e.target.dataset.type === 'boolean') {
      shapeParams[e.target.name] = e.target.checked;
    }
    // ------------

    // save params
    localStorage.setItem('shapeParams', JSON.stringify(shapeParams));
    // ------------
  }

  function renderControlsValues(inputRef) {
    for (const valueItem of controlValueRefs) {
      if (valueItem.dataset.value === inputRef.name) {
        valueItem.innerText = inputRef.value;
        return;
      }
    }
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
    if (!savedShapeParams) return;

    controlsInputRefs.forEach((inputItem) => {
      const savedValue = savedShapeParams[inputItem.name];

      switch (inputItem.type) {
        case 'range':
          inputItem.value =
            inputItem.dataset.type === 'angle'
              ? convertRadianToGrad(savedValue)
              : savedValue;

          inputItem.max = controlMaxValues[inputItem.name];

          renderControlsValues(inputItem);
          break;

        case 'radio':
          const radioInputValue =
            typeof savedValue === 'boolean' ? String(savedValue) : savedValue;

          inputItem.checked = inputItem.value === radioInputValue;
          break;

        case 'checkbox':
          if (typeof savedValue === 'boolean') inputItem.checked = savedValue;
          break;

        default:
          inputItem.value = savedValue;
          break;
      }
    });
  }

  function initControlsMaxValues() {
    controlsMaxValueRefs.forEach((controlItem) => {
      controlItem.value = controlMaxValues[controlItem.dataset.for];
    });
  }

  function initCanvasParams() {
    const savedCanvasParams = JSON.parse(localStorage.getItem('canvasParams'));

    if (!savedCanvasParams) return;

    canvasRef.width = savedCanvasParams.width;
    canvasRef.height = savedCanvasParams.height;

    const canvasControlsInputRefs = canvasContainerRef.querySelectorAll(
      '[data-name="canvas-control-input"]'
    );

    for (const inputItem of canvasControlsInputRefs) {
      switch (inputItem.name) {
        case 'canvas-width':
          inputItem.value = savedCanvasParams.width;
          break;

        case 'canvas-height':
          inputItem.value = savedCanvasParams.height;
          break;

        default:
          break;
      }
    }
  }

  // console.log('ctx', ctx);
}

// utils
function convertGradToRadian(deg) {
  return Number(((deg / 180) * Math.PI).toFixed(4));
}

function convertRadianToGrad(rad) {
  return Number(((rad * 180) / Math.PI).toFixed());
}
// ------------
// <===== END Get shape controls ======

// ====== Get layers ======>
(() => {
  const layerHeaderRef = document.getElementById('layer-header');
  const selectLayerRef = document.getElementById('select-layer');
  const appContainerRef = document.getElementById('layers-container');
  const layersRefs = document.getElementsByClassName('js-layer');

  let layerNumber = 0;

  layerHeaderRef.addEventListener('click', (e) => {
    switch (e.target.dataset.function) {
      case 'add-layer':
        renderLayer();
        showSelectLayers();
        break;

      case 'delete-layer':
        deleteLayer();
        break;

      default:
        break;
    }
  });

  selectLayerRef.addEventListener('change', selectLayer);

  function renderLayer() {
    layerNumber += 1;

    const layerMarkup = `
        <div class="canvas-wrap">
          <ul class="list canvas-controls js-controls-canvas">
            <li>
              <label class="canvas-control">
                <span class="controls-name">width</span>
                <input type="number" name="canvas-width" value="300" data-name="canvas-control-input"/>
              </label>
            </li>
            <li>
              <label class="canvas-control">
                <span class="controls-name">height</span>
                <input type="number" name="canvas-height" value="150" data-name="canvas-control-input"/>
              </label>
            </li>
          </ul>
          <canvas id="ellipse-${layerNumber}" class="canvas"></canvas>
        </div>
        <ul class="list controls-list js-controls-shape">
          <li class="controls-item">
            <input
              type="number"
              name="cx-max-value"
              value="300"
              class="max-value"
              data-type="max-value"
              data-for="cx"
            />
            <label>
              <span class="control-name">cx</span>
              <input
                type="range"
                min="0"
                max="300"
                step="1"
                name="cx"
                class="control-input js-control-input"
              />
            </label>
            <span class="control-value" data-value="cx">0</span>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="cy-max-value"
              value="150"
              class="max-value"
              data-type="max-value"
              data-for="cy"
            />
            <label>
              <span class="control-name">cy</span>
              <input
                type="range"
                min="0"
                max="150"
                step="1"
                name="cy"
                class="control-input js-control-input"
              />
            </label>
            <span class="control-value" data-value="cy">0</span>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="radiusX-max-value"
              value="100"
              class="max-value"
              data-type="max-value"
              data-for="radiusX"
            />
            <label>
              <span class="control-name">radiusX</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                name="radiusX"
                class="control-input js-control-input"
              />
            </label>
            <span class="control-value" data-value="radiusX">0</span>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="radiusY-max-value"
              value="100"
              class="max-value"
              data-type="max-value"
              data-for="radiusY"
            />
            <label>
              <span class="control-name">radiusY</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                name="radiusY"
                class="control-input js-control-input"
              />
            </label>
            <span class="control-value" data-value="radiusY">0</span>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="rotation-max-value"
              value="360"
              class="max-value"
              data-type="max-value"
              data-for="rotation"
            />
            <label>
              <span class="control-name">rotation</span>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                name="rotation"
                class="control-input js-control-input"
                data-type="angle"
              />
            </label>
            <span class="control-value" data-value="rotation">0</span>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="startAngle-max-value"
              value="360"
              class="max-value"
              data-type="max-value"
              data-for="startAngle"
            />
            <label>
              <span class="control-name">startAngle</span>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                name="startAngle"
                class="control-input js-control-input"
                data-type="angle"
              />
            </label>
            <span class="control-value" data-value="startAngle">0</span>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="endAngle-max-value"
              value="360"
              class="max-value"
              data-type="max-value"
              data-for="endAngle"
            />
            <label>
              <span class="control-name">endAngle</span>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                name="endAngle"
                class="control-input js-control-input"
                data-type="angle"
              />
            </label>
            <span class="control-value" data-value="endAngle">0</span>
          </li>
          <li class="controls-item">
            <div class="">
              <span class="control-name">counterclockwise</span>

              <label>
                <span class="">true</span>
                <input
                  type="radio"
                  name="counterclockwise"
                  value="true"
                  data-type="boolean"
                  class="control-input js-control-input"
                />
              </label>
              <label>
                <span class="">false</span>
                <input
                  type="radio"
                  name="counterclockwise"
                  value="false"
                  data-type="boolean"
                  class="control-input js-control-input"
                />
              </label>
              <li class="controls-item">
            <div class="">
              <span class="control-name">lineCap</span>

              <label>
                <span class="">butt</span>
                <input
                  type="radio"
                  name="lineCap"
                  value="butt"
                  checked
                  class="control-input js-control-input"
                />
              </label>
              <label>
                <span class="">round</span>
                <input
                  type="radio"
                  name="lineCap"
                  value="round"
                  class="control-input js-control-input"
                />
              </label>
              <label>
                <span class="">square</span>
                <input
                  type="radio"
                  name="lineCap"
                  value="square"
                  class="control-input js-control-input"
                />
              </label>
            </div>
          </li>
          <li class="controls-item">
            <span class="control-name">strokeStyle</span>
            <label>
              <input type="color" name="strokeStyle" class="control-input js-control-input" title="Choose stroke color" />
              </label>
              <label>
              <input type="text" name="strokeStyle" class="control-input js-control-input" title="Input stroke color" />
              </label>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="lineWidth-max-value"
              value="360"
              class="max-value"
              data-type="max-value"
              data-for="lineWidth"
            />
            <label>
              <span class="control-name">lineWidth</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                name="lineWidth"
                class="control-input js-control-input"
              />
            </label>
            <span class="control-value" data-value="lineWidth">0</span>
          </li>
          <li class="controls-item">
            <span class="control-name">fillStyle</span>
            <label>
             <span class="control-name">fill</span>
              <input type="checkbox" name="fill" class="control-input js-control-input" data-type="boolean" >
            </label>
            <label>
              <input type="color" name="fillStyle" class="control-input js-control-input" title="Choose fill color" />
              </label>
              <label>
              <input type="text" name="fillStyle" class="control-input js-control-input" title="Input fill color" />
              </label>
          </li>
        </ul>
    `;

    const canvasContainer = `
      <div class="canvas-ellipse ellipse-${layerNumber} js-layer" style="z-index: ${layerNumber}" data-layer="${layerNumber}" >
    `;
    appContainerRef.insertAdjacentHTML('beforeend', canvasContainer);

    const canvasContainerRef = document.querySelector(
      `.ellipse-${layerNumber}`
    );
    canvasContainerRef.insertAdjacentHTML('beforeend', layerMarkup);

    getCanvasEllipseControls(`ellipse-${layerNumber}`);
  }

  function showSelectLayers() {
    const selectLayerOption = `
      <option value="${layerNumber}" selected id="${layerNumber}" class="js-select-layer-option">Layer ${layerNumber}</option>
    `;

    selectLayerRef.insertAdjacentHTML('afterbegin', selectLayerOption);

    if (selectLayerRef.classList.contains('is-hidden')) {
      selectLayerRef.classList.remove('is-hidden');
    }
  }

  function selectLayer(e) {
    for (const layerItem of layersRefs) {
      layerItem.dataset.layer === e.target.value
        ? (layerItem.style.zIndex = layerNumber + 1)
        : (layerItem.style.zIndex = layerItem.dataset.layer);
    }
  }

  function deleteLayer() {
    const selectLayerOptionsRefs = selectLayerRef.getElementsByClassName(
      'js-select-layer-option'
    );

    let currentLayerNumber = 0;

    for (const selectLayerOption of selectLayerOptionsRefs) {
      if (selectLayerOption.selected) {
        currentLayerNumber = selectLayerOption.value;
        selectLayerOption.remove();
      }
    }

    for (const layerItem of layersRefs) {
      if (layerItem.dataset.layer === currentLayerNumber) {
        layerItem.remove();
      }
    }
  }
})();
// <===== END Get layers ======

// ====== ======>
//
// <====== ======

// ====== ======>
//
// <====== ======

// ====== ======>
//
// <====== ======
