const Nanocomponent = require("nanocomponent");
const html = require("choo/html");
const css = require("sheetify");
const nanostate = require("nanostate");
const Chart = require("../../chart.js");

css("./component.css");

class Component extends Nanocomponent {
  constructor() {
    super();
    this._loadedResolve;
    this.loaded = new Promise((resolve, reject) => {
      this._loadedResolve = resolve;
    });
    this.chart = new Chart();
    this.chart.set("data", [
      { x: 0, y: 5 },
      { x: 1, y: 10 },
      { x: 2, y: 2 },
      { x: 3, y: 0 },
      { x: 4, y: 2 },
      { x: 5, y: 3 },
      { x: 6, y: 13 },
      { x: 7, y: 24 },
      { x: 8, y: 48 },
      { x: 9, y: 35 },
      { x: 10, y: 27 },
    ]);

    const chartTypeState = nanostate("polyline", {
      polyline: { point: "point", polylinepoint: "polylinepoint" },
      polylinepoint: { polyline: "polyline", point: "point" },
      point: { polyline: "polyline", polylinepoint: "polylinepoint" },
    });
    const chartDataSourceState = nanostate("random", {
      random: { binance: "binance" },
      binance: { random: "random" },
    });
    this.fsm = nanostate.parallel({
      chartType: chartTypeState,
      chartData: chartDataSourceState,
    });
  }

  createElement({ state, emit }) {
    console.log("Chart Component Render");
    return html`<div class="polyline">
      <h2>Chart</h2>
      ${this.chart.render({ type: this.fsm.transitions.chartType.state })}
      <div>
        <div>Chart Data Source</div>
        <div>${this.fsm.transitions.chartData.state}</div>
      </div>
    </div>`;
  }

  set(data) {
    this.chart.set("data", data);
  }

  addSingleData(val) {
    this.chart.addSingleYValueData(val);
    this.chart.setBoundaries();
    this.chart.scaleData();
  }
  addData(list) {
    this.chart.addData(list);
    this.chart.setBoundaries();
    this.chart.scaleData();
  }

  zoom({ direction }) {
    switch (direction) {
      case "in":
        this.chart
          .zoomIn()
          .then(() => {
            this.chart.scaleData();
            this.rerender();
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case "out":
        this.chart
          .zoomOut()
          .then(() => {
            this.chart.scaleData();
            this.rerender();
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      default:
        break;
    }
  }

  wheel(e) {
    let direction = "in";
    if (e.deltaY > 0) {
      direction = "out";
    } else {
      direction = "in";
    }
    this.zoom({ direction });
  }
  load(el) {
    this.el = el;
    this.el.onwheel = this.wheel.bind(this);
    this._loadedResolve();
  }

  update({ state, emit, type, value }) {
    if (type !== undefined) {
      //      console.log("UPDATE!:", type, value);
      if (type !== this.fsm.transitions.chartData.state) {
        return;
      }
      switch (type) {
        case "random":
          this.addSingleData(value);
          this.rerender();
          break;
        case "binance":
          this.addSingleData(value);
          this.rerender();
          break;
        default:
          break;
      }
    }
    return true;
  }
}

module.exports = exports = Component;
