import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchPhoto } from './searchPhoto';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const BtnLoadMore = document.querySelector('.load-more');

BtnLoadMore.addEventListener('click', onLoadMore);
searchForm.addEventListener('submit', onSubmit);

let inputValue = '';
let page = 1;

const simpleLightBox = () => new SimpleLightbox('.gallery a', {});

async function onLoadMore() {
  try {
    const value = searchForm[0].value.trim();
    const { hits } = await searchPhoto(value, page);
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    simpleLightBox();
    page += 1;
  } catch (error) {
    console.log(error);
  }
}

async function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  // console.dir(evt.target[0].value);
  inputValue = evt.target[0]?.value?.trim();
  BtnLoadMore.style.display = 'block';

  if (!inputValue) {
    return Notiflix.Notify.failure('Please, add in seach form valid value');
  }

  try {
    const result = await searchPhoto(inputValue, page);

    if (result.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      if (result.hits.length < 40) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      gallery.insertAdjacentHTML('beforeend', createMarkup(result.hits));

      simpleLightBox();
      page += 1;
    }
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr = []) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <div class="wrapper-img">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" class="img" /></a>
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>: ${likes}
          </p>
            <p class="info-item">
            <b>Views</b>: ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>: ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>: ${downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
}
