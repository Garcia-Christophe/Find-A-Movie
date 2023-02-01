const API_URL = "https://api.themoviedb.org/3/";
const API_KEY = "api_key=04c35731a5ee918f014970082a0088b1";
const API_CRITERIA = "short_by=popularity.desc&page=1";
const API_KEY_AND_CRITERIA = `${API_KEY}&${API_CRITERIA}`;


async function getMovies() {
  const response = await fetch(
    `${API_URL}discover/movie?${API_KEY_AND_CRITERIA}`
  );
  const data = await response.json();
  console.log(data.results);
}

async function getMovieByName(name) {
  const response = await fetch(
    `${API_URL}search/movie?${API_KEY_AND_CRITERIA}&query=${name}`
  );
  const data = await response.json();
  console.log(data.results);
}

async function getActor(name) {
  const response = await fetch(
    `${API_URL}search/person?${API_KEY_AND_CRITERIA}&query=${name}`
  );
  const data = await response.json();
  console.log(data.results);
}

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

getMovies();
getMovieByName("Harry Potter");
getActor("Chris Hemsworth");
getMovieByActor("Chris Hemsworth");
