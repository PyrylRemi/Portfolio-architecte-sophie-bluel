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
