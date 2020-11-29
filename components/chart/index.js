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
      { y: 40.67999999999999, x: 0 },
      { y: 40.69, x: 1 },
      { y: 40.71, x: 2 },
      { y: 40.660000000000004, x: 3 },
      { y: 40.67, x: 4 },
      { y: 40.67999999999999, x: 5 },
      { y: 40.699999999999996, x: 6 },
      { y: 40.72, x: 7 },
      { y: 40.699999999999996, x: 8 },
      { y: 40.74, x: 9 },
      { y: 40.71, x: 10 },
      { y: 40.74999999999999, x: 11 },
      { y: 40.74999999999999, x: 12 },
      { y: 40.699999999999996, x: 13 },
      { y: 40.71, x: 14 },
      { y: 40.69, x: 15 },
      { y: 40.78, x: 16 },
      { y: 40.97, x: 17 },
      { y: 40.96, x: 18 },
      { y: 41.01, x: 19 },
      { y: 41.1, x: 20 },
      { y: 41.120000000000005, x: 21 },
      { y: 41.18, x: 22 },
      { y: 41.04, x: 23 },
      { y: 41.089999999999996, x: 24 },
      { y: 40.96, x: 25 },
      { y: 40.940000000000005, x: 26 },
      { y: 40.879999999999995, x: 27 },
      { y: 40.81, x: 28 },
      { y: 40.83, x: 29 },
      { y: 40.89, x: 30 },
      { y: 40.870000000000005, x: 31 },
      { y: 40.82, x: 32 },
      { y: 40.800000000000004, x: 33 },
      { y: 40.67999999999999, x: 34 },
      { y: 40.74, x: 35 },
      { y: 40.72, x: 36 },
      { y: 40.699999999999996, x: 37 },
      { y: 40.69, x: 38 },
      { y: 40.67999999999999, x: 39 },
      { y: 40.65, x: 40 },
      { y: 40.660000000000004, x: 41 },
      { y: 40.69, x: 42 },
      { y: 40.71, x: 43 },
      { y: 40.72, x: 44 },
      { y: 40.69, x: 45 },
      { y: 40.699999999999996, x: 46 },
      { y: 40.699999999999996, x: 47 },
      { y: 40.699999999999996, x: 48 },
      { y: 40.65, x: 49 },
      { y: 40.65, x: 50 },
      { y: 40.69, x: 51 },
      { y: 40.660000000000004, x: 52 },
      { y: 40.67, x: 53 },
      { y: 40.660000000000004, x: 54 },
      { y: 40.67, x: 55 },
      { y: 40.69, x: 56 },
      { y: 40.699999999999996, x: 57 },
      { y: 40.67, x: 58 },
      { y: 40.67, x: 59 },
      { y: 40.62, x: 60 },
      { y: 40.64, x: 61 },
      { y: 40.55, x: 62 },
      { y: 40.52, x: 63 },
      { y: 40.55, x: 64 },
      { y: 40.55, x: 65 },
      { y: 40.470000000000006, x: 66 },
      { y: 40.45, x: 67 },
      { y: 40.51, x: 68 },
      { y: 40.53, x: 69 },
      { y: 40.57, x: 70 },
      { y: 40.62, x: 71 },
      { y: 40.59, x: 72 },
      { y: 40.55, x: 73 },
      { y: 40.55, x: 74 },
      { y: 40.55, x: 75 },
      { y: 40.57, x: 76 },
      { y: 40.59, x: 77 },
      { y: 40.52, x: 78 },
      { y: 40.540000000000006, x: 79 },
      { y: 40.57, x: 80 },
      { y: 40.53, x: 81 },
      { y: 40.52, x: 82 },
      { y: 40.52, x: 83 },
      { y: 40.51, x: 84 },
      { y: 40.51, x: 85 },
      { y: 40.489999999999995, x: 86 },
      { y: 40.470000000000006, x: 87 },
      { y: 40.489999999999995, x: 88 },
      { y: 40.5, x: 89 },
      { y: 40.53, x: 90 },
      { y: 40.57, x: 91 },
      { y: 40.629999999999995, x: 92 },
      { y: 40.629999999999995, x: 93 },
      { y: 40.64, x: 94 },
      { y: 40.59, x: 95 },
      { y: 40.58, x: 96 },
      { y: 40.59, x: 97 },
      { y: 40.55, x: 98 },
      { y: 40.53, x: 99 },
    ]);

    const chartTypeState = nanostate("polyline", {
      polyline: { point: "point" },
      point: { polyline: "polyline" },
    });
    this.fsm = chartTypeState;
  }

  createElement({ state, emit }) {
    return html`<div class="polyline">
      <h2>Chart</h2>
      ${this.chart.render({ type: this.fsm.state })}
    </div>`;
  }

  set(data) {
    this.chart.set("data", data);
  }

  zoom({ direction }) {
    switch (direction) {
      case "in":
        this.chart.zoomIn();
        this.chart.scaleData();
        this.rerender();
        break;
      case "out":
        this.chart.zoomOut();
        this.chart.scaleData();
        this.rerender();

        break;
      default:
        break;
    }
  }

  wheel(e) {
    console.log("DELTAY:", e.deltaY);
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

  update() {
    return true;
  }
}

module.exports = exports = Component;
