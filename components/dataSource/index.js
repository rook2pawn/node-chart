const Nanocomponent = require("nanocomponent");
const html = require("choo/html");
const css = require("sheetify");
const nanostate = require("nanostate");

const Binance = require("../../data-sources/binance");
const Random = require("../../data-sources/random");

css("./component.css");

class Component extends Nanocomponent {
  constructor({ title = "default title", type }) {
    if (type === undefined) {
      throw new Error("dataSource Component requires type");
    }
    super();
    this._loadedResolve;
    this.loaded = new Promise((resolve, reject) => {
      this._loadedResolve = resolve;
    });
    this.title = title;
    this.type = type;
    this.data;

    switch (type) {
      case "random":
        this.data = new Random();
        this.data.subscribe(this.onData.bind(this));
        break;
      case "binance":
        this.data = new Binance();
        this.data.subscribe(this.onData.bind(this));
        break;
      default:
        break;
    }

    const dataSourceControlState = nanostate("stopped", {
      stopped: { start: "started" },
      started: { stop: "stopped" },
    });

    dataSourceControlState.on("started", () => {
      this.data.stop();
      this.data.start();
    });
    dataSourceControlState.on("stopped", () => {
      this.data.stop();
    });

    this.fsm = dataSourceControlState;
  }
  onData(obj) {
    console.log("onData:", obj);
    switch (this.type) {
      case "random":
        this.value = obj;
        this.rerender();
        this.emit("random", { value: this.value });
        break;
      case "binance":
        const data = JSON.parse(obj.data);
        this.value = data.c;
        this.rerender();
        this.emit("binance", { value: this.value });
        break;
      default:
        break;
    }
  }
  createElement({ state, emit }) {
    this.emit = emit;
    return html`<div class="">
      <h2>DataSource</h2>
      <h3>${this.title}</h3>
      <span>${this.value}</span>
    </div>`;
  }

  load(el) {
    this.el = el;
    this._loadedResolve();
  }

  update() {
    return false;
  }
}

module.exports = exports = Component;
