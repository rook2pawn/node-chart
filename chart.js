const html = require("nanohtml");

const getBoundaries = (list) => {
  const MAX = 1000000;
  let minX = MAX,
    minY = MAX;
  let maxX = -MAX,
    maxY = -MAX;
  list.forEach(({ x, y }) => {
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  });
  return { minX, maxX, minY, maxY };
};

const Chart = function () {
  this.scaledData = [];
  this.attributes = {
    width: 100,
    height: 100,
    minX: 0,
    minY: 0,
    maxX: 100,
    maxY: 100,
  };
};
Chart.prototype.set = function (attr, data) {
  this.attributes[attr] = data;
  const { minX, maxX, minY, maxY } = getBoundaries(data);
  this.attributes.minX = minX;
  this.attributes.minY = minY;
  this.attributes.maxX = maxX;
  this.attributes.maxY = maxY;
  this.attributes.width = maxX - minX;
  this.attributes.height = maxY - minY;
  console.log("attributes:", this.attributes);
  this.scaledData = this.attributes["data"].map(({ x, y }) => {
    console.log("INPUT:", { x, y }, "height:", this.attributes.height);
    let scaledY = (y - this.attributes.minY) / this.attributes.height;
    console.log("OUTPUT:", { x, scaledY });
    return { x, y: scaledY };
  });
};
Chart.prototype.render = function ({ type }) {
  console.log("TYPE:", type);
  switch (type) {
    case "polyline":
      const pointstring = this.scaledData
        .map(({ x, y }) => `${x},${100 * y}`)
        .join("\n");
      return html`<svg viewBox="0 0 100 100" class="chart">
        <polyline
          fill="none"
          stroke="#0074d9"
          stroke-width="0.25"
          points="${pointstring}"
        />
      </svg>`;
      break;
    case "point":
      return html`<svg viewBox="0 0 100 100" class="chart">
        ${this.scaledData.map(({ x, y }) => {
          return html`<circle cx="${x}" cy="${100 * y}" r="1"></circle>`;
        })}
      </svg>`;

      break;
    default:
      break;
  }
  return html`<svg
    viewBox="${this.attributes.minX} ${-this.attributes.minY} ${this.attributes
      .width} ${this.attributes.height}"
    class="chart"
  >
    <polyline
      fill="none"
      stroke="#0074d9"
      stroke-width="0.25"
      points="${pointstring}"
    />
  </svg>`;
};

module.exports = exports = Chart;
