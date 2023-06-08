import {
  differenceInWeeks,
  getISOWeek,
  getISOWeekYear,
  nextMonday,
  setWeek,
} from "date-fns";
import { ClientType, Maybe, Scalars } from "../../../../generated/graphql";
import { roundToTwo } from "../../../../helpers/measurementHelper";

export type ClientProgressType = {
  __typename?: "ClientProgressType";
  id: Scalars["Int"];
  weight?: Maybe<Scalars["Float"]>;
  /** Date field */
  date?: Maybe<Scalars["String"]>;
};

type TProgressGroupedByWeekNumber = {
  [key: string]: { [key: string]: { id: string; weight: number; date: string } };
};

type ReturnType = {
  weekChange: number | undefined;
  isPositiveNumber: boolean;
  lastWeekAverageWeight: number | undefined;
  secondToLastWeekAverageWeight: number | undefined;
  lastWeekNumber: number | undefined;
  secondToLastWeekNumber: number | undefined;
  differenceInWeeksNumber: number | undefined;
};

export const getProgressWeekChange = (progress: ClientProgressType[]): ReturnType => {
  const sortedProgress = progress.sort(
    (a, b) => new Date(String(a?.date)).getTime() - new Date(String(b.date)).getTime(),
  );

  const progressGroupedByWeekNumber = getProgressGroupedByWeekNumber(sortedProgress);
  const progressGroupedByWeekNumberKeys = Object.keys(progressGroupedByWeekNumber);

  const lastWeekYearString = getWeekYearString(
    progressGroupedByWeekNumber,
    progressGroupedByWeekNumberKeys,
    1,
  );
  const secondToLastWeekYearString = getWeekYearString(
    progressGroupedByWeekNumber,
    progressGroupedByWeekNumberKeys,
    2,
  );

  const secondToLastWeekAverageWeight = getAverageWeekWeight(
    secondToLastWeekYearString,
    progressGroupedByWeekNumber,
  );

  const lastWeekAverageWeight = getAverageWeekWeight(
    lastWeekYearString,
    progressGroupedByWeekNumber,
  );

  const weekChange =
    lastWeekAverageWeight &&
    secondToLastWeekAverageWeight &&
    lastWeekAverageWeight - secondToLastWeekAverageWeight;

  const isPositiveNumber = weekChange !== undefined && Boolean(weekChange > 0);

  const lastWeekDate = getDateFromWeekNumber(lastWeekYearString);
  const secondToLastWeekDate = getDateFromWeekNumber(secondToLastWeekYearString);
  const differenceInWeeksNumber =
    lastWeekDate && secondToLastWeekDate
      ? differenceInWeeks(lastWeekDate, secondToLastWeekDate)
      : undefined;

  const lastWeekNumber = lastWeekDate ? getISOWeek(lastWeekDate) : undefined;
  const secondToLastWeekNumber = secondToLastWeekDate
    ? getISOWeek(secondToLastWeekDate)
    : undefined;

  return {
    weekChange: roundToTwo(weekChange),
    lastWeekAverageWeight: roundToTwo(lastWeekAverageWeight),
    secondToLastWeekAverageWeight: roundToTwo(secondToLastWeekAverageWeight),
    isPositiveNumber,
    lastWeekNumber,
    secondToLastWeekNumber,
    differenceInWeeksNumber,
  };
};

const getDateFromWeekNumber = (lastWeekNumber: string | undefined) => {
  if (!lastWeekNumber) return undefined;

  const year = Number(lastWeekNumber.split("-")[0]);
  const weekNumber = Number(lastWeekNumber.split("-")[1]);

  return setWeek(nextMonday(new Date(year, 0, 4)), weekNumber, {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  });
};

function getAverageWeekWeight(
  weekNumber: string | undefined,
  progressGroupedByWeekNumber: TProgressGroupedByWeekNumber,
) {
  if (!weekNumber) return undefined;

  const valuesArr = Object.values(progressGroupedByWeekNumber[weekNumber]);

  const sumWeight = valuesArr.reduce((previousValue, c) => previousValue + c.weight, 0);

  return sumWeight / valuesArr.length;
}

function getWeekYearString(
  progressGroupedByWeekNumber: TProgressGroupedByWeekNumber,
  progressGroupedByWeekNumberKeys: string[],
  indexFromLast: number,
) {
  return progressGroupedByWeekNumber
    ? progressGroupedByWeekNumberKeys[
        progressGroupedByWeekNumberKeys?.length - indexFromLast
      ]
    : undefined;
}

function getProgressGroupedByWeekNumber(
  progress: ClientType["progress"] | undefined,
): TProgressGroupedByWeekNumber {
  return (progress || []).reduce((previousValue, currentValue) => {
    const weekNumber = getISOWeek(new Date(String(currentValue.date)));
    const year = getISOWeekYear(new Date(String(currentValue.date)));
    const weekNumberAndYear = `${year}-${weekNumber}`;

    if (!Boolean(currentValue.weight)) {
      return previousValue;
    }

    return {
      ...previousValue,
      [weekNumberAndYear]: {
        ...previousValue[weekNumberAndYear],
        [currentValue.id]: {
          id: currentValue.id,
          date: currentValue.date,
          weight: currentValue.weight,
        },
      },
    };
  }, {} as TProgressGroupedByWeekNumber);
}
