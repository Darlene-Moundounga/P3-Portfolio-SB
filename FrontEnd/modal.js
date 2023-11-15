// récupérer token
const token = sessionStorage.getItem("token")

//quand l'utilisateur est connecté
if (token != null) {
    //apparition de la section "mode édition", du bouton modifier et du logout
    document.querySelector(".editionMode").style.display="flex"
    document.querySelector("header").style.margin = "0 0 92px 0"
    const connectBtn = document.querySelector(".linkLogin")
    connectBtn.innerText = "logout"
    connectBtn.addEventListener("click", () => {
        sessionStorage.clear()
        window.location.href = "http://127.0.0.1:5500/index.html"
    })
    document.querySelector(".modifier").style.display = "flex"

    //disparition des filtres
    document.querySelector(".filters").style.display = "none"
    document.querySelector(".headerWorks").style.margin = "0 0 92px 0"
    const modifBtn = document.querySelector(".modifBtn")
    const iconModif = document.querySelector("#iconModif")
    
    //ce qui se passe au clic du bouton modifier (apparition de la modale)
    const modale = document.querySelector("#modale")
    function modifierSection(element) {
    element.addEventListener("click", () => {
        modale.style.display = "flex"
        document.querySelector("html").style.backgroundColor = "rgba(0, 0, 0, 0.30)"
        defineBrightness(".gallery",0.5)
        defineBrightness("#introduction",0.5)
        displayModalePhotosActualized()
    })}
    modifierSection(modifBtn)
    modifierSection(iconModif)

    // ce qui se passe au clic du boutton "x" de la modale
    closeButton = document.querySelector(".closeButton").addEventListener("click", () => {
        hideModale(modale)
    })

    //quand on clique en dehors de la modale
    document.querySelector("html").addEventListener("click", (event) => {
        if (!event.target.classList.contains("modale") ) {
            hideModale(modale)
        }
    })
}

function hideModale(modale) {
    modale.style.display = "none"
    document.querySelector("html").style.backgroundColor = "white"
    defineBrightness(".gallery",1)
    defineBrightness("#introduction",1)
}

function defineBrightness(element, brightness) {
    document.querySelector(element).style.filter = "brightness(" + brightness +")" 
}

function displayModalePhotosActualized() {
    document.querySelector(".container-works").innerHTML = ""
    let works = JSON.parse(localStorage.getItem("works"))
    works.forEach(work => {
        //afficher les works dans la modale
        displayWorkWithTrashIcon(work)
    });
}

//suppression des works au clic de l'icone "trash"
function displayWorkWithTrashIcon(work) {
    const container = document.createElement("div")
    const img = document.createElement("img")
    img.classList.add("modale","work")
    img.src = work.imageUrl
    const trashContainer = document.createElement("div")
    trashContainer.classList.add("modale","trash")
    container.appendChild(img)
    container.appendChild(trashContainer)
    const icon = document.createElement("i")
    icon.classList.add("modale","fa-solid","fa-trash-can")
    icon.style.color = "white"

    icon.addEventListener("click", async () => {
        const deleteURL = "http://localhost:5678/api/works/"+ work.id

        let result = await fetch(deleteURL, {
            method: "DELETE",
            headers: {Authorization: 'Bearer '+ token}
        })
        
        if(result.status == 204) {
            window.location.href="http://127.0.0.1:5500/index.html"
        }
    })

    trashContainer.appendChild(icon)
    document.querySelector(".container-works").appendChild(container)
}

// Au click sur le bouton 'ajouter une photo' => modifier modale
const addButton = document.querySelector(".addButton")
const validButton = document.querySelector(".valider")
addButton.addEventListener("click", () => {
    const modaleTitle = document.querySelector(".title")
    modaleTitle.innerText = "Ajout photo"
    addButton.style.display =  "none"
    validButton.style.display = "block"
    validButton.style.backgroundColor = "#A7A7A7" 
    document.querySelector(".container-works").style.display="none"
    document.querySelector(".addPhotoSection").style.display="block"
})

//au clique sur l'icone de retour=> retour à la page des works
const iconBack = document.querySelector(".iconBack")
iconBack.addEventListener("click", () => {
    const modaleTitle = document.querySelector(".title")
    modaleTitle.innerText = "Galerie Photo"
    addButton.innerText = "Ajouter une photo"
    addButton.style.backgroundColor = "#1D6154" 
    document.querySelector(".container-works").style.display="grid"
    document.querySelector(".addPhotoSection").style.display="none"
    validButton.style.display ="none"
    addButton.style.display = "block"
})

//récupération des catégories
let categories = JSON.parse(localStorage.getItem("categories"))
generateOptions()

function generateOptions(){
    categories.forEach(category => {
        const option = document.createElement("option")
        option.innerText = category.name
        option.value = category.id
        document.getElementById("categories").appendChild(option)
    });
}

// Récupérer le fichier sélectionné(img) en js
const inputPhoto = document.getElementById("photo")
const imageUploaded = document.getElementById("imageUploaded")
imageUploaded.classList.add("modale")
inputPhoto.onchange = function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // afficher l'image
    reader.onload = function(img) {
        imageUploaded.src = img.target.result;
        imageUploaded.style.width = "129px"
        imageUploaded.style.height ="169px"
        document.querySelector(".addPhotoButton").style.opacity = "0"
        
        const photoTitle = document.getElementById("title")
        photoTitle.onchange = () => {
            if (photoTitle.value.length >= 5) {
                document.querySelector(".valider").style.backgroundColor = "#1D6154" 
            }else{
                validButton.style.backgroundColor = "#A7A7A7"
            }
        }
    };

reader.readAsDataURL(file);
};

//POST des nouveaux works

const form = document.querySelector(".modale form")
addButton.addEventListener("click", (event) => {
    event.preventDefault()
})

//message d'erreur quand le form n'est pas rempli
const errorMessage = document.querySelector(".errorMessage")
let title = document.querySelector('input[name="title"]')
const baseLink = "http://127.0.0.1:5500/index.html"
const imageForm = document.querySelector('input[type="file"]').files[0]

title.addEventListener("change", () => {
    title = title
})

validButton.addEventListener("click", (e)=> {
    if(imageUploaded.src == baseLink) {
        displayErrorMsg()
        e.preventDefault()
    } else if(imageUploaded.src != baseLink) {
        if(title.value.trim() == "") {
            displayErrorMsg()
            e.preventDefault()
        } else {
            sendWork()
        }
    }
})

function displayErrorMsg() {
    errorMessage.style.display = "block"
    document.querySelector(".title").style.margin = "45px 0 26px 0"
    imageUploaded.style.top ="138px"
}
// Détecter que le submit du formulaire fonctionne
function sendWork() {
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        
        //récupérer les données du form
        const imageForm = document.querySelector('input[type="file"]').files[0]
        const titleForm = document.querySelector('input[name="title"]').value
        const categoryForm = document.querySelector('select[name="categories"]').value
    
        const formData = new FormData()
        formData.append("image",imageForm)
        formData.append("title",titleForm)
        formData.append("category",categoryForm)
    
        //envoyer les données 
        let result = await fetch("http://localhost:5678/api/works",{
            method: "POST",
            body: formData,
            headers: {Authorization: 'Bearer '+ token}
        });
        // Refresh la page uniquement si on est sûr que le work a bien été ajouté
        if(result.status == 201) {
            window.location.href="http://127.0.0.1:5500/index.html"
        }
    })
}

