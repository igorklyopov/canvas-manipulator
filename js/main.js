// ====== Layers data ======>
const savedLayersData = getLayersData();
let LAYERS_DATA = [];

function getLayersData() {
  return JSON.parse(localStorage.getItem('layers'));
}

function saveLayersData() {
  localStorage.setItem('layers', JSON.stringify(LAYERS_DATA));
}
// <====== END Layers data ======

// ====== Canvas params save/get ======>
function getCanvasParams() {
  return JSON.parse(localStorage.getItem('canvasParams'));
}

function saveCanvasParams(params) {
  localStorage.setItem('canvasParams', JSON.stringify(params));
}
// <====== END Canvas params ======

// ====== Get layers ======>
(() => {
  // refs
  const layerHeaderRef = document.getElementById('layer_header');
  const selectLayerRef = document.getElementById('select_layer');
  const selectShapeRef = document.getElementById('select_shape');
  const layersContainerRef = document.getElementById('layers_container');
  const layersRefs = document.getElementsByClassName('js_layer');
  const canvasControlsGlobalRef = document.querySelector('.js_controls_canvas');
  const canvasGlobalRef = document.getElementsByClassName('js_canvas');

  let LAYER_NUMBER =
    LAYERS_DATA.length === 0 ? LAYERS_DATA.length + 1 : LAYERS_DATA.length;

  if (savedLayersData && savedLayersData.length > 0) {
    LAYERS_DATA = savedLayersData;

    const maxLayerNumber = LAYERS_DATA.reduce((prevValue, layer) => {
      const layerNumber = Number(layer.name.replace(/[a-z]* /, ''));

      if (layerNumber > prevValue) {
        prevValue = layerNumber;
      }
      return prevValue;
    }, 0);

    LAYER_NUMBER = maxLayerNumber + 1;

    renderLayers(LAYERS_DATA);
    controlLayers(LAYERS_DATA);
    renderSelectLayerOptions(LAYERS_DATA);
  }

  // ------ Layers menu ------>
  layerHeaderRef.addEventListener('click', onHeaderBtnClick);
  layerHeaderRef.addEventListener('change', onHeaderInputChange);

  function onHeaderBtnClick(e) {
    switch (e.target.dataset.function) {
      case 'add-layer':
        addLayer(selectShapeRef.value);
        break;

      case 'copy-layer':
        // copyLayer()
        break;

      case 'delete-layer':
        deleteLayer(selectLayerRef.value);
        deleteSelectLayerOption(selectLayerRef.value);
        break;

      default:
        break;
    }
  }

  function onHeaderInputChange(e) {
    switch (e.target.dataset.function) {
      case 'select_shape':
        addLayer(e.target.value);
        break;

      case 'select_layer':
        selectLayer(e);
        break;

      default:
        break;
    }
  }

  function addLayer(shapeType) {
    const layerId = `${Date.now()}`;

    const layerData = {};

    layerData.id = layerId;
    layerData.name = `${shapeType} ${LAYER_NUMBER}`;
    layerData.type = shapeType;

    LAYERS_DATA.push(layerData);

    const newLayerData = LAYERS_DATA.slice(LAYERS_DATA.length - 1);
    renderLayers(newLayerData);
    renderSelectLayerOptions(newLayerData);
    controlLayers(newLayerData);

    LAYER_NUMBER += 1;
  }

  function selectLayer(e) {
    Array.from(layersRefs).forEach((layerItem, index) => {
      layerItem.id === e.target.value
        ? (layerItem.style.zIndex = LAYERS_DATA.length + 1)
        : (layerItem.style.zIndex = index);
    });
  }

  function deleteLayer(layerId) {
    for (const layerItem of layersRefs) {
      if (layerItem.id === layerId) {
        layerItem.remove();
      }
    }

    LAYERS_DATA = LAYERS_DATA.filter((layerItem) => layerItem.id !== layerId);
    saveLayersData();
  }

  function renderLayers(data) {
    const layersMarkup = data.map((layerItem) => {
      const layerItemEl = document.createElement('li');
      layerItemEl.setAttribute('id', layerItem.id);
      layerItemEl.setAttribute('data-shape', layerItem.type);
      const layerItemElClassNames = ['layers_item', 'js_layer'];
      layerItemEl.className = layerItemElClassNames.join(' ');

      const canvasFieldMarkup = `
        <div class="canvas_wrap">
          <canvas class="canvas js_canvas"></canvas>
        </div>
    `;

      layerItemEl.insertAdjacentHTML('afterbegin', canvasFieldMarkup);
      layerItemEl.insertAdjacentHTML(
        'beforeend',
        controlsMarkup[layerItem.type]
      );

      return layerItemEl;
    });

    layersContainerRef.append(...layersMarkup);
  }

  function renderSelectLayerOptions(layersData) {
    const selectLayerOptionsMarkup = layersData
      .map((item, index) => {
        const isLastIndex = index === layersData.length - 1;

        return `
        <option value="${item.id}" class="js_select_layer_option" ${
          isLastIndex ? 'selected' : ''
        }>${item.name}</option>
      `;
      })
      .reverse();

    selectLayerRef.insertAdjacentHTML('afterbegin', selectLayerOptionsMarkup);

    selectLayerRef.classList.remove('is-hidden');
  }

  function deleteSelectLayerOption(layerId) {
    const selectLayerOptionsRefs = selectLayerRef.getElementsByClassName(
      'js_select_layer_option'
    ); // or const selectLayerOptionsRefs = selectLayerRef.options

    for (const selectLayerOption of selectLayerOptionsRefs) {
      if (selectLayerOption.selected) {
        layerId = selectLayerOption.value;
        selectLayerOption.remove();
      }
    }

    if (selectLayerRef.children.length < 1) {
      selectLayerRef.classList.add('is-hidden');
    }
  }

  function writeParamsToLayerData(paramsName, paramsData) {
    const currentLayerId = selectLayerRef.value;

    for (const layerItem of LAYERS_DATA) {
      if (layerItem.id === currentLayerId) {
        layerItem[paramsName] = paramsData;
      }
    }
  }

  //------ Canvas controls ------>
  initCanvasParams();

  canvasControlsGlobalRef.addEventListener('input', onCanvasCtrlChange);

  function initCanvasParams() {
    const savedCanvasParams = getCanvasParams();

    if (!savedCanvasParams) return;

    const canvasControlsInputRefs = document.querySelectorAll(
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

    Array.from(canvasGlobalRef).forEach((canvasItem) => {
      canvasItem.width = savedCanvasParams.width;
      canvasItem.height = savedCanvasParams.height;
    });
  }

  function onCanvasCtrlChange(e) {
    Array.from(canvasGlobalRef).forEach((canvasItem) => {
      switch (e.target.name) {
        case 'canvas-width':
          canvasItem.width = e.target.value;
          break;

        case 'canvas-height':
          canvasItem.height = e.target.value;
          break;

        default:
          break;
      }
    });

    const canvasParams = {
      width: 300,
      height: 150,
    };

    const canvasParamName = e.target.name.replace('canvas-', '');

    canvasParams[canvasParamName] = Number(e.target.value);

    saveCanvasParams(canvasParams);
  }
  // <------ END Canvas controls ------

  // <------ END Layers menu ------

  function controlLayers(data) {
    data.forEach((layerItem) => {
      // refs
      const layerRef = document.getElementById(layerItem.id);
      const controlsShapeRef = layerRef.querySelector('.js_controls_shape');
      const controlsInputRefs = layerRef.querySelectorAll('.js_control_input');
      const controlsMaxValueRefs = layerRef.querySelectorAll(
        '[data-type="max-value"]'
      );
      const controlValueRefs = layerRef.querySelectorAll('[data-value]');

      // canvas
      const canvasRef = layerRef.querySelector('.js_canvas');
      const canvasContext = canvasRef.getContext('2d');
      //------------

      const shapeType = layerRef.dataset.shape;

      // get saved params
      const savedControlMaxValues = layerItem.controlMaxValues;
      const savedShapeParams = layerItem.shapeParams;
      // ------------

      let SHAPE_PARAMS = savedShapeParams
        ? { ...savedShapeParams }
        : {
            ...shapeParamsDefault[shapeType],
          };

      const CONTROL_MAX_VALUES = savedControlMaxValues
        ? { ...savedControlMaxValues }
        : { ...controlMaxValuesDefault[shapeType] };

      controlsShapeRef.addEventListener('change', onShapeCtrlChange);
      controlsShapeRef.addEventListener('mousewheel', onShapeCtrlScroll);

      //--- Render shape if canvas width or height will be changing --->
      let observer = new MutationObserver((mutationRecords) => {
        if (
          (mutationRecords[0].type === 'attributes' &&
            mutationRecords[0].attributeName === 'width') ||
          mutationRecords[0].attributeName === 'height'
        ) {
          renderShape(SHAPE_PARAMS);
        }
      });

      observer.observe(canvasRef, {
        attributes: true,
      });
      //<-----------------------------------------------------

      initControlsValues();
      initControlsMaxValues();
      renderShape(SHAPE_PARAMS);

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
        }

        if (e.target.type === 'color') {
          for (const inputItem of controlsInputRefs) {
            if (inputItem.name === e.target.name && inputItem.type === 'text') {
              inputItem.value = e.target.value;
            }
          }
        }

        setShapeParams(e);
        clearCanvas();
        renderShape(SHAPE_PARAMS);
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
        renderShape(SHAPE_PARAMS);
      }

      function setShapeParams(e) {
        // set params
        SHAPE_PARAMS[e.target.name] =
          e.target.type === 'range' ? Number(e.target.value) : e.target.value;

        if (e.target.dataset.type === 'angle') {
          SHAPE_PARAMS[e.target.name] = convertGradToRadian(e.target.value);
        }

        if (e.target.type === 'radio' && e.target.dataset.type === 'boolean') {
          SHAPE_PARAMS[e.target.name] = e.target.value === 'true';
        }

        if (
          e.target.type === 'checkbox' &&
          e.target.dataset.type === 'boolean'
        ) {
          SHAPE_PARAMS[e.target.name] = e.target.checked;
        }
        // ------------

        // save params
        writeParamsToLayerData('shapeParams', SHAPE_PARAMS);
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
            CONTROL_MAX_VALUES[controlItem.name] = Number(e.target.value);
          }
        });

        writeParamsToLayerData('controlMaxValues', CONTROL_MAX_VALUES);
        saveLayersData();
      }

      function initControlsMaxValues() {
        controlsMaxValueRefs.forEach((controlItem) => {
          controlItem.value = CONTROL_MAX_VALUES[controlItem.dataset.for];
        });
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

              inputItem.max = CONTROL_MAX_VALUES[inputItem.name];

              renderControlsValues(inputItem);
              break;

            case 'radio':
              const radioInputValue =
                typeof savedValue === 'boolean'
                  ? String(savedValue)
                  : savedValue;

              inputItem.checked = inputItem.value === radioInputValue;
              break;

            case 'checkbox':
              if (typeof savedValue === 'boolean')
                inputItem.checked = savedValue;
              break;

            default:
              inputItem.value = savedValue;
              break;
          }
        });
      }

      function clearCanvas() {
        canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
      }
    });
  }
})();
// <===== END Get layers ======

// ====== ======>
//
// <====== ======
