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
    this.substate = "";
    this.fsm = machine.fsm ? machine.fsm : machine;
  }
  renderFSM(fsm) {
    const { state } = fsm;
    const { substate } = this;
    if (substate.length) {
      fsm = fsm.submachines[substate];
    }
    let regularControls = fsm.transitions[state]
      ? Object.keys(fsm.transitions[state])
      : [];
    let subControls = Object.keys(fsm.submachines);
    return html` <div class="fsmControls">
      <div>
        ${regularControls.length
          ? html`<div class="regularControls">Controls</div>`
          : ""}
        ${regularControls.map((controlName) => {
          return html`<input
            value="${controlName}"
            type="button"
            onclick=${() => {
              if (substate.length) {
                this.substate = "";
                this.fsm.emit(controlName);
              } else {
                fsm.emit(controlName);
              }
              this.emit("render");
            }}
          />`;
        })}
      </div>
      <div>
        ${subControls.length
          ? html`<div class="subControls">Sub Controls</div>`
          : ""}
        ${subControls.map((controlName) => {
          return html`<input
            value="${controlName}"
            type="button"
            onclick=${() => {
              this.substate = controlName;
              this.fsm.emit(controlName);
              this.emit("render");
            }}
          />`;
        })}
      </div>
    </div>`;
  }
  createElement({ state, emit }) {
    this.emit = emit;
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
