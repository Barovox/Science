export const formatNumberWithCommas = (number: any) => {
  const nb = "" + number;
  const result = nb.replace(
    /(?:(^\d{1,3})(?=(?:\d{3})*$)|(\d{3}))(?!$)/gm,
    "$1$2."
  );

  return result;
};
