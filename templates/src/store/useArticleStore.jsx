import { create } from "zustand";

const useArticleStore = create((set) => ({
  articles: [],
  setArticle: (newArticles) => set({ articles: newArticles }),
}));

export default useArticleStore;
