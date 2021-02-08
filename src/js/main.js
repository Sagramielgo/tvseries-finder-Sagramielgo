'use strict';

/* DIAGRAMA 
1. Arrancar la página. OK
   1.1 Coger datos del api con un Fetch OK
   1.2 EVENTO: Excuchar botón de búsqueda con el contenido del value.
   1.3 PINTAR las series

2. FILTRAR: recoger el valor del input y filtrar las series
   3.1 PINTAR series
   3.2 ESCUCHAR eventos en las series (al clickar en ellas que cambien de color, o algún cambio)
 
 
 3. EVENTO: clicar en una de las series y:
   2.1 Marcar o desmarcar dicha serie de una sección de "favoritas" en los datos
   2.3 PINTAR de nuevo las series

   4. Meter en un array las favoritas
   4.1 Pintar el array de favoritas en la izq de la pantalla (section, div, aside?)
   4.2 Guardar favoritas en localSorage

   BONUS:
    5. Escuchar botón borrar cada serie de favoritos
    5.1 botón borrar todos los favoritos
*/

// variable de los datos que me devuelve el api
let series = [];
const inputElement = document.querySelector('.js-input');
const inputValue = inputElement.value;
//CREAR función y meter api dentro
function getDataFromApi() {
  fetch(`http://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    //for para saltarnos el 'score' y que data nos devuelva directamente 'show'
    .then((data) => {
      for (let index = 0; index < data.length; index++) {
        const showList = data[index].show;
        series.push(showList);
      }
      console.log(series);
      paintSeries();
    });
}

//pintar nombre
const showsContainerElement = document.querySelector('.js-showsContainer');
const placeholderImg = 'https://via.placeholder.com/210x295/ffffff/666666/?';
function paintSeries() {
  console.log('Estoy pintando esto:', series);
  let codeHTML = '';
  for (let index = 0; index < series.length; index++) {
    const name = series[index].name;
    const id = series[index].id;
    const image = series[index].image;
    codeHTML += `<li class="seriesCard js-seriesCard" id="${id}">`;
    codeHTML += `<div class="imgContainer">`;
    if (image) {
      codeHTML += `<img src="${image.medium}" class="series-image js-series-image" alt="Cover image for ${name}" /></a></div>`;
    } else {
      codeHTML += `<img src="${placeholderImg}${name}" class="series-image js-series-image" alt="Cover image for ${name}" /></a></div>`;
    }
    codeHTML += `<h3 class="series-title js-seriesTitle">${name}</h3>`;
    codeHTML += `</li>`;
  }
  showsContainerElement.innerHTML = codeHTML;
}
paintSeries();
//start api
getDataFromApi();
