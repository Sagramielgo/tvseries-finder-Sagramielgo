'use strict';

const formElement = document.querySelector('.js-form');
const searchBtnElement = document.querySelector('.js-searchButton');
const showsContainerElement = document.querySelector('.js-showsContainer');
const inputElement = document.querySelector('.js-input');
const favoritesBoxElement = document.querySelector('.js-favoritesContainer');

//variable para introducir las seleccionadas como favoritas
let favorites = [];

// variable de los datos que me devuelve el api
let series = [];

//CREAR función y meter llamada API dentro
function getDataFromApi() {
  const inputValue = inputElement.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    //for para saltarnos el 'score' y que data nos devuelva directamente 'show'
    .then((data) => {
      series = [];
      for (let index = 0; index < data.length; index++) {
        const showList = data[index].show;
        series.push(showList);
      }
      paintSeries();
    });
}

// evitar que envíe el input del form por defecto
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener('submit', handleForm);

//EVENTO filtrar input con cada tecla que pulse la usuaria
function handleFilter() {
  paintFavorites(); //Si hay === true, pintarlas
  getDataFromApi();
  paintSeries();
}
inputElement.addEventListener('keyup', handleFilter);

//PINTAR busqueda de API en HTML
function paintSeries() {
  //si no hay imagen, ésta por defecto
  const placeholderImg =
    'https://via.placeholder.com/210x295/464686/ffffff/?text=';

  let codeHTML = '';
  let isFavoriteClass;
  for (let index = 0; index < series.length; index++) {
    const { name, id, image, schedule } = series[index];

    //le añade la clase favorite con una función
    isFavoriteSerie(series[index])
      ? (isFavoriteClass = 'series--favorite')
      : (isFavoriteClass = '');
    codeHTML += `<li class="seriesCard js-seriesCard " id="${id}">`;
    codeHTML += `<article class="showCard ${isFavoriteClass} js-showCard">`;
    codeHTML += `<h3 class="seriesTitle js-seriesTitle">${name}</h3>`;
    if (schedule.days.length > 0) {
      codeHTML += `<ul>`;
      /*   for (let index = 0; index < schedule.days.length; index++) {
      const daysShow = schedule.days[index];
      codeHTML += `<li> ${daysShow}`;
      codeHTML += `</li>`;
    } */

      codeHTML += `<li>` + schedule.days.join(`</li><li>`) + '</li>';
      codeHTML += `</ul>`;
    }
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

// compruebo si la serie que recibo por parámetro está en los favoritos
function isFavoriteSerie(serie) {
  const favoriteFound = favorites.find((favorite) => {
    return favorite.id === serie.id;
  });
  if (favoriteFound === undefined) {
    // find devuelve undefined si no lo encuentra
    return false;
  } else {
    return true; // retorno si está o no está en favoritos
  }
}

//PINTAR array favorites en HTML
function paintFavorites() {
  //Condición para pintar en pantalla sección de favoritas. Si el array está vacío no la pinta.
  if (favorites.length === 0) {
    favoritesBoxElement.innerHTML = '';
    return;
  }
  //imagen por defecto si no la tiene
  const placeholderImg =
    'https://via.placeholder.com/210x295/8ec0f0/1f154e/?text=';

  let codeHTML = '';
  codeHTML += `<h2 class="favoritesTitle">`;
  codeHTML += 'FAVORITOS';
  codeHTML += `</h2>`;
  codeHTML += '<button type="button" class="js-deleteAll deleteFavorites">';
  codeHTML += 'Delete All';
  codeHTML += `</button>`;
  for (let index = 0; index < favorites.length; index++) {
    const { name, id, image } = favorites[index];
    codeHTML += `<li class="favoriteCard js-seriesCard" id="${id}">`;
    codeHTML += `<article class="favoriteShow js-showCard">`;
    codeHTML += `<h3 class="favoriteTitle js-seriesTitle">${name}</h3>`;
    codeHTML += '<button class="deleteButton">';
    codeHTML += '<i class="far fa-trash-alt"></i>';
    codeHTML += '</button>';
    codeHTML += `<div class="imgFavoriteContainer">`;
    if (image) {
      codeHTML += `<img src="${image.medium}" class="favoriteImage js-seriesImage" alt="${name}" /></a></div>`;
    } else {
      codeHTML += `<img src="${placeholderImg}${name}" class="favoriteImage js-seriesImage" alt="${name}" /></a></div>`;
    }
    codeHTML += `</article>`;
    codeHTML += `</li>`;
  }
  favoritesBoxElement.innerHTML = codeHTML;

  //EVENTO borrar todos los favoritos
  const deleteAllElement = document.querySelector('.js-deleteAll');
  deleteAllElement.addEventListener('click', handleDeleteAllFav);

  listenSerieEvents();
}

//guardar en localStorage
function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem('favorites', stringFavorites);
}

//// recuperar data del localSt y si no llamar al api
function getFromLocalStorage() {
  const localStorageFavorites = localStorage.getItem('favorites');
  if (localStorageFavorites === null) {
    //getDataFromApi();
  } else {
    //función para convertir el localStorage en array
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favorites = arrayFavorites;
    paintFavorites();
  }
}

//EVENTO de escucha serie Events que ejecuta guardar favoritas en local Storage
function listenSerieEvents() {
  setInLocalStorage();
  const seriesElements = document.querySelectorAll('.js-seriesCard');
  for (const seriesElement of seriesElements) {
    seriesElement.addEventListener('click', handleSerie);
  }
}

//Función que devuelve el id de la serie clikada
function handleSerie(ev) {
  const clickedSerieId = parseInt(ev.currentTarget.id); //pasarlo a number!!!

  const serieFound = series.find(function (serie) {
    return serie.id === clickedSerieId;
  });

  const favoriteFoundIndex = favorites.findIndex(function (favorite) {
    return favorite.id === clickedSerieId;
  });

  //para que no la suba por duplicado al array de favorites
  if (favoriteFoundIndex === -1) {
    favorites.push(serieFound);
    //para que la quite si ya está en el array de favorites
  } else {
    favorites.splice(favoriteFoundIndex, 1);
  }
  paintSeries();
  paintFavorites();
}

// EVENTO click al botón de buscar
function handleInputSearch() {
  series = [];
  paintFavorites();
  getDataFromApi();
  paintSeries();
}
searchBtnElement.addEventListener('click', handleInputSearch);

//EVENTO recargar página al pulsr botón
const reloadElement = document.querySelector('.js-reloadButton');
function handleReload() {
  location.reload();
}
reloadElement.addEventListener('click', handleReload);

//función que ejecuta el evento de escucha de la línea 132
function handleDeleteAllFav() {
  favorites = [];
  paintSeries();
  paintFavorites();
  setInLocalStorage();
}

// start app
getFromLocalStorage();
