const formElement = document.querySelector('.js-form');
const searchBtnElement = document.querySelector('.js-searchButton');
const showsContainerElement = document.querySelector('.js-showsContainer');
const inputElement = document.querySelector('.js-input');
const favoritesBoxElement = document.querySelector('.js-favoritesContainer');

//variable to create array of favourites
let favorites = [];

// variable of data than API returns to us
let series = [];

//CREATE a function in order to put inside the fetch(call to API)
function getDataFromApi() {
  const inputValue = inputElement.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    //We're doing a 'for' to avoid 'score' and get directly what we need, which is 'show' in this case
    .then((data) => {
      series = [];
      for (let index = 0; index < data.length; index++) {
        const showList = data[index].show;
        series.push(showList);
      }
      paintSeries();
    });
}

// avoid default sending of the input content in the form
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener('submit', handleForm);

//EVENT filter input with every key that user presses
function handleFilter() {
  paintFavorites(); //If there are anyone, so === true, we need to paint them
  getDataFromApi();
  paintSeries();
}
inputElement.addEventListener('keyup', handleFilter);

//Paint API search in HTML
function paintSeries() {
  //If there is no image, this is the default one to put instead
  const placeholderImg = './assets/images/imgPlaceholder.png';
  /* '//via.placeholder.com/210x295/464686/ffffff/?text='; */

  let codeHTML = '';
  let isFavoriteClass;
  for (let index = 0; index < series.length; index++) {
    const { name, id, image, schedule } = series[index];

    //this add class 'favorite' by executing function
    isFavoriteSerie(series[index])
      ? (isFavoriteClass = 'series--favorite')
      : (isFavoriteClass = '');
    codeHTML += `<li class="seriesCard js-seriesCard " id="${id}">`;
    codeHTML += `<article class="showCard ${isFavoriteClass} js-showCard">`;
    codeHTML += `<h3 class="seriesTitle js-seriesTitle">${name}</h3>`;
    if (schedule.days.length > 0) {
      codeHTML += `<ul class="days">`;
      codeHTML +=
        `<li class="day" >` +
        schedule.days.join(`</li><li class="day">`) +
        '</li>';
      codeHTML += `</ul>`;
    }
    codeHTML += `<div class="imgContainer">`;
    if (image) {
      codeHTML += `<img src="${image.medium}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    } else {
      codeHTML += `<img src="${placeholderImg}" class="seriesImage js-seriesImage" alt="${name}" /></a></div>`;
    }
    codeHTML += `</article>`;
    codeHTML += `</li>`;
  }
  showsContainerElement.innerHTML = codeHTML;
  listenSerieEvents();
}

// test if the show I am receiving by parameter is already in favourite list
function isFavoriteSerie(serie) {
  const favoriteFound = favorites.find((favorite) => {
    return favorite.id === serie.id;
  });
  if (favoriteFound === undefined) {
    // find rturns undefined if it doesn't find it
    return false;
  } else {
    return true; // returns if it is in favourites or not
  }
}

//PAINT favorites array in HTML
function paintFavorites() {
  //Condition to paint favourite section in the window. If returns an empty array we won't paint the section.
  if (favorites.length === 0) {
    favoritesBoxElement.innerHTML = '';
    return;
  }
  //Default image in case the show doesn't have any.
  const placeholderImg = './assets/images/favImgPlaceholder.png';
  /* '//via.placeholder.com/210x295/8ec0f0/1f154e/?text='; */

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
      codeHTML += `<img src="${placeholderImg}" class="favoriteImage js-seriesImage" alt="${name}" /></a></div>`;
    }
    codeHTML += `</article>`;
    codeHTML += `</li>`;
  }
  favoritesBoxElement.innerHTML = codeHTML;

  //EVENT delete all favourites
  const deleteAllElement = document.querySelector('.js-deleteAll');
  deleteAllElement.addEventListener('click', handleDeleteAllFav);

  listenSerieEvents();
}

//keep/set in localStorage
function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem('favorites', stringFavorites);
}

//// Get data from localSt and in case there isn't any data stored, then call API
function getFromLocalStorage() {
  const localStorageFavorites = localStorage.getItem('favorites');
  if (localStorageFavorites === null) {
    //getDataFromApi();
  } else {
    //Function to transform localStorage into array
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favorites = arrayFavorites;
    paintFavorites();
  }
}

//EVENT listener in order to store favorite shows in local storage.
function listenSerieEvents() {
  setInLocalStorage();
  const seriesElements = document.querySelectorAll('.js-seriesCard');
  for (const seriesElement of seriesElements) {
    seriesElement.addEventListener('click', handleSerie);
  }
}

//Function that returns clicked show ID.
function handleSerie(ev) {
  const clickedSerieId = parseInt(ev.currentTarget.id); //pasarlo a number!!!

  const serieFound = series.find(function (serie) {
    return serie.id === clickedSerieId;
  });

  const favoriteFoundIndex = favorites.findIndex(function (favorite) {
    return favorite.id === clickedSerieId;
  });

  // Condition to avoid push duplicate show to favourites array.
  if (favoriteFoundIndex === -1) {
    favorites.push(serieFound);
    //In case this show is already in favourites array, we'll remove from there.
  } else {
    favorites.splice(favoriteFoundIndex, 1);
  }
  paintSeries();
  paintFavorites();
}

// EVENT click on search button
function handleInputSearch() {
  series = [];
  paintFavorites();
  getDataFromApi();
  paintSeries();
}
searchBtnElement.addEventListener('click', handleInputSearch);

//EVENT to reload page by pressing button
const reloadElement = document.querySelector('.js-reloadButton');
function handleReload() {
  location.reload();
}
reloadElement.addEventListener('click', handleReload);

//Function to run event listener from line 132
function handleDeleteAllFav() {
  favorites = [];
  paintSeries();
  paintFavorites();
  setInLocalStorage();
}

// start app
getFromLocalStorage();
