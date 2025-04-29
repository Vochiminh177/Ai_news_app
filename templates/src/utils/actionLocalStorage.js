export function writeLocalStorage(key, value) {
  try {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
}

export function readLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value); // Nếu là object JSON
    }
    return null;
  } catch (error) {
    console.error("Error reading localStorage:", error);
    return null;
  }
}
