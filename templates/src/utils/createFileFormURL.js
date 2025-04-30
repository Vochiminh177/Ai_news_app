const createFileFromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], "default.jpg", { type: "image/jpeg" });
  return file;
};

export default createFileFromUrl;
