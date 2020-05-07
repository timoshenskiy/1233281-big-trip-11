import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {calculateTotalCost} from './travel-cost.js';

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
const renderMoneyChart = (moneyCtx, travelPoints) => {
  const allDifferentTypes = getAllDifferentTypes(travelPoints);
  const totalPrices = [];
  for (const type of allDifferentTypes) {
    totalPrices.push(getTotalCostOfType(travelPoints, type));
  }
  const moneyInfo = sortMoneyInfo(allDifferentTypes, totalPrices);
  const sortedPrices = moneyInfo.map((it)=>{
    return it.totalCost;
  });
  const sortedTypes = moneyInfo.map((it)=>{
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
          // barThickness: 44,
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
          // minBarLength: 50
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
const renderTransportChart = (transportCtx) => {
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`FLY`, `DRIVE`, `RIDE`],
      datasets: [{
        data: [4, 2, 1],
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
          // barThickness: 44,
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
          // minBarLength: 50
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

const renderTimeChart = (timeCtx) => {
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`FLY`, `DRIVE`, `RIDE`],
      datasets: [{
        data: [4, 2, 1],
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
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
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
          // barThickness: 44,
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
          // minBarLength: 50
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

    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 8;
    transportCtx.height = BAR_HEIGHT * 4;
    timeSpendCtx.height = BAR_HEIGHT * 4;

    this._moneyChart = renderMoneyChart(moneyCtx, this._pointsModel.getAllPoints());
    this._transportChart = renderTransportChart(transportCtx);
    this._timeChart = renderTimeChart(timeSpendCtx);
  }

}
