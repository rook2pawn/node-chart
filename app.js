const choo = require("choo");
const html = require("nanohtml");
const devtools = require("choo-devtools");
const nanostate = require("nanostate");
const FSMRender = require("./fsmRender");
const FSMControls = require("./fsmControls");
const Chart = require("./components/chart");

const css = require("sheetify");
css("./app.css");

module.exports = () => {
  const app = choo();

  const chart = new Chart();
  const fsm_chart = new FSMRender(chart);
  const controls_chart = new FSMControls(chart);

  function mainView(state, emit) {
    if (state.logger) {
      console.log("mainView:state", state);
    }
    return html`<body>
      <div style="display:flex; flex-direction:row;">
        <div class="column">
          <h1>FSM Component</h1>
          ${chart.render({ state, emit })} ${fsm_chart.render({ state, emit })}
          ${controls_chart.render({ state, emit })}
        </div>
      </div>
    </body>`;
  }
  app.use(devtools());
  app.use((state) => {
    state.logger = false;
  });
  app.use((state, emitter) => {});
  app.route("/", mainView);
  app.mount("body");
};
