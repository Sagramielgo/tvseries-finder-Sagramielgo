'use strict';

/* DIAGRAMA 
1. Arrancar la página. OK
   1.1 Coger datos del api con un Fetch OK
   1.2 EVENTO: Escuchar botón de búsqueda con el contenido del value.OK
   1.3 PINTAR las series OK

2. FILTRAR: recoger el valor del input y filtrar las series OK
   2.1 PINTAR series OK
   2.2 ESCUCHAR eventos en las series (al clickar en ellas que cambien de color, o algún cambio)
 
 3. EVENTO: clicar en una de las series y:
   3.1 Marcar o desmarcar dicha serie de una sección de "favoritas" en los datos
   3.2 PINTAR de nuevo las series

   4. Meter en un array las favoritas
   4.1 Pintar el array de favoritas en la izq de la pantalla (section, div, aside?)
   4.2 Guardar favoritas en localSorage

   BONUS:
    5. Escuchar botón borrar cada serie de favoritos
    5.1 botón borrar todos los favoritos
*/
const formElement = document.querySelector('.js-form');
const searchBtnElement = document.querySelector('.js-searchButton');
const showsContainerElement = document.querySelector('.js-showsContainer');
const inputElement = document.querySelector('.js-input');

// variable de los datos que me devuelve el api
let series = [];
let favorites = [];

//CREAR función y meter api dentro
function getDataFromApi() {
  const inputValue = inputElement.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    //for para saltarnos el 'score' y que data nos devuelva directamente 'show'
    .then((data) => {
      for (let index = 0; index < data.length; index++) {
        const showList = data[index].show;
        series.push(showList);
      }
      paintSeries();
    });
}

// evitar que envíe el input por defecto
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener('submit', handleForm);

//filtrar input
function handleFilter() {
  console.log('filtrando');
  series = [];
  getDataFromApi();
  paintSeries();
}
inputElement.addEventListener('keyup', handleFilter);

//PINTAR en HTML
function paintSeries() {
  //imagen por defecto
  const placeholderImg =
    'https://via.placeholder.com/210x295/464686/ffffff/?text=';

  let codeHTML = '';
  let isValidClass;
  let isFavoriteClass;
  for (let index = 0; index < series.length; index++) {
    const { name, id, image } = series[index];

    for (const serie of series) {
      //añadir clase hidden
      if (isValidSerie(serie)) {
        isValidClass = '';
      } else {
        isValidClass = 'series--hidden';
      }
      //añadir clase favorite
      if (isFavoriteSerie(serie)) {
        isFavoriteClass = 'series--favorite';
      } else {
        isFavoriteClass = '';
      }
    }

    codeHTML += `<li class="seriesCard js-seriesCard ${isFavoriteClass} ${isValidClass}" id="${id}">`;
    codeHTML += `<article class="showCard js-showCard">`;
    codeHTML += `<h3 class="seriesTitle js-seriesTitle">${name}</h3>`;
    codeHTML += `<div class="imgContainer">`;
    if (image) {
      codeHTML += `<img src="${image.medium}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    } else {
      codeHTML += `<img src="${placeholderImg}${name}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    }
    codeHTML += `</article>`;
    codeHTML += `</li>`;
  }
  showsContainerElement.innerHTML = codeHTML;
  listenSerieEvents();
}

//serie válida o no
function isValidSerie(serie) {
  return serie.name.includes(inputElement.value);
}

//Devuelve serie seleccionada como favorita
function isFavoriteSerie(serie) {
  const favoriteFound = favorites.find((favorite) => {
    return favorite.id === serie.id;
  });

  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

//LISTEN serie Events
function listenSerieEvents() {
  const seriesElements = document.querySelectorAll('.js-seriesCard');
  for (const seriesElement of seriesElements) {
    seriesElement.addEventListener('click', handleSerie);
  }
}

//Función que devuelve el id de la serie clikada
function handleSerie(ev) {
  const clickedSerieId = ev.currentTarget.id;
  console.log('me han clikado', clickedSerieId);
}

// EVENTO click al botón de buscar
function handleInputSearch() {
  series = [];
  getDataFromApi();
  paintSeries();
}
searchBtnElement.addEventListener('click', handleInputSearch);
