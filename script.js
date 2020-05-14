
function getMovies() {
    fetch('https://localhost:5001/api/film')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
        })
}

function getRentedMovies() {
    fetch('https://localhost:5001/api/rentedFilm')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
        })
}

