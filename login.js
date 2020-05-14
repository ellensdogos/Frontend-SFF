
var adminPage = document.getElementById("adminPage");
var studioPage = document.getElementById("studioPage");
var page = document.getElementById("page");

function getStudios() {
    fetch('https://localhost:5001/api/filmstudio')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            console.log(json);
        })
}

studioPage.addEventListener("click", function () {
    studioHomePage();
})

function studioWelcomePage() {
    moviePage.innerHTML = "";
    header.innerHTML = "";
    page.innerHTML = "";

    var print = "<h5>You are logged in as: <h5> ";

    fetch('https://localhost:5001/api/filmstudio')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            print = print + json[localStorage.getItem("userId")].name;
            page.insertAdjacentHTML("afterbegin", print);
        })

    page.insertAdjacentHTML("beforeend", "<div> <button id='logOutButton'>Logga ut</button> </div>")

    var logOutButton = document.getElementById("logOutButton");

    logOutButton.addEventListener("click", function () {
        localStorage.removeItem("userId");
        studioHomePage();
    })
}

function ErrorPage() {
    moviePage.innerHTML = "";
    header.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", "<div><p> Login failed. Have you forgotten your password? </p></div>");

    page.insertAdjacentHTML("beforeend", "<div> <button id='goBackButton'>Go Back</button> </div>")

    var goBackButton = document.getElementById("goBackButton");

    goBackButton.addEventListener("click", function()
    {
        studioHomePage();
    })

}

function studioHomePage() {
    if (localStorage.getItem("userId") != null) {
        studioWelcomePage();
    }
    else {
        moviePage.innerHTML = "";
        page.innerHTML = "";

        header.innerHTML = "<div class='header'><h1> Studio </h1></div>";
        page.insertAdjacentHTML("afterbegin", "<div class='test'><button id='loginStudio' class='loginBtn'>Login</button><button id='registerStudio' class='registerBtn'>Register</button></div>")

        var loginButton = document.getElementById("loginStudio");
        var registerButton = document.getElementById("registerStudio");

        loginButton.addEventListener("click", function () {
            header.innerHTML = "";
            page.innerHTML = "";
            page.insertAdjacentHTML("afterbegin", "<form class='box'><h1>Login</h1><input type='text' value='Username' id='Username'><input type='password' value='Password' id='Password'><input type='submit' value='Login' id='Login''></form>")

            var submitbutton = document.getElementById("Login");

            submitbutton.addEventListener("click", function () {
                var getUsername = document.getElementById("Username").value;
                var getPassword = document.getElementById("Password").value;
                moviePage.innerHTML = "";
                page.innerHTML = "";

                fetch('https://localhost:5001/api/filmstudio')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        console.log(json);

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
            header.innerHTML = "";
            page.innerHTML = "";
            page.insertAdjacentHTML("afterbegin", "<form class='box'><h1>Login</h1><input type='text' value='Username' id='Username'><input type='password' value='Password' id='Password'><input type='submit' value='Register' id='saveButton''></form>")

            var saveButton = document.getElementById("saveButton");

            saveButton.addEventListener("click", function()
            {
                var studioname = document.getElementById("Username").value;
                var password = document.getElementById("Password").value;

                moviePage.innerHTML = "";
                page.innerHTML = "";

                console.log(studioname, password);
                addStudio(studioname, password);
            })
        })

    }

}

function addStudio(username, password)
{
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

        printStudioList();
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}

var studioList = document.getElementById("studioList");

function printStudioList()
{
    fetch('https://localhost:5001/api/filmstudio')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        studioList.innerHTML = "";
        moviePage.innerHTML = "";
        header.innerHTML = "";

        for (i = 0; i < json.length; i++)
        {
            console.log(json[i].name)

            studioList.insertAdjacentHTML("beforeend", "<div> <li> " + json[i].name + "</li></div>")
        }
    })
}

adminPage.addEventListener("click", function () {
    moviePage.innerHTML = "";
    header.innerHTML = "";
    page.innerHTML = "";

    page.insertAdjacentHTML("afterbegin", "<form class='box'><h1>Login</h1><input type='text' value='Username' id='Username'><input type='password' value='Password' id='Password'><input type='submit' value='Login' id='Login'></form>")
})