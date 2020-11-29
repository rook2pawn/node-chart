const choo = require("choo");
const html = require("nanohtml");
const devtools = require("choo-devtools");
const nanostate = require("nanostate");

const FSMRender = require("./fsmRender");
const FSMControls = require("./fsmControls");
const DataSourceComponent = require("./components/dataSource");

const Chart = require("./components/chart");

const css = require("sheetify");
css("./app.css");

module.exports = () => {
  const app = choo();

  const chart = new Chart();
  const fsm_chart = new FSMRender(chart);
  const controls_chart = new FSMControls(chart);

  const binanceComponent = new DataSourceComponent({
    title: "binance ltcbtc stream",
    type: "binance",
  });
  const fsm_binance = new FSMRender(binanceComponent);
  const controls_binance = new FSMControls(binanceComponent);

  const randomComponent = new DataSourceComponent({
    title: "random stream",
    type: "random",
  });
  const fsm_random = new FSMRender(randomComponent);
  const controls_random = new FSMControls(randomComponent);

  function mainView(state, emit) {
    if (state.logger) {
      console.log("mainView:state", state);
    }
    return html`<body>
      <div style="display:flex; flex-direction:row;">
        <div>
          ${chart.render({ state, emit })} ${fsm_chart.render({ state, emit })}
          ${controls_chart.render({ state, emit })}
        </div>
        <div style="display:flex; flex-direction:column">
          <div>
            ${binanceComponent.render({ state, emit })}
            ${fsm_binance.render({ state, emit })}
            ${controls_binance.render({ state, emit })}
          </div>
          <div>
            ${randomComponent.render({ state, emit })}
            ${fsm_random.render({ state, emit })}
            ${controls_random.render({ state, emit })}
          </div>
        </div>
      </div>
    </body>`;
  }
  app.use(devtools());
  app.use((state) => {
    state.logger = false;
  });
  app.use((state, emitter) => {
    emitter.on("random", ({ value }) => {
      chart.update({ type: "random", value });
    });
    emitter.on("binance", ({ value }) => {
      chart.update({ type: "binance", value });
    });
  });

  app.route("/", mainView);
  app.mount("body");
};
