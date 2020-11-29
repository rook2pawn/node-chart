const html = require("nanohtml");

const getBoundaries = (list) => {
  const MAX = 1000000;
  let minX = MAX,
    minY = MAX;
  let maxX = -MAX,
    maxY = -MAX;
  list.slice(-20).forEach(({ x, y }) => {
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
  // visual attributes
  this.chartAttributes = {
    CHART_WIDTH: 300,
    CHART_HEIGHT: 200,
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
Chart.prototype.getLength = function () {
  return this.attributes.data.length;
};
Chart.prototype.addSingleYValueData = function (val) {
  const obj = {
    x: this.getLength(),
    y: val,
  };
  this.attributes.data.push(obj);
  this.scaleData();
};
Chart.prototype.addSingleData = function (obj) {
  this.attributes.data.push(obj);
  this.scaleData();
};
Chart.prototype.addData = function (list) {
  this.attributes.data = this.attributes.data.concat(list);
};
Chart.prototype.setBoundaries = function (data) {
  const { minX, maxX, minY, maxY } = getBoundaries(
    data || this.attributes.data
  );
  this.attributes.minX = minX;
  this.attributes.minY = minY;
  this.attributes.maxX = maxX;
  this.attributes.maxY = maxY;
  this.attributes.width = maxX - minX;
  this.attributes.height = maxY - minY;
  //  console.log("attributes:", this.attributes);
};
Chart.prototype.scaleData = function () {
  this.scaledData = this.attributes["data"].map(({ x, y }, idx) => {
    let scaledX = (x - this.attributes.minX) / this.attributes.width;
    let scaledY = (y - this.attributes.minY) / this.attributes.height;
    //    console.log("INPUT:", { x, y }, "height:", this.attributes.height);
    //    console.log("OUTPUT:", { x: scaledX, y: scaledY });
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
  this.setBoundaries(data);
  this.scaleData(data);
};
Chart.prototype.render = function ({ type }) {
  console.log("TYPE:", type);
  let pointstring = this.scaledData
    .map(
      ({ x, y }) =>
        `${this.chartAttributes.CHART_WIDTH * x},${
          this.chartAttributes.CHART_HEIGHT -
          this.chartAttributes.CHART_HEIGHT * y
        }`
    )
    .join("\n");

  switch (type) {
    case "polyline":
      return html`<svg
        viewBox="0 0 ${this.chartAttributes.CHART_WIDTH} ${this.chartAttributes
          .CHART_HEIGHT}"
        class="chart"
      >
        <polyline
          fill="none"
          stroke="#0074d9"
          stroke-width="0.25"
          points="${pointstring}"
        />
      </svg>`;
      break;
    case "polylinepoint":
      return html`<svg
        viewBox="0 0 ${this.chartAttributes.CHART_WIDTH} ${this.chartAttributes
          .CHART_HEIGHT}"
        class="chart"
      >
        <polyline
          fill="none"
          stroke="#0074d9"
          stroke-width="0.25"
          points="${pointstring}"
        />
        ${this.scaledData.map(({ x, y }) => {
          return html`<circle
            cx="${this.chartAttributes.CHART_WIDTH * x}"
            cy="${this.chartAttributes.CHART_HEIGHT -
            this.chartAttributes.CHART_HEIGHT * y}"
            r="1"
          ></circle>`;
        })}
      </svg>`;
      break;

    case "point":
      return html`<svg
        viewBox="0 0 ${this.chartAttributes.CHART_WIDTH} ${this.chartAttributes
          .CHART_HEIGHT}"
        class="chart"
      >
        ${this.scaledData.map(({ x, y }) => {
          return html`<circle
            cx="${this.chartAttributes.CHART_WIDTH * x}"
            cy="${this.chartAttributes.CHART_HEIGHT -
            this.chartAttributes.CHART_HEIGHT * y}"
            r="1"
          ></circle>`;
        })}
      </svg>`;

      break;
    default:
      break;
  }
};

module.exports = exports = Chart;
