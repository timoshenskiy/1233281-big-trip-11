import {checkIsFutureDay, checkIsPastDay} from "./common.js";
import {FilterType} from "../const.js";

export const getPointsByFilter = (travelPoints, filterType) => {
  const nowDate = new Date();
  const getFuturePoints = (points, date) => {
    return points.filter((point) => checkIsFutureDay(point.departureDate, date));
  };
  const getPastPoints = (points, date) => {
    return points.filter((point) => checkIsPastDay(point.departureDate, date));
  };
  switch (filterType) {
    case FilterType.EVERYTHING:
      return travelPoints;
    case FilterType.FUTURE:
      return getFuturePoints(travelPoints, nowDate);
    case FilterType.PAST:
      return getPastPoints(travelPoints, nowDate);
  }
  return travelPoints;

};
