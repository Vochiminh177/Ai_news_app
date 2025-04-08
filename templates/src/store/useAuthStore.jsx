import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuth: true,
  dataUser: {},
  setIsAuth: (status) => set({ isAuth: status }),
  setDataUser: (data) => set({ dataUser: data }),
}));

export default useAuthStore;
