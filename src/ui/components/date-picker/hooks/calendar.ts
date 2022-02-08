import moment, { Moment } from 'moment';
import times from 'lodash/times';
import { useState } from 'react';

export interface Day {
  value: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  dayOfWeek: number;
}

export interface Calendar {
  date: string;
  increaseMonth: () => void;
  decreaseMonth: () => void;
  days: Day[][];
  setYear: (year: number) => void;
  setMonth: (month: string | number) => void;
  year: string;
  month: string;
}

function createDay(day: Moment, currentDate: Moment): Day {
  const today = moment();
  const isCurrentMonth = day.month() === currentDate.month();

  return {
    value: day.toISOString(),
    isToday: day.isSame(today, 'date'),
    isCurrentMonth,
    dayOfWeek: day.toDate().getDay(),
  };
}

/**
 * This beast generates a multi-dimensional array of dates,
 * dayjs date objects to be exact.
 * It takes a date and generates
 *
 * @param [dayjs] date
 * @return Array<Array<dayjs>>
 */

function generateDateRows(initialDate: Moment): Day[][] {
  const date = initialDate.isValid() ? initialDate : moment();
  const year = date.year();
  const daysInMonth = date.daysInMonth();
  const rows = [[]] as Day[][];
  let rowIndex = 0;

  // fill in initial rows
  times(daysInMonth, (num) => {
    const temp = moment(new Date(year, date.month(), num + 1));
    const dow = temp.day();
    rows[rowIndex].push(createDay(temp, date));

    if (dow === 6 && num !== daysInMonth - 1) {
      rowIndex += 1;
      rows.push([]);
    }
  });

  const rowLen = rows.length;
  const firstRow = rows[0];

  // backfill days from prev month in first week of month
  if (firstRow.length !== 7) {
    const backfillBy = 7 - firstRow.length;
    const first = firstRow[0];

    times(backfillBy, (num) => {
      const d = moment(first.value).startOf('week').add(num, 'day');
      firstRow.splice(num, 0, createDay(d, date));
    });
  }

  // frontfill days from next month in last week of month
  const lastRow = rows[rowLen - 1];
  if (lastRow.length !== 7) {
    const fillBy = 7 - lastRow.length;
    const lastLen = lastRow.length;
    const last = lastRow[lastLen - 1];

    times(fillBy, (num) => {
      const d = moment(last.value).add(num + 1, 'day');
      lastRow.push(createDay(d, date));
    });
  }

  return rows;
}

interface Options {
  initialValue?: string;
}

export function useCalendar(options: Options = {}): Calendar {
  const { initialValue } = options;
  const [date, setDate] = useState(moment(initialValue));

  const days = generateDateRows(date);

  function increaseMonth(): void {
    setDate(moment(date).add(1, 'month'));
  }

  function decreaseMonth(): void {
    setDate(moment(date).subtract(1, 'month'));
  }

  return {
    date: date.toISOString(),
    increaseMonth,
    decreaseMonth,
    days,
    year: date.format('YYYY'),
    month: date.format('MMMM'),
    setYear: (year: number) => {
      setDate(moment(date).year(year));
    },
    setMonth: (month: string | number) => {
      setDate(moment(date).month(month));
    },
  };
}
