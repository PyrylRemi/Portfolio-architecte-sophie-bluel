
// =========================  Etape 1.2
const fetchCategories = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            console.error("Erreur API dans la récupération des catégories");
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur dans la récupération des catégories");
        return [];
    }
};

const categoryMenu = document.querySelector(".category-menu");

const generateCategoryMenu = async () => {
    const categories = await fetchCategories();
    categoryMenu.innerHTML = ""; // On vide le menu avant de le remplir

    // Ajout d'un bouton "Tous" pour afficher tous les travaux
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.dataset.categoryId = "all";
    allButton.classList.add("active");
    categoryMenu.appendChild(allButton);

    // Ajout des boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        categoryMenu.appendChild(button);
    });

    // Gestion des clics pour filtrer les works
    categoryMenu.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            filterWorks(event.target.dataset.categoryId);
            document.querySelectorAll(".category-menu button").forEach(btn => btn.classList.remove("active"));
            event.target.classList.add("active");
        }
    });
};

generateCategoryMenu();

const filterWorks = (categoryId) => {
    gallery.innerHTML = ""; // On vide la galerie avant d'afficher les résultats

    const filteredWorks = categoryId === "all" ? allWorks : allWorks.filter(work => work.categoryId == categoryId);

    filteredWorks.forEach(work => {
        const figureWork = createFigure(work);
        gallery.appendChild(figureWork);
    });
};


//=========================


//declaration des variables
const gallery = document.querySelector(".gallery");


let allWorks = [];
 const fetchAllWorks = async ()=> {
    try {
        const response= await fetch ("http://localhost:5678/api/works");
        if(!response.ok){
            console.error("erreur API dans la recuperation des works");
        }
        const works = await response.json();
        allWorks.length = 0; //on vide le tableau au cas ou il contiens des éléments
        allWorks = works;
        console.log("ensemble des works est :" ,allWorks)
        for(let work of allWorks){
        const figureWork = createFigure(work);
        gallery.appendChild(figureWork);
        }
    } catch (error){
        console.error("erreur dans la recuperation des works");
    }
}

    fetchAllWorks();

//appeller l'API pour recupérer les catégories, gérer les appel réseaux, erreur HTTP

// fonction pour crée une figure html pour un work
const createFigure = (work) => {
    const figureWork = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    figureWork.appendChild(image);
    const subtitleWork = document.createElement("figcaption");
    subtitleWork.innerHTML = work.title;
    figureWork.appendChild(subtitleWork);
    return figureWork;
}
// on gère les elements lorsque connectée 
const token = localStorage.getItem("token");
const profile = document.querySelector(".profile");
console.log(token);

if (token) {
categoryMenu.style.display ="none";
profile.textContent = "logout";     
}

// gérer la deconexion 

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.querySelector(".profile");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.href = "index.html"; 
        });
    }
});