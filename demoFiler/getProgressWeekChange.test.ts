import { getProgressWeekChange } from "../../routes/ClientOverview/Goal/helpers/getProgressWeekChange";

describe("Goal calculations on week basis", () => {
  it("should give Goal progress values for losing weight", () => {
    const progress = [
      { id: 1, weight: 90, date: "2020-01-02" },
      { id: 2, weight: 80, date: "2020-01-09" },
    ];

    const { weekChange, isPositiveNumber, lastWeekNumber, secondToLastWeekNumber } =
      getProgressWeekChange(progress);

    expect(weekChange).toBe(-10);
    expect(isPositiveNumber).toBe(false);
    expect(lastWeekNumber).toBe(2);
    expect(secondToLastWeekNumber).toBe(1);
  });

  it("should give Goal progress values for losing weight over new year", () => {
    const progress = [
      { id: 1, weight: 90, date: "2022-12-29" },
      { id: 3, weight: 85, date: "2023-01-02" },
    ];

    const { weekChange, isPositiveNumber, lastWeekNumber, secondToLastWeekNumber } =
      getProgressWeekChange(progress);

    expect(weekChange).toBe(-5);
    expect(isPositiveNumber).toBe(false);
    expect(lastWeekNumber).toBe(1);
    expect(secondToLastWeekNumber).toBe(52);
  });

  it("should give Goal progress values for gaining weight", () => {
    const progress = [
      { id: 1, weight: 87, date: "2022-12-07" },
      { id: 2, weight: 90, date: "2022-12-24" },
    ];

    const { weekChange, isPositiveNumber, lastWeekNumber, secondToLastWeekNumber } =
      getProgressWeekChange(progress);

    expect(weekChange).toBe(3);
    expect(isPositiveNumber).toBe(true);
    expect(lastWeekNumber).toBe(51);
    expect(secondToLastWeekNumber).toBe(49);
  });

  it("should give Goal progress values for maintaining weight", () => {
    const progress = [
      { id: 1, weight: 90, date: "2022-12-07" },
      { id: 2, weight: 90, date: "2022-12-24" },
    ];

    const { weekChange, isPositiveNumber, lastWeekNumber, secondToLastWeekNumber } =
      getProgressWeekChange(progress);

    expect(weekChange).toBe(0);
    expect(isPositiveNumber).toBe(false);
    expect(lastWeekNumber).toBe(51);
    expect(secondToLastWeekNumber).toBe(49);
  });

  it("should give Goal progress values for gaining weight average of week with scrambled progress", () => {
    const progress = [
      { id: 2, weight: 91, date: "2022-12-08" },
      { id: 4, weight: 90, date: "2022-12-24" },
      { id: 1, weight: 85, date: "2022-12-07" },
      { id: 3, weight: 92, date: "2022-12-09" },
    ];

    const { weekChange, isPositiveNumber, lastWeekNumber, secondToLastWeekNumber } =
      getProgressWeekChange(progress);

    expect(weekChange).toBe(0.67);
    expect(isPositiveNumber).toBe(true);
    expect(lastWeekNumber).toBe(51);
    expect(secondToLastWeekNumber).toBe(49);
  });
});
