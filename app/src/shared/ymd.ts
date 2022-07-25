const TEN = 10;

export const getMonth = (d: Date): string => {
  const month = d.getMonth() + 1;

  return month < TEN ? `0${month.toString()}` : month.toString();
};

export const getCurrentMonth = (): string => getMonth(new Date());

export const getDay = (d: Date): string => {
  const date = d.getDate();

  return date < TEN ? `0${date.toString()}` : date.toString();
};

export const getCurrentDay = (): string => getDay(new Date());

export const getHours = (d: Date): string => {
  const hours = d.getHours();

  return hours < TEN ? `0${hours.toString()}` : hours.toString();
};

export const getCurrentHours = (): string => getHours(new Date());

export const getMinutes = (d: Date): string => {
  const minutes = d.getMinutes();

  return minutes < TEN ? `0${minutes.toString()}` : minutes.toString();
};

export const getCurrentMinutes = (): string => getMinutes(new Date());

export const getSeconds = (d: Date): string => {
  const seconds = d.getSeconds();

  return seconds < TEN ? `0${seconds.toString()}` : seconds.toString();
};

export const getCurrentSeconds = (): string => getSeconds(new Date());

export const getYear = (d: Date): string => d.getFullYear().toString();

export const getCurrentYear = (): string => new Date().getFullYear().toString();

export const getDatetime = (d: Date): string => {
  const year = getYear(d);
  const mon = getMonth(d);
  const day = getDay(d);
  const hour = getHours(d);
  const min = getMinutes(d);
  const sec = getSeconds(d);

  return `${year}-${mon}-${day} ${hour}:${min}:${sec}`;
};

export const getCurrentDatetime = (): string => {
  const d = new Date();

  return getDatetime(d);
};

export const getDate = (d: Date): string => {
  const year = getYear(d);
  const mon = getMonth(d);
  const day = getDay(d);

  return `${year}-${mon}-${day}`;
};

export const getCurrentDate = (): string => {
  const d = new Date();

  return getDate(d);
};

export const getTime = (d: Date): string => {
  const hour = getHours(d);
  const min = getMinutes(d);
  const sec = getSeconds(d);

  return `${hour}:${min}:${sec}`;
};

export const getCurrentTime = (): string => getTime(new Date());
