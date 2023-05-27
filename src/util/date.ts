// その月の初日を`YYYY-M-D`形式で返す
export const firstDayOfMonth = (date: string) => {
  const [year, month] = date.split("-").map((str) => parseInt(str, 10));
  return `${year}-${month}-1`;
};

// その月の最終日を`YYYY-M-D`形式で返す
export const lastDayOfMonth = (date: string) => {
  const [year, month] = date.split("-").map((str) => parseInt(str, 10));
  const lastDate = new Date(year, month, 0).getDate();
  return `${year}-${month}-${lastDate}`;
};
