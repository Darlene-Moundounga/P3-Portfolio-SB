//Déclarer l'URL
const worksURL = "http://localhost:5678/api/works"

function createFigure(work) {
    //créer l'élément img et lui donner sa source
    const imageElement = document.createElement("img")
    imageElement.src = work.imageUrl
    //créer l'élément figcaption et lui assigner son texte
    const captionElement = document.createElement("figcaption")
    captionElement.innerText = work.title
    //créer la figure
    const figureElement = document.createElement("figure")
    //inclure les 2 éléments enfants dans l'élément parent
    figureElement.appendChild(imageElement)
    figureElement.appendChild(captionElement)
    //inclure la figure dans son élément parent 
    document.querySelector(".gallery").appendChild(figureElement)
}

//Appel API
fetch(worksURL) // retourne une promesse
.then(data => data.json()) //récupère les données json
.then(
    function(works){ // récupérer le tableau des works
        localStorage.setItem("works", JSON.stringify(works))
        works.forEach(work => {
            createFigure(work)
        });

        //FILTRER LA GALERIE PAR CATEGORIE
        //récuperer les catégories via l'API
        const categoriesURL = "http://localhost:5678/api/categories"
        fetch(categoriesURL)
        .then(categoriesData => categoriesData.json())
        .then(
            function(categories) {
                localStorage.setItem("categories", JSON.stringify(categories))
                categories.forEach(category => {
                    const categoryButton = document.createElement("button")
                    categoryButton.innerText = category.name
                    document.querySelector(".filters").appendChild(categoryButton)

                    categoryButton.addEventListener("click", () => {
                       document.querySelector(".gallery").innerHTML = ""
                       const filteredWorks = works.filter(function(work) {
                            return work.categoryId == category.id
                       })
                       // Afficher les categories filtrées
                       filteredWorks.forEach(filteredWork => {
                            createFigure(filteredWork)
                       });
                    })
                });
            }
        )
        // catégorie all
        const allButton = document.getElementById("all")
        allButton.addEventListener("click", () => {
            document.querySelector(".gallery").innerHTML = ""
            works.forEach(work => {
                createFigure(work)
            });
        })
    }
)
