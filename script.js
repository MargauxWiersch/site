document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
});

const track = document.getElementById("carrousel-track");

const titre = document.getElementById("titre-projet");
const description = document.getElementById("description");
const date = document.getElementById("date");
const technique = document.getElementById("technique");
const imageProjet = document.getElementById("image");
const lienProjet = document.getElementById("lien-projet");

let projets = [];
let index = 0;
let interval;

// Mélanger les projets aléatoirement

function melangerProjets(tableau) {
    const melange = [...tableau];

    for (let i = melange.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [melange[i], melange[j]] = [melange[j], melange[i]];
    }

    return melange;
}

// Charger les données JSON

async function chargerProjets() {

    const reponse = await fetch("images.json");
    projets = await reponse.json();

    // Mélanger les projets avant de les afficher
    projets = melangerProjets(projets);

    afficherProjets();
}

// Créer les images

function afficherProjets() {

    projets.forEach((projet, i) => {

        const carte = document.createElement("button");

        carte.classList.add("carte");
        carte.type = "button";

        carte.innerHTML = `
            <img src="${projet.image}" alt="${projet.titre}">
        `;

        carte.addEventListener("click", () => {
            afficherInfos(i);
        });

        track.appendChild(carte);

    });

    // Dupliquer les images pour la boucle infinie

    projets.forEach((projet) => {

        const carte = document.createElement("button");

        carte.classList.add("carte");
        carte.type = "button";

        carte.innerHTML = `
            <img src="${projet.image}" alt="${projet.titre}">
        `;

        carte.addEventListener("click", () => {
            afficherInfos(projets.indexOf(projet));
        });

        track.appendChild(carte);

    });

    //afficherInfos(0);
    actualiserSelection();

    interval = setInterval(defiler, 3000);
}

// Afficher les informations

function afficherInfos(i) {

    const projet = projets[i];

    titre.textContent = projet.titre;
    description.textContent = projet.description;
    date.textContent = projet.date;
    technique.textContent = projet.technique;

    // Afficher l'image dans la partie gauche
    imageProjet.src = projet.image;
    imageProjet.alt = projet.titre;

    if (projet.lien) {
        lienProjet.href = projet.lien;
        lienProjet.style.display = "inline-block";
    } else {
        lienProjet.style.display = "none";
    }

    indexSelection = i;

    actualiserSelection();
}

// Défilement vertical

function defiler() {

    index++;

    const carte = track.querySelector(".carte");
    const hauteur = carte.offsetHeight;
    const gap = parseFloat(getComputedStyle(track).gap);

    const deplacement = hauteur + gap;

    track.style.transform = `translateY(-${index * deplacement}px)`;

    // Boucle infinie

    if (index >= projets.length) {

        setTimeout(() => {

            track.style.transition = "none";
            index = 0;

            track.style.transform = "translateY(0)";

            track.offsetHeight;

            track.style.transition = "transform 0.8s ease";

        }, 800);

    }
}

// Gestion de l'image sélectionnée

let indexSelection = 0;

function actualiserSelection() {

    const cartes = track.querySelectorAll(".carte");

    cartes.forEach((carte, i) => {

        const vraiIndex = i % projets.length;

        carte.classList.toggle(
            "active",
            vraiIndex === indexSelection
        );

    });
}

// Initialisation

chargerProjets();