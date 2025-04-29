import { create } from "zustand";
import { readLocalStorage } from "../utils/actionLocalStorage";

const useAuthStore = create((set) => ({
  isAuth: readLocalStorage("user") ? true : false,
  dataUser: readLocalStorage("user") || {},
  setIsAuth: (status) => set({ isAuth: status }),
  setDataUser: (data) => set({ dataUser: data }),
}));

export default useAuthStore;
