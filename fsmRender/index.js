const Nanocomponent = require("nanocomponent");
const html = require("choo/html");
const css = require("sheetify");
css("./component.css");

class Component extends Nanocomponent {
  constructor(machine) {
    super();
    this._loadedResolve;
    this.loaded = new Promise((resolve, reject) => {
      this._loadedResolve = resolve;
    });
    this.fsm = machine.fsm ? machine.fsm : machine;
  }
  renderFSM(fsm) {
    return html`<div class="fsmRender">
      <div class="currentState">currentState ${fsm && fsm.state}</div>
      <div class="states">
        ${Object.keys(fsm.transitions).map((key) => {
          return html`<div>
            <span class="key ${key === fsm.state ? "active" : ""}">${key}</span
            ><span class="value">${JSON.stringify(fsm.transitions[key])}</span>
          </div>`;
        })}
      </div>
    </div>`;
  }
  createElement({ state, emit }) {
    switch (typeof this.fsm.state) {
      case "string":
        return this.renderFSM(this.fsm);
        break;
      case "object":
        const scopes = this.fsm.scopes;
        return html`<div>
          ${scopes.map((scope) => {
            return this.renderFSM(this.fsm.transitions[scope]);
          })}
        </div>`;
        break;
      default:
        break;
    }
  }

  load(el) {
    this.el = el;
    this._loadedResolve();
  }

  update() {
    return true;
  }
}

module.exports = exports = Component;
