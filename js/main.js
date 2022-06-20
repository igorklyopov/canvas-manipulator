// ====== Layers data ======>

const savedLayersData = getLayersData();
const LAYER_ITEM_DATA = {};
const testLayerData = [
  {
    id: 'ellipse-1',
    type: 'ellipse',
    shapeParams: {
      cx: 112,
      cy: 73,
      radiusX: 38,
      radiusY: 42,
      rotation: 0,
      startAngle: 3.159,
      endAngle: 0,
      counterclockwise: true,
      lineCap: 'butt',
      strokeStyle: '#000000',
      lineWidth: 18,
      fill: false,
      fillStyle: '#000000',
    },
  },
];
/*{
  id: 0,
  type: 'ellipse',
  canvasParams: { width: 300, height: 150 },
  shapeParams: {
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
  },
  controlMaxValues: {
    cx: 0,
    cy: 0,
    radiusX: 100,
    radiusY: 100,
    rotation: 360,
    startAngle: 360,
    endAngle: 360,
    lineWidth: 100,
  
}};*/
const LAYERS_DATA = [];
let CURRENT_LAYER_ID = null;

function getLayersData() {
  return JSON.parse(localStorage.getItem('layers'));
}

function saveLayersData() {
  localStorage.setItem('layers', JSON.stringify(LAYERS_DATA));
}
// <====== ======

// ====== Get shape controls ======>
//
// <===== END Get shape controls ======

// ====== Get layers ======>
(() => {
  const layerHeaderRef = document.getElementById('layer-header');
  const selectLayerRef = document.getElementById('select-layer');
  const selectShapeRef = document.getElementById('select-shape');
  const layersContainerRef = document.getElementById('layers_container');
  const layersRefs = document.getElementsByClassName('js-layer');

  let LAYER_NUMBER = LAYERS_DATA.length + 1;

  if (savedLayersData && savedLayersData.length > 0) {
    console.log('savedLayersData', savedLayersData);
    renderLayer(savedLayersData);
    renderSelectLayerOptions(savedLayersData);
  }

  layerHeaderRef.addEventListener('click', onHeaderBtnClick);

  layerHeaderRef.addEventListener('change', onHeaderInputChange);

  function onHeaderBtnClick(e) {
    switch (e.target.dataset.function) {
      case 'add-layer':
        // renderLayer(selectShapeRef.value);

        addLayer(selectShapeRef.value);
        break;

      case 'copy-layer':
        // copyLayer()
        break;

      case 'delete-layer':
        deleteLayer();
        break;

      default:
        break;
    }
  }

  function onHeaderInputChange(e) {
    switch (e.target.dataset.function) {
      case 'select-shape':
        // renderLayer(e.target.value);
        addLayer(e.target.value);
        break;

      case 'select-layer':
        // showSelectLayers();
        break;

      default:
        break;
    }
  }

  selectLayerRef.addEventListener('change', selectLayer);
  // selectShapeRef.addEventListener('change', addLayer);

  const ellipseCtrlParamsDefault = {
    cx: { value: 0, maxValue: 100 },
    cy: { value: 0, maxValue: 100 },
    radiusX: { value: 0, maxValue: 100 },
    radiusY: { value: 0, maxValue: 100 },
    rotation: { value: 0, maxValue: 360 }, //6.2832
    startAngle: { value: 0, maxValue: 360 },
    endAngle: { value: 0, maxValue: 360 },
    counterclockwise: { value: true },
    lineCap: { value: 'butt' },
    strokeStyle: { value: '#000000' },
    lineWidth: { value: 2, maxValue: 100 },
    fill: { value: true },
    fillStyle: { value: '#ffffff' },
  };

  function addLayer(shapeType) {
    // if (LAYERS_DATA.length > 0) saveLayersData();

    LAYER_NUMBER += 1;

    const layerId = `${shapeType}-${LAYER_NUMBER}`;

    CURRENT_LAYER_ID = layerId;

    const layerData = {};

    layerData.id = layerId;
    layerData.type = shapeType;
    // layerData.shapeParams = shapeParamsDefault[shapeType];
    LAYERS_DATA.unshift(layerData);
    renderLayer(LAYERS_DATA.slice(0, 1));
    renderSelectLayerOptions(LAYERS_DATA.slice(0, 1));
  }

  function renderLayer(data) {
    const layersMarkup = data.map((layerItem) => {
      const layerItemEl = document.createElement('li');
      layerItemEl.setAttribute('id', layerItem.id);
      layerItemEl.setAttribute('data-shape', layerItem.type);
      const layerItemElClassNames = ['layers_item', 'js-layer'];
      layerItemEl.className = layerItemElClassNames.join(' ');

      const canvasFieldMarkup = `
        <div class="canvas_wrap">
          <ul class="canvas_controls_list js_controls_canvas">
            <li>
              <label class="canvas-control">
                <span class="controls-name">width</span>
                <input
                  type="number"
                  value="300"
                  name="canvas-width"
                  data-name="canvas-control-input"
                />
              </label>
            </li>
            <li>
              <label class="canvas-control">
                <span class="controls-name">height</span>
                <input
                  type="number"
                  value="150"
                  name="canvas-height"
                  data-name="canvas-control-input"
                />
              </label>
            </li>
          </ul>
          <canvas class="canvas js-canvas"></canvas>
        </div>
    `;

      layerItemEl.insertAdjacentHTML('afterbegin', canvasFieldMarkup);
      layerItemEl.insertAdjacentHTML(
        'beforeend',
        controlsMarkup[layerItem.type]
      );

      // controlLayer(layerItem);

      return layerItemEl;
    });

    layersContainerRef.append(...layersMarkup);

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
  }

  function controlLayer(layerData) {
    // refs
    const layerRef = document.getElementById(layerData.id);
    const controlsShapeRef = layerRef.querySelector('.js_controls_shape');
    const controlsCanvasRef = layerRef.querySelector('.js_controls_canvas');
    const controlsInputRefs = layerRef.querySelectorAll('.js_control_input');
    const controlsMaxValueRefs = layerRef.querySelectorAll(
      '[data-type="max-value"]'
    );
    const controlValueRefs = layerRef.querySelectorAll('[data-value]');

    // canvas
    const canvasRef = layerRef.querySelector('.js-canvas');
    const canvasContext = canvasRef.getContext('2d');
    //------------

    const shapeType = layerRef.dataset.shape;

    const ellipseShapeParamsDefault = {
      cx: 100,
      cy: 100,
      radiusX: 50,
      radiusY: 50,
      rotation: 0,
      startAngle: 2,
      endAngle: 0,
      counterclockwise: true,
      lineCap: 'butt',
      strokeStyle: '#000000',
      lineWidth: 2,
      fill: true,
      fillStyle: 'green',
    };

    // drawShape(canvasContext, shapeType, ellipseShapeParamsDefault);
    ////////////////////////////////

    // get saved params

    const savedControlMaxValues = null; //for test
    // const savedShapeParams = null; //for test
    const savedShapeParams = layerData.shapeParams;
    console.log('savedShapeParams', savedShapeParams);
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
      lineWidth: 0,
      fill: false,
      fillStyle: '#000000',
    };

    const controlMaxValues = savedControlMaxValues ?? initialControlMaxValues;
    const shapeParams = savedShapeParams ?? initialShapeParams;

    controlsShapeRef.addEventListener('change', onShapeCtrlChange);
    controlsShapeRef.addEventListener('mousewheel', onShapeCtrlScroll);
    controlsCanvasRef.addEventListener('change', onCanvasCtrlChange);

    // initCanvasParams();
    // initControlsValues();
    // initControlsMaxValues();
    renderShape(shapeParams);

    // functions

    function renderShape(shapeParams) {
      return drawShape(canvasContext, shapeType, shapeParams);
    }

    function onShapeCtrlChange(e) {
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
      renderShape(shapeParams);
    }

    function onShapeCtrlScroll(e) {
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
      renderShape(shapeParams);
    }

    function onCanvasCtrlChange(e) {
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

      renderShape(shapeParams);
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

      writeParamsToLayerData('shapeParams', shapeParams);
      saveLayersData();
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

      localStorage.setItem(
        'controlMaxValues',
        JSON.stringify(controlMaxValues)
      );
    }

    function initControlsMaxValues() {
      controlsMaxValueRefs.forEach((controlItem) => {
        controlItem.value = controlMaxValues[controlItem.dataset.for];
      });
    }

    function initCanvasParams() {
      const savedCanvasParams = JSON.parse(
        localStorage.getItem('canvasParams')
      );

      if (!savedCanvasParams) return;

      canvasRef.width = savedCanvasParams.width;
      canvasRef.height = savedCanvasParams.height;

      const canvasControlsInputRefs = layerRef.querySelectorAll(
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

    function clearCanvas() {
      canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
    }
  }

  function renderSelectLayerOptions(layersData) {
    const selectLayerOptionsMarkup = layersData.map((item) => {
      return `
        <option value="${item.id}" class="js-select-layer-option" selected>${item.id}</option>
      `;
    });

    selectLayerRef.insertAdjacentHTML('afterbegin', selectLayerOptionsMarkup);

    selectLayerRef.classList.remove('is-hidden');
  }

  // utils
  function writeParamsToLayerData(paramsName, paramsData) {
    for (const layerItem of LAYERS_DATA) {
      if (layerItem.id === CURRENT_LAYER_ID) {
        layerItem[paramsName] = paramsData;
      }
    }
  }

  function selectLayer(e) {
    Array.from(layersRefs).forEach((layerItem, index) => {
      layerItem.id === e.target.value
        ? (layerItem.style.zIndex = LAYERS_DATA.length + 1)
        : (layerItem.style.zIndex = index);
    });

    CURRENT_LAYER_ID = e.target.value;
  }

  function deleteLayer() {
    const selectLayerOptionsRefs = selectLayerRef.getElementsByClassName(
      'js-select-layer-option'
    );

    for (const selectLayerOption of selectLayerOptionsRefs) {
      if (selectLayerOption.selected) {
        CURRENT_LAYER_ID = selectLayerOption.value;
        selectLayerOption.remove();
      }
    }

    for (const layerItem of layersRefs) {
      if (layerItem.id === CURRENT_LAYER_ID) {
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
