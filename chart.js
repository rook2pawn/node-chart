const html = require("nanohtml");

const round = (x) => {
  return ~~(round * 100) / 100;
};

const Chart = function () {
  // normalize x, y onto [0,1]
  this.normalizedData = [];
  this.screenData = [];
  // visual attributes
  this.chartAttributes = {
    CHART_WIDTH: 300,
    CHART_HEIGHT: 200,
    CHART_OFFSET_X: 0,
    CHART_OFFSET_Y: 10,
    CHART_POINTLABEL: true,
  };
  // data attributes
  // height refers to the max y - min y, width max x - min x
  this.attributes = {
    width: 100,
    height: 100,
    minX: 0,
    minY: 0,
    maxX: 100,
    maxY: 100,
    data: [{ x: 0, y: 0 }],
  };
};
Chart.prototype.getBoundaries = (list) => {
  const MAX = 1000000;
  let minX = MAX,
    minY = MAX;
  let maxX = -MAX,
    maxY = -MAX;
  console.log("getBoundaries:", this.chartAttributes);
  list.slice(-5).forEach(({ x, y }) => {
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

Chart.prototype.getLength = function () {
  return this.attributes.data.length;
};
Chart.prototype.addSingleYValueData = function (val) {
  const obj = {
    x: this.getLength(),
    y: val,
  };
  this.attributes.data.push(obj);
  this.normalizeData();
};
Chart.prototype.addSingleData = function (obj) {
  this.attributes.data.push(obj);
  this.normalizeData();
};
Chart.prototype.addData = function (list) {
  this.attributes.data = this.attributes.data.concat(list);
};
Chart.prototype.setBoundaries = function () {
  const { minX, maxX, minY, maxY } = this.getBoundaries(this.attributes.data);
  this.attributes.minX = minX;
  this.attributes.minY = minY;
  this.attributes.maxX = maxX;
  this.attributes.maxY = maxY;
  this.attributes.width = maxX - minX;
  this.attributes.height = maxY - minY;
  console.log("setBoundaries: attributes:", this.attributes);
};
Chart.prototype.normalizeData = function () {
  this.normalizedData = this.attributes["data"].map(({ x, y }, idx) => {
    let scaledX = (x - this.attributes.minX) / this.attributes.width;
    let scaledY = (y - this.attributes.minY) / this.attributes.height;
    console.log("INPUT:", { x, y }, "height:", this.attributes.height);
    console.log("OUTPUT:", { x: scaledX, y: scaledY });
    return { x: scaledX, y: scaledY };
  });
};
Chart.prototype.zoomIn = function () {
  return new Promise((resolve, reject) => {
    if (this.attributes.minX + 4 >= this.attributes.maxX) {
      return reject("cannot zoom in further");
    }
    this.attributes.minX += 4;
    this.attributes.width = this.attributes.maxX - this.attributes.minX;
    console.log(
      "zoomIn: minX",
      this.attributes.minX,
      " width:",
      this.attributes.width
    );
    return resolve();
  });
};
Chart.prototype.zoomOut = function () {
  return new Promise((resolve, reject) => {
    if (this.attributes.minX - 4 <= -this.attributes.maxX) {
      return reject("cannot zoom out further");
    }

    this.attributes.minX -= 4;
    this.attributes.width = this.attributes.maxX - this.attributes.minX;
    console.log(
      "zoomOut: minX",
      this.attributes.minX,
      " width:",
      this.attributes.width
    );
    return resolve();
  });
};

Chart.prototype.set = function (attr, data) {
  this.attributes[attr] = data;
  this.setBoundaries();
  this.normalizeData();
};
Chart.prototype.transformToScreen = function () {
  return this.normalizedData.map(({ x, y }) => {
    let x2 = this.chartAttributes.CHART_WIDTH * x;
    let y2 =
      this.chartAttributes.CHART_HEIGHT - this.chartAttributes.CHART_HEIGHT * y;
    y2 =
      (1 -
        this.chartAttributes.CHART_OFFSET_Y /
          this.chartAttributes.CHART_HEIGHT) *
        y2 +
      this.chartAttributes.CHART_OFFSET_Y;
    return { x: x2, y: y2 };
  });
};
Chart.prototype.render = function ({ type, offset = 0 }) {
  this.chartAttributes.CHART_OFFSET_X = offset;
  const transformed = this.transformToScreen();
  let pointstring = transformed
    .map(({ x, y }) => {
      return `${x},${y}`;
    })
    .join("\n");
  let pointLabelString = this.attributes.data.map(({ y }, idx) => {
    return html`<text
      class="label"
      x="${transformed[idx].x}"
      y="${transformed[idx].y}"
      >${y.toFixed(2)}</text
    >`;
  });

  switch (type) {
    case "polyline":
      return html`<svg
        viewBox="${offset} 0 ${this.chartAttributes.CHART_WIDTH} ${this
          .chartAttributes.CHART_HEIGHT}"
        class="chart"
      >
        <polyline
          fill="none"
          stroke="#0074d9"
          stroke-width="0.25"
          points="${pointstring}"
        />
        ${pointLabelString}
      </svg>`;
      break;
    case "polylinepoint":
      return html`<svg
        viewBox="${offset} 0 ${this.chartAttributes.CHART_WIDTH} ${this
          .chartAttributes.CHART_HEIGHT}"
        class="chart"
      >
        <polyline
          fill="none"
          stroke="#0074d9"
          stroke-width="0.25"
          points="${pointstring}"
        />
        ${pointLabelString}
        ${transformed.map(({ x, y }) => {
          return html`<circle cx="${x}" cy="${y}" r="1"></circle>`;
        })}
      </svg>`;
      break;

    case "point":
      return html`<svg
        viewBox="${offset} 0 ${this.chartAttributes.CHART_WIDTH} ${this
          .chartAttributes.CHART_HEIGHT}"
        class="chart"
      >
        ${pointLabelString}
        ${transformed.map(({ x, y }) => {
          return html`<circle cx="${x}" cy="${y}" r="1"></circle>`;
        })}
      </svg>`;

      break;
    default:
      break;
  }
};

module.exports = exports = Chart;
