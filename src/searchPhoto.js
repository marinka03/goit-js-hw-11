import axios from 'axios';
import Notiflix from 'notiflix';

async function searchPhoto(value, page) {
  const params = {
    key: '36096830-1929e3c4e7943bc1682b1faff',
    q: `${value}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    min_width: '400',
    per_page: 40,
    page,
  };

  try {
    const response = await axios.get(`https://pixabay.com/api/`, { params });
    const arrLength = await response.data.hits.length;
    if (!arrLength) {
      throw Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    return response.data;
  } catch (error) {
    return error;
  }
}

export { searchPhoto };
