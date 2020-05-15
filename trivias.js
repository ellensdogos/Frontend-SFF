console.log(localStorage);


var moviePage = document.getElementById("container");
var header = document.getElementById("header");

function getTrivias() {
    fetch('https://localhost:5001/api/filmTrivia')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
        })
}

var triviaList = document.getElementById("page");

var triviaPage = document.getElementById("triviaPage");
var movieOneTrivias = document.getElementById("movie1");
var movieTwoTrivias = document.getElementById("movie2");
var movieThreeTrivias = document.getElementById("movie3");


triviaPage.addEventListener("click", function () {

    moviePage.innerHTML = "";
    triviaList.innerHTML = "";
    header.innerHTML = "<div class='header'><h1> All Trivias </h1></div>";

    fetch('https://localhost:5001/api/filmTrivia')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {

        for (i = 0; i < json.length; i++)
        {
            triviaList.insertAdjacentHTML("beforeend", "<div id='alltrivias'> Movie: " + json[i].filmId + "<li class='list'>" + json[i].trivia + " </li></div>")
        }
    })   
})

movieOneTrivias.addEventListener("click", function () 
{
    triviaList.innerHTML = "Trivias: ";

    fetch('https://localhost:5001/api/filmTrivia')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {

        var filterTrivia = json.filter(a => a.filmId == 1);

        if (json.filmId != 1)
        {
            console.log("Finns ej någon trivia inlagd för filmen");
            triviaList.insertAdjacentHTML("beforeend", "<div class='text-style'> Finns ingen trivia för denna film </div>")
        }
        else
        {
            for (i = 0; i < filterTrivia.length; i++)
            {
                triviaList.insertAdjacentHTML("beforeend", "<div class='text-style'>" + filterTrivia[i].trivia + "</div>")
            }
        }
    })
})

movieTwoTrivias.addEventListener("click", function ()
{
    triviaList.innerHTML = "Trivias: ";

    fetch('https://localhost:5001/api/filmTrivia')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {

        var filterTrivia = json.filter(a => a.filmId == 2);
        
        for (i = 0; i < filterTrivia.length; i++)
        {
            triviaList.insertAdjacentHTML("beforeend", "<div class='text-style'>" + filterTrivia[i].trivia + "</div>")
        }
    })
})

movieThreeTrivias.addEventListener("click", function () 
{
    triviaList.innerHTML = "Trivias: ";

    fetch('https://localhost:5001/api/filmTrivia')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {

        var filterTrivia = json.filter(a => a.filmId == 3);
        
        for (i = 0; i < filterTrivia.length; i++)
        {
            triviaList.insertAdjacentHTML("beforeend", "<div class='text-style'>" + filterTrivia[i].trivia + "</div>")
        }
    })
})
