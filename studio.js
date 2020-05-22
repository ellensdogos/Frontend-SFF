
var adminPage = document.getElementById("adminPage");
var studioPage = document.getElementById("studioPage");
var page = document.getElementById("page");

studioPage.addEventListener("click", function () {
    studioHomePage();
})

function deletePageContent() {
    moviePage.innerHTML = "";
    header.innerHTML = "";
}

function deletePageContent2() {
    moviePage.innerHTML = "";
    page.innerHTML = "";
}

function deletePageContent3() {
    header.innerHTML = "";
    page.innerHTML = "";
}

function goBackBtn() {
    page.insertAdjacentHTML("beforeend", "<div> <button id='goBackButton'>Go back</button> </div>")

    var goBackButton = document.getElementById("goBackButton");

    goBackButton.addEventListener("click", function () {
        studioHomePage();
    })
}

function logOutBtn() {
    page.insertAdjacentHTML("beforeend", "<div> <button id='logOutButton'>Log out</button> </div>")

    var logOutButton = document.getElementById("logOutButton");

    logOutButton.addEventListener("click", function () {
        localStorage.removeItem("userId");
        studioHomePage();
    })
}

function getStudios() {
    fetch('https://localhost:5001/api/filmstudio')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
        })
}

function studioWelcomePage() {
    deletePageContent();
    page.innerHTML = "";

    var print = "<h5>Welcome <h5> ";

    fetch('https://localhost:5001/api/filmstudio')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            print = print + json[localStorage.getItem("userId")].name;
            page.insertAdjacentHTML("afterbegin", print + "!");
        })

    logOutBtn();
    studioContent();
}


function studioContent() {
    page.insertAdjacentHTML("afterbegin", "<div class='flex-container'><button id='borrow' class='flex-item'>Borrow movie</button><button id='return' class='flex-item'>Return movie</button><button id='writeTrivia' class='flex-item'>Write trivia</button></div>")

    var borrowBtn = document.getElementById("borrow");
    var returnBtn = document.getElementById("return");
    var triviaBtn = document.getElementById("writeTrivia");

    borrowBtn.addEventListener("click", function () {
        page.innerHTML = "";
        page.insertAdjacentHTML("beforeend", '<input type="text" id="movie" value="Enter filmId..."><button id="borrow">Borrow</button>')

        var rentMovie = document.getElementById("borrow");

        rentMovie.addEventListener("click", function () {

            var movieId = parseInt(document.getElementById("movie").value);

            console.log(movieId);

            fetch('https://localhost:5001/api/film')
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {

                    var getMovieInfo = json.filter(a => a.id == movieId);

                    for (i = 0; i < getMovieInfo.length; i++) {
                        var stock = getMovieInfo[i].stock - 1;
                        parseInt(stock);
                        var title = getMovieInfo[i].name;
                    }

                    borrowMovie(movieId, stock, title);
                })
        })
    })

    returnBtn.addEventListener("click", function () {
        page.innerHTML = "";
        page.insertAdjacentHTML("beforeend", '<input type="text" id="movie" value="Enter filmId..."><button id="return">Return</button>')

        var returnFilm = document.getElementById("return");

        returnFilm.addEventListener("click", function () {

            var movieId = parseInt(document.getElementById("movie").value);
            var studio = parseInt(localStorage.getItem("userId"));

            console.log(movieId);

            fetch('https://localhost:5001/api/film')
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {

                    var getMovieInfo = json.filter(a => a.id == movieId);

                    for (i = 0; i < getMovieInfo.length; i++) {
                        var stock = getMovieInfo[i].stock + 1;
                        parseInt(stock);
                        var title = getMovieInfo[i].name;
                    }

                    fetch('https://localhost:5001/api/rentedFilm')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
            
                        var rentedFilmInfo = json.filter(a => a.filmId == movieId && a.studioId == studio);
            
                        for (i = 0; i < rentedFilmInfo.length; i++) {
                            var rentalId = rentedFilmInfo[i].id;
                            parseInt(rentalId);
                        }
                        returnMovie(movieId, stock, title, rentalId)
                    })
                })

        })
    })

    triviaBtn.addEventListener("click", function () {
        page.innerHTML = "";
        page.insertAdjacentHTML("beforeend", '<input type="text" id="triviatext" value="Enter trivia..."><input type="text" id="movieId" value="Enter filmId..."><button id="saveTrivia">Save</button>')

        var saveTrivia = document.getElementById("saveTrivia");

        saveTrivia.addEventListener("click", function () {

            var triviaText = document.getElementById("triviatext").value;
            var movieId = parseInt(document.getElementById("movieId").value);
            //fetch, if filmid finns så add, annars error
            console.log(movieId, triviaText)
            addTrivia(movieId, triviaText);
        })
    })
}

function borrowMovie(id, stock, name) {

    var data = { id: id, stock: stock, name: name }
    var studio = parseInt(localStorage.getItem("userId"));

    fetch('https://localhost:5001/api/film/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    fetch('https://localhost:5001/api/rentedFilm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filmId: id,
            studioId: studio,
            returned: false
        }),
    })
        .then(response => response.json())
        .then(json => {
            page.insertAdjacentHTML("afterbegin", "<div><p> The movie was rented successfully!</p></div>");
            goBackBtn();
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

function returnMovie(id, stock, name, rentalId) {

    var data = { id: id, stock: stock, name: name }

    fetch('https://localhost:5001/api/film/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    fetch('https://localhost:5001/api/rentedFilm/' + rentalId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json());
}

function addTrivia(filmId, trivia) {
    var data = { filmId: filmId, trivia: trivia }

    fetch('https://localhost:5001/api/filmTrivia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            page.insertAdjacentHTML("afterbegin", "<div><p> The trivia is added!</p></div>");
            goBackBtn();
        })
        .catch((error) => {
            console.error('Error:', error);
        })

}

function ErrorPage() {
    deletePageContent();
    page.insertAdjacentHTML("afterbegin", "<div><p> Login failed. Have you forgotten your password? </p></div>");

    goBackBtn();
}

function studioHomePage() {
    if (localStorage.getItem("userId") != null) {
        studioWelcomePage();
    }
    else {
        deletePageContent2();

        header.innerHTML = "<div class='header'><h1> Studio </h1></div>";
        page.insertAdjacentHTML("afterbegin", "<div class='test'><button id='loginStudio' class='loginBtn'>Login</button><button id='registerStudio' class='registerBtn'>Register</button></div>")

        var loginButton = document.getElementById("loginStudio");
        var registerButton = document.getElementById("registerStudio");

        loginButton.addEventListener("click", function () {
            deletePageContent3();

            page.insertAdjacentHTML("afterbegin", "<form class='box'><h1>Login</h1><input type='text' value='Username' id='Username'><input type='password' value='Password' id='Password'><input type='submit' value='Login' id='Login''></form>")

            var submitbutton = document.getElementById("Login");

            submitbutton.addEventListener("click", function () {
                var getUsername = document.getElementById("Username").value;
                var getPassword = document.getElementById("Password").value;
                deletePageContent2();

                fetch('https://localhost:5001/api/filmstudio')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {

                        for (i = 0; i < json.length; i++) {
                            if (getUsername == json[i].name && getPassword == json[i].password) {
                                console.log("Inloggning lyckades!");

                                localStorage.setItem("userId", i);
                                console.log(localStorage);
                            }
                        }

                        if (localStorage.getItem("userId") != null) {
                            studioWelcomePage();
                        }
                        else {
                            ErrorPage();
                        }
                    })
            })
        })

        registerButton.addEventListener("click", function () {
            deletePageContent3();
            page.insertAdjacentHTML("afterbegin", "<form class='box'><h1>Register</h1><input type='text' value='Username' id='Username'><input type='password' value='Password' id='Password'><input type='submit' value='Register' id='saveButton''></form>")

            var saveButton = document.getElementById("saveButton");

            saveButton.addEventListener("click", function () {
                var studioname = document.getElementById("Username").value;
                var password = document.getElementById("Password").value;

                deletePageContent2();

                console.log(studioname, password);
                addStudio(studioname, password);
            })
        })

    }

}

function addStudio(username, password) {
    var data = { name: username, password: password }

    fetch('https://localhost:5001/api/filmstudio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            page.insertAdjacentHTML("afterbegin", "<div><p> The studio is registered!</p></div>");
            goBackBtn();
        })
        .catch((error) => {
            console.error('Error:', error);
        })

}

var studioList = document.getElementById("studioList");

function printStudioList() {
    fetch('https://localhost:5001/api/filmstudio')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            studioList.innerHTML = "";
            deletePageContent();

            for (i = 0; i < json.length; i++) {
                studioList.insertAdjacentHTML("beforeend", "<div> <li> " + json[i].name + "</li></div>")
            }
        })
}

adminPage.addEventListener("click", function () {
    deletePageContent();
    page.innerHTML = "";

    page.insertAdjacentHTML("afterbegin", "<form class='box'><h1>Login</h1><input type='text' value='Username' id='Username'><input type='password' value='Password' id='Password'><input type='submit' value='Login' id='Login'></form>")
})