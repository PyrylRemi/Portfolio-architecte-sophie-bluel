// ========== Catégories ==========
let allCategories = [];
const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      if (!response.ok) throw new Error("Erreur API catégories");
      allCategories = await response.json();
      console.log ("toute les catégorie",allCategories)
      return allCategories ;
    } catch (error) {
      console.error("Erreur dans la récupération des catégories");
      return [];
    }
  };
  
  const categoryMenu = document.querySelector(".category-menu");
  
  const generateCategoryMenu = async () => {
    const categories = await fetchCategories();
    categoryMenu.innerHTML = "";
  
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.dataset.categoryId = "all";
    allButton.classList.add("active");
    categoryMenu.appendChild(allButton);
  
    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.dataset.categoryId = category.id;
      categoryMenu.appendChild(button);
    });
  
    categoryMenu.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        filterWorks(event.target.dataset.categoryId);
        document.querySelectorAll(".category-menu button").forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");
      }
    });
  };
  
  generateCategoryMenu();
  
  // ========== Affichages Works ==========
  const gallery = document.querySelector(".gallery");
  let allWorks = [];
  
  const fetchAllWorks = async () => {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) throw new Error("Erreur API works");
      const works = await response.json();
      allWorks = works;
      displayGallery(allWorks);
    } catch (error) {
      console.error("Erreur dans la récupération des works");
    }
  };
  
  const displayGallery = (works) => {
    gallery.innerHTML = "";
    works.forEach(work => {
      const figureWork = createFigure(work);
      gallery.appendChild(figureWork);
    });
  };
  
  const filterWorks = (categoryId) => {
    const filteredWorks = categoryId === "all" ? allWorks : allWorks.filter(work => work.categoryId == categoryId);
    displayGallery(filteredWorks);
  };
  
  const createFigure = (work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
  
    const caption = document.createElement("figcaption");
    caption.textContent = work.title;
  
    figure.appendChild(image);
    figure.appendChild(caption);
    return figure;
  };
  
  // ========== Authentification ==========
  const token = localStorage.getItem("token");
  const logout = document.querySelector("#logout");
  const modifier = document.querySelector(".modifier");
  const edition = document.querySelector(".edition");
  let connected = false;
  
  document.addEventListener("DOMContentLoaded", () => {
    if (token) connected = true;
  
    if (connected) {
      categoryMenu.style.display = "none";
      logout.textContent = "logout";
      edition.style.display = null;
    } else {
      categoryMenu.style.display = "flex";
      modifier.style.display = "none";
      edition.style.display = "none";
    }
  
    fetchAllWorks(); 
    

    // Gestion du bouton "logout"
    logout.addEventListener("click", () => {
      if (connected) {
        localStorage.removeItem("token");
        logout.textContent = "login";
        logout.href = "index.html";
      } else {
        window.location.href = "index.html";
      }
    });



    // Modale 1
    const modal = document.getElementById("modal");
    const closeModalBtn = document.querySelector(".close");
  
    modifier.addEventListener("click", () => {
      modal.style.display = "flex";
      firstModal.style.display = "block";
      document.querySelector(".modal").style.backgroundColor ="rgba(0, 0, 0, 0.5)";
      displayModalGallery(allWorks);
      modalAjout.style.display = "none";

    });
  
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  
  // ========== Modale : images ==========
  function displayModalGallery(works) {
    const modalGallery = document.getElementById("modal-gallery");
    modalGallery.innerHTML = "";
  
    works.forEach(work => {
      const figure = document.createElement("figure");
      figure.style.position = "relative";
  
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
  
      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash-can", "delete-icon");
      trash.dataset.id = work.id; 
  
      // Ajout du gestionnaire de suppression
      trash.addEventListener("click", async () => {
        const confirmed = confirm("Supprimer ce projet ?");
        if (confirmed) {
          await deleteWork(work.id);
        }
      });
      figure.appendChild(img);
      figure.appendChild(trash);
      modalGallery.appendChild(figure);
    });
  }
  
  // Modale : Suprimer une images
  const deleteWork =async (workId)=> {
    try {
      const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Mise à jour du tableau
        allWorks = allWorks.filter(work => work.id !== workId);
  
        // Recharger les vues
        displayGallery(allWorks); // mise à jour de la galerie principale
        displayModalGallery(allWorks); // mise à jour de la modale
        // Fermer laa modale ici
        firstModal.style.display ="none";
        document.querySelector(".modal").style.backgroundColor ="rgba(0, 0, 0, 0)";
      } else {
        alert("La suppression a échoué.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  }
  



  // test JS téléversement

const boutonAjouterPhoto = document.querySelector(".ajouter-photo-btn"); 
const modaleAjout = document.getElementById("modale-ajout-photo");
const boutonFermer = document.querySelector(".fermer-modale");
const boutonRetour = document.querySelector(".retour-modale");
const selectCategorie = document.getElementById("categorie-photo");
const formulaireAjout = document.getElementById("formulaire-ajout-photo");

const categoriesDropdown = () => {
  selectCategorie.innerHTML = "";
  const optionDefault = document.createElement("option");
  selectCategorie.appendChild(optionDefault);
  allCategories.forEach((categorie)=>{
    const option= document.createElement("option");
    option.value = categorie.name;
    option.innerHTML = categorie.name;
    option.id = categorie.id
    selectCategorie.appendChild(option);
  })
}

// Ouvrir la modale 2
const firstModal = document.querySelector(".modal-content");
if (boutonAjouterPhoto) {
  boutonAjouterPhoto.addEventListener("click", () => {
    modaleAjout.style.display = "flex";
    firstModal.style.display = "none";
    categoriesDropdown();
    changerCouleurButton();
    resetFormulaire();
  });
}

// Fermer modale (croix et fleche)
if (boutonFermer) {
  boutonFermer.addEventListener("click", () => {
    modaleAjout.style.display = "none";
    modalGalerie.style.display ="none";
    resetFormulaire();
  });
}
if (boutonRetour) {
  boutonRetour.addEventListener("click", () => {
    modaleAjout.style.display = "none";
    firstModal.style.display = "block";
    resetFormulaire();
  });
}

// afficher la prévisualisation
const inputFichier = document.getElementById("input-photo");
const imageApercu = document.getElementById("apercu-image");

inputFichier.addEventListener("change", (event) => {

  const fichier = event.target.files[0];
  const ACCEPTED_EXTENSIONS = ["png","jpg"];
  const fileName = fichier.name ;
  const extension = fileName.split(".").pop().toLowerCase();

  if (fichier && fichier.size <= 4 * 1024 * 1024 &&  ACCEPTED_EXTENSIONS.includes(extension) ) {
    const reader = new FileReader();
    reader.onload = (e)=> {
    imageApercu.src = e.target.result;
    imageApercu.style.display = "flex";
    document.querySelector(".label-televersement p").style.display = "none";
    document.querySelector(".label-televersement i").style.display = "none";
    document.querySelector(".label-televersement span").style.display = "none";
    };
    reader.readAsDataURL(fichier);
  } else {
    console.error("l'image ne respecte pas les critères");
  }
});

// gerer le chagement de couleur du bouton valider

formulaireAjout.addEventListener("submit",async(e)=>{
e.preventDefault(); //empeche de  faire la soumission du formulaire par default
await connect();
})

//Pour transformer l'image en blob (binary large object) afin de faciliter le televersement.
const convertDataURLToBlob = async (dataurl) => {
  const res = await fetch(dataurl);
  return await res.blob();
};

const connect = async () => {
  const title = document.getElementById("titre-photo").value;
  const select = document.getElementById("categorie-photo");
  const optionName = select.options[select.selectedIndex].innerText;
  const optionId = select.options[select.selectedIndex].id;
  const selectedFile = inputFichier.files[0];

  const reader = new FileReader();
  reader.onloadend = async (event)=> {
    const base64String = event.target.result;
    const blobImg = await convertDataURLToBlob(base64String);

    const formData = new FormData();
    formData.append("image",blobImg);
    formData.append("category",optionId);
    formData.append("title",title);

    uploadWorkToDataBase(token,formData);
  }
    reader.readAsDataURL(selectedFile);
}

  // methode pour ajouter un work a la BDD depuis la gallerie

   const uploadWorkToDataBase = async (token, formData,) => {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      console.log("il ajoute",newWork)
      // Ajouter dans le tableau
      allWorks.push(newWork);
      displayGallery(allWorks);
      displayModalGallery(allWorks);

        // Fermer toutes les modales et revenir à la page principale

      // Réinitialiser l’interface
      resetFormulaire();
      document.getElementById("apercu-image").style.display = "none";
      document.querySelector(".label-televersement p").style.display = "block";
      document.querySelector(".label-televersement i").style.display = "block";
      document.querySelector(".label-televersement span").style.display = "block";
      modaleAjout.style.display = "none";
      firstModal.style.display ="none";
      modal.style.display = "flex";
      document.querySelector(".modal").style.backgroundColor ="rgba(0, 0, 0, 0)";
      
      

      alert("Work ajouté !");
    } else {
      alert("Erreur dans l'ajout du Work.");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    alert("Une erreur est survenue.");
  }


};

   const validateButton = document.querySelector(".bouton-valider-ajout");
   const champs = formulaireAjout.querySelectorAll("input");
    const selects = formulaireAjout.querySelectorAll("select");
   const buttonColor = () => {
    
    for(let select of selects){
      if(!select.value) {
        return false;
      }
    }
    for(let champ of champs){
      if(!champ.value) {
        return false;
      }
    }
    return true;
   }

   const changerCouleurButton = () => {
    if (buttonColor()){
      validateButton.style.backgroundColor = "#1D6154";
      validateButton.style.cursor = "pointer";
    } else {
      validateButton.style.backgroundColor = "";
    }
   }

   for(let champ of champs){
    champ.addEventListener("input",changerCouleurButton);
   }

   for(let select of selects){
    select.addEventListener("input",changerCouleurButton);
   }

   const resetFormulaire = () => {
    formulaireAjout.reset();
    imageApercu.src = "";
    imageApercu.style.display = "none";
    document.querySelector(".label-televersement p").style.display = "block";
    document.querySelector(".label-televersement i").style.display = "block";
    document.querySelector(".label-televersement span").style.display = "block";
   }


   // retour arriere entre les modales
   const backArrow = document.querySelector(".retour-modale");
  const modalAjout = document.getElementById("modale-ajout-photo");
  const modalGalerie = document.getElementById("modal");
  backArrow.addEventListener("click", () => {
  modalAjout.style.display = "none";   
  modalGalerie.style.display = "flex";  
});

  // fermer le modale ajout photos

  const closeAjout = document.querySelector(".fermer-modale"); 
const modalsAjout = document.getElementById("modale-ajout-photo"); 
const modalsGalerie = document.getElementById("modal");            

closeAjout.addEventListener("click", () => {
  modalsAjout.style.display = "flex";
  modalsGalerie.style.display = "none"; 
});