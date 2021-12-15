const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "key=23895189-b5b787f85de520230ba9fbe30";

const API = async function (searchQuery, page) {
  const url = `${BASE_URL}?${API_KEY}&q=${searchQuery}&lang=en,ru&image_type=photo&orientation=horizontal&page=${page}&per_page=12`;
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(new Error(`There is no images`));
  });
};
export default API;
