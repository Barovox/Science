export const setLocalStorageData = (key: string, value: any) => {
  return new Promise<void>((resolve) => {
    localStorage.setItem(key, value);
    resolve();
  });
};

export const getLocalStorageData = (key: string) => {
  return new Promise<string>((resolve) => {
    const data = localStorage.getItem(key);
    resolve(data as string);
  });
};

export const removeLocalStorageData = (key: string) => {
  return new Promise<void>((resolve) => {
    localStorage.removeItem(key);
    resolve();
  });
};
