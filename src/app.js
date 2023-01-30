const API_URL = "https://api.themoviedb.org/3/";
const API_KEY = "api_key=04c35731a5ee918f014970082a0088b1";
const API_CRITERIA = "short_by=popularity.desc&page=1";
const API_KEY_AND_CRITERIA = `${API_KEY}&${API_CRITERIA}`;
const API_IMG_URL = "https://image.tmdb.org/t/p/w1280/";

// Get the director of a movie
async function getDirector(id) {
  const response = await fetch(`${API_URL}movie/${id}/credits?${API_KEY}`);
  const data = await response.json();
  let director = data.crew.find(({ job }) => job === "Director").name;
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
          <div class="overview">
            <h3>Release date:</h3>
            <p>${movie.release_date}</p>
            <h3>Overview:</h3>
            <p>${movie.overview}</p>
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
  document.querySelector("main").innerHTML = mainHtml;
}

// Get the list of movies by its name
async function getMovieByName(name) {
  const response = await fetch(
    `${API_URL}search/movie?${API_KEY_AND_CRITERIA}&query=${name}`
  );
  const data = await response.json();
  console.log(data.results);
}

// Get a list of actors by their name
async function getActor(name) {
  const response = await fetch(
    `${API_URL}search/person?${API_KEY_AND_CRITERIA}&query=${name}`
  );
  const data = await response.json();
  console.log(data.results);
}

// Get the list of movies by the name of a person of the cast
async function getMovieByActor(name) {
  const response = await fetch(
    `${API_URL}search/person?${API_KEY_AND_CRITERIA}&query=${name}`
  );
  var movies = [];
  response.json().then((data) => {
    data.results.forEach((actor) => {
      fetch(
        `${API_URL}discover/movie?${API_KEY_AND_CRITERIA}&with_cast=${actor.id}`
      ).then((response) => {
        response.json().then((data) => {
          movies.push(data.results);
        });
      });
    });
  });
  console.log(movies);
}

// Initialize the main page
getMovies();
