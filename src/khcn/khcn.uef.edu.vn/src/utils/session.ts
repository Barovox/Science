export const setSessionData = (key: string, value: any) => {
  return new Promise<void>((resolve) => {
    sessionStorage.setItem(key, value);
    resolve();
  });
};

export const getSessionData = (key: string) => {
  return new Promise<string>((resolve) => {
    const data = sessionStorage.getItem(key);
    resolve(data as string);
  });
};

export const removeSessionData = (key: string) => {
  return new Promise<void>((resolve) => {
    sessionStorage.removeItem(key);
    resolve();
  });
};
