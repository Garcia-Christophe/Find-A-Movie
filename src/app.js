const API_URL = "https://api.themoviedb.org/3/";
const API_KEY = "api_key=04c35731a5ee918f014970082a0088b1";
const API_CRITERIA = "short_by=popularity.desc&page=1";
const API_KEY_AND_CRITERIA = `${API_KEY}&${API_CRITERIA}`;
const API_IMG_URL = "https://image.tmdb.org/t/p/w1280/";

const form = document.getElementById("form");
const search = document.getElementById("search");

var tabIdMovie = [];

// Get the director of a movie
async function getDirector(id) {
  const response = await fetch(`${API_URL}movie/${id}/credits?${API_KEY}`);
  const data = await response.json();
  let director = "";
  let dataDirector = data.crew.find(({ job }) => job === "Director");
  if (dataDirector !== undefined) {
    director = dataDirector.name;
  }
  return director;
}

// Get the runtime of a movie
async function getRuntime(id) {
  const response = await fetch(`${API_URL}movie/${id}?${API_KEY}`);
  const data = await response.json();
  let runtime = data.runtime;
  let runtimeString = "";

  // Convert runtime to hours and minutes
  if (runtime >= 60) {
    runtimeString += Math.floor(runtime / 60) + "h ";
    runtimeString += (runtime % 60) + "m";
  } else {
    runtimeString += runtime + "m";
  }
  return runtimeString;
}

// Get the html for a movie
function getMovieHtml(movie, director, runtime) {
  return `<div class="movie">
        <img src="${API_IMG_URL + movie.poster_path}" alt="${
    movie.original_title
  }"
        />
        <div class="movie-info">
          <div class="movie-info1">
            <h3>${movie.title}</h3>
            <span class="${
              movie.vote_average >= 8
                ? "green"
                : movie.vote_average >= 5
                ? "orange"
                : "red"
            }">${movie.vote_average}</span>
          </div>
          <div class="movie-info2">
            <span>${director}</span>
            <span">${runtime}</span>
          </div>
        </div>
        <div class="overview">
            <h3>Release date:</h3>
            <p>${movie.release_date}</p>
            <h3>Overview:</h3>
            <p>${movie.overview}</p>
            <h3>Actions:</h3>
            <div class="action-buttons">
              <button class="btn" onclick="console.log('add')">
                <i class="fa fa-plus"></i> Add to my collection
              </button>
              <div>&nbsp;</div>
              <button class="btn" onclick="console.log('delete')">
                <i class="fa fa-minus"></i> Delete from my collection
              </button>
            </div>
          </div>
      </div>`;
}

// Initialize the list of movies of the main page
async function getMovies() {
  const response = await fetch(
    `${API_URL}discover/movie?${API_KEY_AND_CRITERIA}`
  );
  const data = await response.json();

  // Get the director and runtime of each movie
  let directors = [];
  let runtimes = [];
  for (const movie of data.results) {
    let director = await getDirector(movie.id);
    let runtime = await getRuntime(movie.id);
    directors.push(director);
    runtimes.push(runtime);
  }

  // Create the html for each movie
  let mainHtml = "";
  for (let i = 0; i < data.results.length; i++) {
    mainHtml += getMovieHtml(data.results[i], directors[i], runtimes[i]);
  }

  // Add the html of the list to the main page
  document.getElementById("movies").innerHTML = mainHtml;
}

// Get the list of movies by its name
async function getMovieByName(name, mainHtml) {
  const response = await fetch(
    `${API_URL}search/movie?${API_KEY_AND_CRITERIA}&query=${name}`
  );
  const data = await response.json();

  let directors = [];
  let runtimes = [];
  for (const movie of data.results) {
    let director = await getDirector(movie.id);
    let runtime = await getRuntime(movie.id);
    directors.push(director);
    runtimes.push(runtime);
  }

  // Create the html for each movie
  let main = mainHtml;
  for (let i = 0; i < data.results.length; i++) {
    if (!tabIdMovie.includes(data.results[i].id)) {
      tabIdMovie.push(data.results[i].id);
      main += getMovieHtml(data.results[i], directors[i], runtimes[i]);
    }
  }
  return main;
}

// Get the list of movies by the name of a person of the cast
async function getMovieByActor(name, mainHtml) {
  let main = mainHtml;
  const response = await fetch(
    `${API_URL}search/person?${API_KEY_AND_CRITERIA}&query=${name}`
  );

  const actors = await response.json();

  for (let i = 0; i < actors.results.length; i++) {
    const res = await fetch(
      `${API_URL}discover/movie?${API_KEY_AND_CRITERIA}&with_cast=${actors.results[i].id}`
    );

    const movies = await res.json();

    let directors = [];
    let runtimes = [];
    for (const movie of movies.results) {
      let director = await getDirector(movie.id);
      let runtime = await getRuntime(movie.id);
      directors.push(director);
      runtimes.push(runtime);
    }

    for (let j = 0; j < movies.results.length; j++) {
      if (!tabIdMovie.includes(movies.results[j].id)) {
        tabIdMovie.push(movies.results[j].id);
        main += getMovieHtml(movies.results[j], directors[j], runtimes[j]);
      }
    }
  }
  return main;
  //affichage par acteur et r??alisateur
}

async function searchMovies(searchT) {
  let mainHtml = "";
  tabIdMovie = [];
  mainHtml = await getMovieByName(searchT, mainHtml);
  mainHtml = await getMovieByActor(searchT, mainHtml);
  // Add the html of the list to the main page
  document.querySelector("main").innerHTML = mainHtml;
  //TODO ne pas avoir deux fois le m??me film
}

// Initialize the main page
getMovies();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    searchMovies(searchTerm);
    search.value = "";
  }
});
