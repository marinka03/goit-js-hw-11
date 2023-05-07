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
    const { hits, totalHits} = await searchPhoto(value, page);
    BtnLoadMore.style.display = "block";

    checkQuantityPhoto(hits, totalHits);

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
  inputValue = evt.target[0]?.value?.trim();


  if (!inputValue) {
    return Notiflix.Notify.failure('Please, add in seach form valid value');
  }

  try {
    const { hits, totalHits} = await searchPhoto(inputValue, page);
    BtnLoadMore.style.display = "block";

    checkQuantityPhoto(hits, totalHits);
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

    simpleLightBox();
    page += 1;
    
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
            <b>Likes</b> ${likes}
          </p>
            <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
}
 
async function checkQuantityPhoto(hits, totalHits){
  if(40 * page >= totalHits){
    BtnLoadMore.style.display = "none";
    Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );

    return;
  }
  if (totalHits === 0) {
    BtnLoadMore.style.display = "none";
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  } else {
    Notiflix.Notify.success(`Hooray! We found ${totalHits + 40 - (40 * page)} images.`);
  }

}