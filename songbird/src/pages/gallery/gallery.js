import './gallery.html';
import '@babel/polyfill';
import '../../sass/style.scss';
import content from '../../js/content';
import birdsData from '../../js/birds';
import { getLanguageSettings, createNavLinks } from '../../js/functions';

let lang = getLanguageSettings();
const data = content[lang];
const birds = birdsData[lang];
let count = 1;

createNavLinks(data);
const galleryList = document.querySelector('.gallery__list');

function createGalleryList() {
  birds.forEach((value) => {
    value.forEach((bird) => {
      const li = document.createElement('li');
      li.classList.add('gallery__item');
      li.id = count;
      count += 1;
      const div = document.createElement('div');
      div.classList.add('gallery__image');
      const img = new Image();
      img.classList.add('gallery__img');
      img.src = bird.image;
      img.alt = bird.name;
      div.append(img);
      li.append(div);
      const title = document.createElement('h3');
      title.classList.add('gallery__title');
      title.innerText = bird.name;
      li.append(title);
      const latin = document.createElement('p');
      latin.classList.add('gallery__latin');
      latin.innerText = bird.species;
      li.append(latin);
      galleryList.append(li);
    });
  });
}

createGalleryList();

function findCurrentBird(event) {
  if (event.target.closest('li')) {
    const { id } = event.target.closest('li');
    const index = Math.ceil(+id / 6) - 1;
    console.log(birds[index][id - index * 6 - 1]);
  }
}

galleryList.addEventListener('click', findCurrentBird);
