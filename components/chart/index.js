const Nanocomponent = require("nanocomponent");
const html = require("choo/html");
const css = require("sheetify");
const nanostate = require("nanostate");
const ChartSVG = require("../../chart.js");

css("./component.css");

class Component extends Nanocomponent {
  constructor() {
    super();
    this.emit;
    this._loadedResolve;
    this.loaded = new Promise((resolve, reject) => {
      this._loadedResolve = resolve;
    });
    this.scroll = {
      lock: false,
      distance: 0,
      prevX: 0,
    };
    this.chart = new ChartSVG();
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
    this.emit = emit;
    this.chartEl = this.chart.render({
      type: this.fsm.transitions.chartType.state,
      offset: this.scroll.distance,
    });
    console.log("createElement!!");
    return html`<div>
      <div
        class="chartWrapper"
        onwheel=${this.wheel.bind(this)}
        onmouseout=${this.scrollstop.bind(this)}
        onmousedown=${this.scrollstart.bind(this)}
        onmouseup=${this.scrollstop.bind(this)}
        onmousemove=${this.scrollmove.bind(this)}
      >
        ${this.chartEl}
      </div>
      <div>
        <div>Chart Data Source</div>
        <div>${this.fsm.transitions.chartData.state}</div>
      </div>
    </div>`;
  }
  unload() {
    console.log("No longer mounted on the DOM!");
  }
  set(data) {
    this.chart.set("data", data);
  }

  addSingleData(val) {
    this.chart.addSingleYValueData(val);
    this.chart.setBoundaries();
    this.chart.normalizeData();
  }
  addData(list) {
    this.chart.addData(list);
    this.chart.setBoundaries();
    this.chart.normalizeData();
  }

  zoom({ direction }) {
    switch (direction) {
      case "in":
        this.chart
          .zoomIn()
          .then(() => {
            this.chart.normalizeData();
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
            this.chart.normalizeData();
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
  scrollstart(e) {
    this.scroll.inProgress = true;
    this.scroll.prevX = e.pageX;
  }
  scrollstop(e) {
    if (this.scroll.inProgress === false) {
      console.log("scroll stop! Scroll inProgress:", this.scroll.inProgress);

      return;
    } else {
      this.scroll.inProgress = false;
      console.log("scroll stop! Scroll inProgress:", this.scroll.inProgress);
    }
  }
  scrollmove(e) {
    if (!this.scroll.inProgress) return;
    const diff = e.pageX - this.scroll.prevX;
    this.scroll.prevX = e.pageX;

    if (diff < 0) {
      this.scroll.distance += Math.abs(diff);
    } else if (diff > 0) {
      this.scroll.distance -= Math.abs(diff);
    } else {
      return;
    }
    this.update({ isScrolling: true });
  }
  load(el) {
    this.el = el;
    this._loadedResolve();
  }
  renderInternalChart() {
    console.log("renderInternalChart:", this.scroll.distance);
    this.el.querySelector("svg").replaceWith(
      this.chart.render({
        type: this.fsm.transitions.chartType.state,
        offset: this.scroll.distance,
      })
    );
  }

  update({ state, emit, type, value, isScrolling }) {
    if (isScrolling) {
      this.renderInternalChart();
      return false;
    } else {
      if (type !== undefined) {
        //      console.log("UPDATE!:", type, value);
        if (type !== this.fsm.transitions.chartData.state) {
          return;
        }
        switch (type) {
          case "random":
            this.addSingleData(value);
            this.renderInternalChart();
            break;
          case "binance":
            this.addSingleData(value);
            this.renderInternalChart();
            break;
          default:
            break;
        }
      }
      return false;
    }
  }
}

module.exports = exports = Component;
