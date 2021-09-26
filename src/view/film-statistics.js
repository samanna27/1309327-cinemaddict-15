import dayjs from 'dayjs';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { PERIOD, GENRES } from '../const.js';
import {countWatchedFilmsInDateRange,
  parseChartDate,
  getDatesInRange,
  countWatchedFilmsDuration,
  makeItemsUniq,
  countFilmsByGenre,
  countWatchedFilmsTopGenre,
  countWatchedFilmsInPeriod,
  defineUserStatus
} from '../utils/statistics.js';

const renderDaysChart = (statisticCtx, films, dateFrom, dateTo) => {
  const BAR_HEIGHT = 50;
  // statisticCtx = document.querySelector('.statistic__chart');
  const uniqGenres = makeItemsUniq(GENRES);
  const dates = getDatesInRange(dateFrom, dateTo);
  const filmByGenreCounts = uniqGenres.map((genre) => countFilmsByGenre(films, genre));
  // const watchedFilmsCount = countWatchedFilmsInPeriod(dates, films);
  // const parsedDates = dates.map(parseChartDate);
  // const filmsInDateRangeCounts = countWatchedFilmsInDateRange(dates, films);

  statisticCtx.height = BAR_HEIGHT * 6;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqGenres,
      datasets: [{
        data: filmByGenreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createFilmsStatisticsTemplate = (data) => {
  const {films, dateFrom, dateTo} = data;
  const dates = getDatesInRange(dateFrom, dateTo);
  const watchedFilms = films.filter((film) => film.isAlreadyWatched === true);
  const watchedFilmsCount = countWatchedFilmsInDateRange(dates, watchedFilms);
  console.log(watchedFilmsCount);
  const watchedFilmsDuration = countWatchedFilmsDuration(dates, watchedFilms);
  const userStatus = defineUserStatus(watchedFilmsCount);
  // if(userStatus === '') {
  //   document.querySelector('.statistic__rank').classList.add('visually-hidden');

  // }
  // const watchedFilmsTopGenre = countWatchedFilmsTopGenre(films, dateFrom, dateTo);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userStatus} </span>
    </p>

     <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${watchedFilmsDuration} <span class="statistic__item-description">h</span> 22 <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Sci-Fi</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class FilmsStatistics extends SmartView {
  constructor(films) {
    super();

    this._data = {
      films,
      registrationDate: dayjs('2019-01-25').format('DD/MM/YYYY'),
      daysInPeriod: dayjs().diff(this._data.registrationDate, 'day'),
      dateFrom: (() => {
        const daysToFullYear = 360;
        return dayjs().subtract(daysToFullYear, 'day').toDate();
      })(),
      dateTo: dayjs().toDate(),
    };

    this._daysChart = null;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setCharts();
    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._periodPicker = this.getElement().querySelector('.statistic__filters');
    this._periodPicker.addEventListener('change', this._periodChangeHandler);
  }

  removeElement() {
    super.removeElement();

    this._periodPicker.removeEventListener('change', this._periodChangeHandler);

    if (this._daysChart !== null) {
      this._daysChart = null;
    }
  }

  getTemplate() {
    return createFilmsStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    this._periodPicker.addEventListener('change', this._periodChangeHandler);
    // this._setDatepicker();
  }

  _periodChangeHandler(evt) {
    this.updateData({
      daysInPeriod: PERIOD[evt.target.value],
    });
  }

  _setCharts() {
    if (this._daysChart !== null) {
      this._daysChart = null;
    }

    const {films, dateFrom, dateTo} = this._data;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._daysChart = renderDaysChart(statisticCtx, films, dateFrom, dateTo);
  }
}
