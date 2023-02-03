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
        </div>
        <div class="overview">
            <h3>Release date:</h3>
            <p>${movie.release_date}</p>
            <h3>Overview:</h3>
            <p>${movie.overview}</p>
          </div>
      </div>`;
}