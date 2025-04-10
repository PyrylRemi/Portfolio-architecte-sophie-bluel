// ========== Catégories ==========
const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      if (!response.ok) throw new Error("Erreur API catégories");
      return await response.json();
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
        window.location.href = "index.html";
      } else {
        window.location.href = "login.html";
      }
    });
  
    // Modale
    const modal = document.getElementById("modal");
    const closeModalBtn = document.querySelector(".close");
  
    modifier.addEventListener("click", () => {
      modal.style.display = "flex";
      displayModalGallery(allWorks);
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
      trash.dataset.id = work.id; // 🔑 stocke l'ID du projet
  
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
  async function deleteWork(workId) {
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
      } else {
        alert("La suppression a échoué.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  }
  



