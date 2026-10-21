// Dependencia sustituible para pruebas y tolerante a datos corruptos.
export const storage = {
  read(key, fallback) {
    try {
      const value = localStorage.getItem("hh:" + key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem("hh:" + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
