import {formatTimeforDatetime, formatDateForPointList} from '../utils.js';

const createTravelPointListTemplate = (number, date) => {
  const datetime = formatTimeforDatetime(date, false);
  const pointsGroupDate = formatDateForPointList(date);
  return (
    `<ul class="trip-days">
            <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${number}</span>
                <time class="day__date" datetime="${datetime}">${pointsGroupDate}</time>
              </div>

              <ul class="trip-events__list">
              </ul>
            </li>
          </ul>`
  );
};

export {createTravelPointListTemplate};
