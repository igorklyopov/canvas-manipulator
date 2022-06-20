const controlsMarkup = {
  ellipse: `
    <ul class="shape_controls_list js_controls_shape">
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
                value="0"
                min="0"
                max="300"
                step="1"
                name="cx"
                class="control-input js_control_input"
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
                value="0"
                min="0"
                max="150"
                step="1"
                name="cy"
                class="control-input js_control_input"
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
                value="0"
                min="0"
                max="100"
                step="1"
                name="radiusX"
                class="control-input js_control_input"
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
                value="0"
                min="0"
                max="100"
                step="1"
                name="radiusY"
                class="control-input js_control_input"
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
                value="0"
                min="0"
                max="360"
                step="1"
                name="rotation"
                class="control-input js_control_input"
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
                value="0"
                min="0"
                max="360"
                step="1"
                name="startAngle"
                class="control-input js_control_input"
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
                value="0"
                min="0"
                max="360"
                step="1"
                name="endAngle"
                class="control-input js_control_input"
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
                  checked
                  data-type="boolean"
                  class="control-input js_control_input"
                />
              </label>
              <label>
                <span class="">false</span>
                <input
                  type="radio"
                  name="counterclockwise"
                  value="false"
                  data-type="boolean"
                  class="control-input js_control_input"
                />
              </label>
            </div>
          </li>
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
                  class="control-input js_control_input"
                />
              </label>
              <label>
                <span class="">round</span>
                <input
                  type="radio"
                  name="lineCap"
                  value="round"
                  class="control-input js_control_input"
                />
              </label>
              <label>
                <span class="">square</span>
                <input
                  type="radio"
                  name="lineCap"
                  value="square"
                  class="control-input js_control_input"
                />
              </label>
            </div>
          </li>
          <li class="controls-item">
            <span class="control-name">strokeStyle</span>
            <label>
              <input
                type="color"
                name="strokeStyle"
                class="control-input js_control_input"
                title="Choose stroke color"
              />
            </label>
            <label>
              <input
                type="text"
                name="strokeStyle"
                class="control-input js_control_input"
                title="Input stroke color"
              />
            </label>
          </li>
          <li class="controls-item">
            <input
              type="number"
              name="lineWidth-max-value"
              value="100"
              class="max-value"
              data-type="max-value"
              data-for="lineWidth"
            />
            <label>
              <span class="control-name">lineWidth</span>
              <input
                type="range"
                value="0"
                min="0"
                max="100"
                step="1"
                name="lineWidth"
                class="control-input js_control_input"
              />
            </label>
            <span class="control-value" data-value="lineWidth">0</span>
          </li>
          <li class="controls-item">
            <span class="control-name">fillStyle</span>
            <label>
              <span class="control-name">fill</span>
              <input
                type="checkbox"
                name="fill"
                class="control-input js_control_input"
                data-type="boolean"
              />
            </label>
            <label>
              <input
                type="color"
                name="fillStyle"
                class="control-input js_control_input"
                title="Choose fill color"
              />
            </label>
            <label>
              <input
                type="text"
                name="fillStyle"
                class="control-input js_control_input"
                title="Input fill color"
              />
            </label>
          </li>
        </ul>
  `,
  rectangle: `<h2 class="shape_controls_list">I'm rectangle !</h2>`,
  line: `<h2 class="shape_controls_list">I'm line number !</h2>`,
};
