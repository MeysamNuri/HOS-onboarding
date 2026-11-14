
import moment from 'jalali-moment';
import dayjs from "dayjs";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";

export const cleanJalaliDate = (rawDate?: string): string => {
  if (!rawDate) return '';

  return rawDate
    .trim()
    .replace(/[۰-۹]/g, (digit) =>
      String.fromCharCode(digit.charCodeAt(0) - 0x06F0 + 48)
    );
};

export const isEmptyDate = (date?: string | null) => {
  return (
    !date ||
    date === "0001-01-01T00:00:00Z" ||
    date === "0001-01-01T00:00:00" ||
    date === "01/01/0001 00:00:00"
  );
};
export const renderJalaliDate = (gregorianDateString: string) => {

  if (!gregorianDateString || isEmptyDate(gregorianDateString)) return '-';
  const gregorianMoment = moment(gregorianDateString, 'MM/DD/YYYY HH:mm');
  if (gregorianMoment.isValid()) {
    return gregorianMoment.format('HH:mm - jYYYY/jMM/jDD');
  }
  return gregorianDateString;
};
export const renderJalaliDate2 = (gregorianDateString: string) => {
  if (!gregorianDateString || isEmptyDate(gregorianDateString)) return '-';
  const gregorianMoment = moment(gregorianDateString, 'YYYY-MM-DDTHH:mm');
  if (gregorianMoment.isValid()) {
    return gregorianMoment.format('HH:mm - jYYYY/jMM/jDD');
  }
  return gregorianDateString;
};


export const toLocalGregorian = (date: dayjs.Dayjs | null): string => {
  if (!date) return '';
  const localDate = date.toDate();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const gregorianToJalaliDayjs = (gregorianDate: string | null | undefined): dayjs.Dayjs | null => {
  if (!gregorianDate) return null;

  // Step 1: Parse as Gregorian
  const gregorianDayjs = dayjs(gregorianDate);
  if (!gregorianDayjs.isValid()) return null;

  // Step 2: Format to Jalali string (e.g., "1405/02/26")
  const jalaliString = gregorianDayjs.format('jYYYY/jMM/jDD');

  // Step 3: Parse that Jalali string as a Jalali date
  const jalaliDayjs = dayjs(jalaliString, 'jYYYY/jMM/jDD');

  return jalaliDayjs.isValid() ? jalaliDayjs : null;
};
export const convertGregorianToPersian = (gregorianStr: string) => {
  const [y, m, d] = gregorianStr.split("/");
  const jsDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  return new DateObject({ date: jsDate, calendar: persian });
};

