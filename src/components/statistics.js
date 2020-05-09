import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {calculateTotalCost} from './travel-cost.js';
import {findCorrectPrepostion} from '../utils/common.js';

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
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: sortedPrices,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
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
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: sortedNumberOfRepetitions,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
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
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: totalTimeSpend,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${Math.floor((val / 1000 / 60 / 60))}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`,
        barThickness: 44,
        minBarLength: 50,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
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
    moneyCtx.height = BAR_HEIGHT * 8;
    transportCtx.height = BAR_HEIGHT * 8;
    timeSpendCtx.height = BAR_HEIGHT * 16;

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
