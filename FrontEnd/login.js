//récupérer le bouton 
const loginButton = document.querySelector(".button-login")
//Ajouter un évenement sur le bouton "se connecter"
loginButton.addEventListener("click", (event) => {

    event.preventDefault()
    const mail = document.getElementById("email").value
    const password = document.getElementById("password").value
    let regExp = new RegExp("[a-z0-9.]+@[a-z0-9.]+\.[a-z0-9._-]+")
    let result = regExp.test(mail)
    const error = document.querySelector(".error")

    if (result) {
        //conditions mail et mot de passe
        if (mail != "sophie.bluel@test.tld" || password != "S0phie") {
            error.textContent = "E-mail ou mot de passe incorrect !"
        } else {
            // Sinon si c'est ok = envoyer requête pour se connecter
            login(mail, password)
            alert("Vous êtes connecté. Vous allez être redirigé à l'accueil !")
            //Rediriger vers l'accueil
            window.location.href="http://127.0.0.1:5500/index.html"
        }
    } else {
        error.textContent = "Veuillez entrer un email valide."
    }
       
}
)

function login(mail, password) {
    const loginURL = "http://localhost:5678/api/users/login"
        fetch(
            loginURL, {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                email: mail,
                password: password
              })
            }
        ) 
        .then(data => data.json())
        .then(
            function(userInfos) {
                sessionStorage.setItem("token", userInfos.token)
            }
        )
}


