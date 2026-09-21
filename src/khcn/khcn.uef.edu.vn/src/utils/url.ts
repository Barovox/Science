export const getCurrentDomain = (): string => {
  const domain = `${window.location.protocol}//${window.location.host}`;
  return domain;
};

export const getPathnameWithQuery = (): string => {
  const pathname = window.location.pathname;
  const search = window.location.search;
  return `${pathname}${search}`;
};
