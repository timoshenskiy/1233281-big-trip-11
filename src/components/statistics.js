import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {calculateTotalCost} from "./travel-cost.js";
import {findCorrectPrepostion} from "../utils/common.js";

const ChartOptions = {
  TYPE: `horizontalBar`,
  TITLE_TEXTS: [`MONEY`, `TRANSPORT`, `TIMESPENT`],
  DATASETS_ANCHOR: `start`,
  DATALABELS_ANCHOR: `end`,
  ALIGN: `start`,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  LABELS_FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  TICKS_FONT_SIZE: 13,
  PADDING: 5,
  FONT_COLOR: `#000000`,
  BACKGROUND_COLOR: `#ffffff`,
  POSITION: `left,`,
  TITLE_DISPLAY: true,
  OTHER_DISPLAY: false,
  DRAW_BORDER: false,
  BEGIN_AT_ZERO: true,
  TOOLTIPS_ENABLED: false,

};

const emojiMap = {
  taxi: `🚕`,
  bus: `🚌`,
  train: `🚂`,
  ship: `🚢`,
  transport: `🚊`,
  drive: `🚗`,
  flight: `✈️`,
  check: `🏨`,
  sightseeing: `🏛`,
  restaurant: `🍴`,

};

const millisecondsToHours = (time) => {
  return Math.floor(time / 1000 / 60 / 60);
};


const getAllDifferentTypes = (travelPoints) => {
  let defferentTypes = [];
  for (const travelPoint of travelPoints) {
    if (!defferentTypes.some((it) => it === travelPoint.type)) {
      defferentTypes.push(travelPoint.type);
    }
  }
  return defferentTypes;
};

const getTotalCostOfType = (travelPoints, type) => {
  const travelPointsOfSelectedType = [];
  for (const travelPoint of travelPoints) {
    if (travelPoint.type === type) {
      travelPointsOfSelectedType.push(travelPoint);
    }
  }
  return calculateTotalCost(travelPointsOfSelectedType);
};
const getTotalCountOfType = (travelPoints, type) => {
  const travelPointsOfSelectedType = [];
  for (const travelPoint of travelPoints) {
    if (travelPoint.type === type) {
      travelPointsOfSelectedType.push(travelPoint);
    }
  }
  return travelPointsOfSelectedType.length;
};

const sortMoneyInfo = (allDifferentTypes, totalPrices) => {
  const moneyInfo = allDifferentTypes.map((it, index) => {
    return {
      type: it,
      totalCost: totalPrices[index],
    };
  });
  moneyInfo.sort((a, b) => (b.totalCost - a.totalCost));
  return moneyInfo;

};
const sortTransportInfo = (allDifferentTypes, totalCount) => {
  const transportInfo = allDifferentTypes.map((it, index) => {
    return {
      type: it,
      count: totalCount[index],
    };
  });
  transportInfo.sort((a, b) => (b.count - a.count));
  return transportInfo;

};
const renderMoneyChart = (moneyCtx, travelPoints) => {
  const allDifferentTypes = getAllDifferentTypes(travelPoints);
  const totalPrices = [];
  for (const type of allDifferentTypes) {
    totalPrices.push(getTotalCostOfType(travelPoints, type));
  }
  const sortedMoneyInfo = sortMoneyInfo(allDifferentTypes, totalPrices);
  const sortedPrices = sortedMoneyInfo.map((it)=>{
    return it.totalCost;
  });
  const sortedTypes = sortedMoneyInfo.map((it)=>{
    return it.type;
  });

  const labels = sortedTypes.map((it)=>{
    if (it === `check-in`) {
      return `${emojiMap[`check`]} ${it.toUpperCase()}`;
    }
    return `${emojiMap[it]} ${it.toUpperCase()}`;
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: ChartOptions.TYPE,
    data: {
      labels,
      datasets: [{
        data: sortedPrices,
        backgroundColor: ChartOptions.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartOptions.BACKGROUND_COLOR,
        anchor: ChartOptions.DATASETS_ANCHOR,
        barThickness: ChartOptions.BAR_THICKNESS,
        minBarLength: ChartOptions.MIN_BAR_LENGTH,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartOptions.LABELS_FONT_SIZE
          },
          color: ChartOptions.FONT_COLOR,
          anchor: ChartOptions.DATALABELS_ANCHOR,
          align: ChartOptions.ALIGN,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: ChartOptions.TITLE_DISPLAY,
        text: ChartOptions.TITLE_TEXTS[0],
        fontColor: ChartOptions.FONT_COLOR,
        fontSize: ChartOptions.TITLE_FONT_SIZE,
        position: ChartOptions.POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartOptions.FONT_COLOR,
            padding: ChartOptions.PADDING,
            fontSize: ChartOptions.TICKS_FONT_SIZE,
          },
          gridLines: {
            display: ChartOptions.OTHER_DISPLAY,
            drawBorder: ChartOptions.DRAW_BORDER
          },
        }],
        xAxes: [{
          ticks: {
            display: ChartOptions.OTHER_DISPLAY,
            beginAtZero: ChartOptions.BEGIN_AT_ZERO,
          },
          gridLines: {
            display: ChartOptions.OTHER_DISPLAY,
            drawBorder: ChartOptions.DRAW_BORDER
          },
        }],
      },
      legend: {
        display: ChartOptions.OTHER_DISPLAY
      },
      tooltips: {
        enabled: ChartOptions.TOOLTIPS_ENABLED,
      }
    }
  });
};
const renderTransportChart = (transportCtx, travelPoints) => {
  const allDifferentTypes = getAllDifferentTypes(travelPoints);
  const totalCountPointsOfTypes = [];
  for (const type of allDifferentTypes) {
    totalCountPointsOfTypes.push(getTotalCountOfType(travelPoints, type));
  }
  const sortedTransportInfo = sortTransportInfo(allDifferentTypes, totalCountPointsOfTypes);
  const sortedNumberOfRepetitions = sortedTransportInfo.map((it)=>{
    return it.count;
  });
  const sortedTypes = sortedTransportInfo.map((it)=>{
    return it.type;
  });

  const labels = sortedTypes.map((it)=>{
    if (it === `check-in`) {
      return `${emojiMap[`check`]} ${it.toUpperCase()}`;
    }
    return `${emojiMap[it]} ${it.toUpperCase()}`;
  });

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: ChartOptions.TYPE,
    data: {
      labels,
      datasets: [{
        data: sortedNumberOfRepetitions,
        backgroundColor: ChartOptions.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartOptions.BACKGROUND_COLOR,
        anchor: ChartOptions.DATASETS_ANCHOR,
        barThickness: ChartOptions.BAR_THICKNESS,
        minBarLength: ChartOptions.MIN_BAR_LENGTH,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartOptions.LABELS_FONT_SIZE
          },
          color: ChartOptions.FONT_COLOR,
          anchor: ChartOptions.DATALABELS_ANCHOR,
          align: ChartOptions.ALIGN,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: ChartOptions.TITLE_DISPLAY,
        text: ChartOptions.TITLE_TEXTS[1],
        fontColor: ChartOptions.FONT_COLOR,
        fontSize: ChartOptions.TITLE_FONT_SIZE,
        position: ChartOptions.POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartOptions.FONT_COLOR,
            padding: ChartOptions.PADDING,
            fontSize: ChartOptions.TICKS_FONT_SIZE,
          },
          gridLines: {
            display: ChartOptions.OTHER_DISPLAY,
            drawBorder: ChartOptions.DRAW_BORDER
          },
        }],
        xAxes: [{
          ticks: {
            display: ChartOptions.OTHER_DISPLAY,
            beginAtZero: ChartOptions.BEGIN_AT_ZERO,
          },
          gridLines: {
            display: ChartOptions.OTHER_DISPLAY,
            drawBorder: ChartOptions.DRAW_BORDER
          },
        }],
      },
      legend: {
        display: ChartOptions.OTHER_DISPLAY
      },
      tooltips: {
        enabled: ChartOptions.TOOLTIPS_ENABLED,
      }
    }
  });
};

const renderTimeChart = (timeCtx, travelPoints) => {
  travelPoints.sort((a, b) => ((b.arrivalDate - b.departureDate) - (a.arrivalDate - a.departureDate)));

  const totalTimeSpend = travelPoints.map((it)=>{
    return it.arrivalDate - it.departureDate;
  });

  const labels = travelPoints.map((it)=>{
    if (it.type === `check-in`) {
      return `${emojiMap[`check`]} ${it.type.toUpperCase()} ${it.destination.toUpperCase()}`;
    }
    return `${emojiMap[it.type]} ${it.type.toUpperCase()} ${findCorrectPrepostion(it.type).toUpperCase()} ${it.destination.toUpperCase()}`;
  });

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: ChartOptions.TYPE,
    data: {
      labels,
      datasets: [{
        data: totalTimeSpend,
        backgroundColor: ChartOptions.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartOptions.BACKGROUND_COLOR,
        anchor: ChartOptions.DATASETS_ANCHOR,
        barThickness: ChartOptions.BAR_THICKNESS,
        minBarLength: ChartOptions.MIN_BAR_LENGTH,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartOptions.LABELS_FONT_SIZE
          },
          color: ChartOptions.FONT_COLOR,
          anchor: ChartOptions.DATALABELS_ANCHOR,
          align: ChartOptions.ALIGN,
          formatter: (val) => `${millisecondsToHours(val)}H`
        }
      },
      title: {
        display: ChartOptions.TITLE_DISPLAY,
        text: ChartOptions.TITLE_TEXTS[2],
        fontColor: ChartOptions.FONT_COLOR,
        fontSize: ChartOptions.TITLE_FONT_SIZE,
        position: ChartOptions.POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartOptions.FONT_COLOR,
            padding: ChartOptions.PADDING,
            fontSize: ChartOptions.TICKS_FONT_SIZE,
          },
          gridLines: {
            display: ChartOptions.OTHER_DISPLAY,
            drawBorder: ChartOptions.DRAW_BORDER
          },
        }],
        xAxes: [{
          ticks: {
            display: ChartOptions.OTHER_DISPLAY,
            beginAtZero: ChartOptions.BEGIN_AT_ZERO,
          },
          gridLines: {
            display: ChartOptions.OTHER_DISPLAY,
            drawBorder: ChartOptions.DRAW_BORDER
          },
        }],
      },
      legend: {
        display: ChartOptions.OTHER_DISPLAY
      },
      tooltips: {
        enabled: ChartOptions.TOOLTIPS_ENABLED,
      }
    }
  });
};
const createStatisticsTemplate = () => {
  return (`<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`);

};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
    this._pointsModel = pointsModel;

    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.setDataChangeHandler(this._onDataChange);

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }
  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;

    const MONEY_CHART_HEIGHT_COEFFICIENT = 8;
    const TRANSPORT_CHART_HEIGHT_COEFFICIENT = 8;
    const TIMESPEND_CHART_HEIGHT_COEFFICIENT = 16;

    moneyCtx.height = BAR_HEIGHT * MONEY_CHART_HEIGHT_COEFFICIENT;
    transportCtx.height = BAR_HEIGHT * TRANSPORT_CHART_HEIGHT_COEFFICIENT;
    timeSpendCtx.height = BAR_HEIGHT * TIMESPEND_CHART_HEIGHT_COEFFICIENT;

    this._moneyChart = renderMoneyChart(moneyCtx, this._pointsModel.getAllPoints());
    this._transportChart = renderTransportChart(transportCtx, this._pointsModel.getAllPoints());
    this._timeChart = renderTimeChart(timeSpendCtx, this._pointsModel.getAllPoints());
  }
  rerender() {
    super.rerender();
    this._renderCharts();

  }
  recoveryListeners() {}
  _onDataChange() {
    this.rerender();
    this.hide();
  }

}
