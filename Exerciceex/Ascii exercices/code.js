// DOM Initialization.
window.onload = () => {
  // Variables
  let rows = 0; // sstocke le nombre de lignes de la grille.
  let cols = 0; // Stocke le nombre de colonnes de la grille.
  let currentHue = Math.floor(Math.random() * 360); // Commence avec une teinte aléatoire pour les couleurs.

  // Constants
  const timeout = 2000; // Durée pour la première animation.
  const timeout2 = 500; // Durée pour la  2eme animation.
  const timeout3 = 500; // Durée pour la 3 anim
  const primary = ";"; // ; pour chaque cellule pour qu'on voit la cellule même vide).

  // Groupes de caractères pour les animations
  const center = ['i', 'i', 'i']; // Caractères 1 centre.
  const tertiary = ['c', 'h', 'o', 'l', 'a', 'a']; // caractere deux centre
  const secondary = ['\\', '/', '|', '-', '_', '&boxv;', '&boxh;', '&boxvl;', '&boxhd;', '&boxhu;']; // Caractères du troisième cercle.

  const max = 7; // Rayon du premier cercle autour du centre.
  const max2 = 3; // Rayon cercle2  autour du centre.

  //  je crois f(X) pour calculer la taile de la grille
  const calculateGridSize = () => {
    //  moe je suis pas sur mais je crée un élémnt temporaire pour mesurer la taille d'une cellule
    const testSpan = document.createElement('span'); // Span temporaire.
    testSpan.innerHTML = 'JE TEST'; // On met le caractère de base pour mesurer.
    testSpan.style.visibility = 'hidden'; // Invisible à l'écran mais prend de la place.
    document.body.appendChild(testSpan);

    // Mesure largeur et hauteur d'une cellule
    const cellWidth = testSpan.offsetWidth; //  L cellule
    const cellHeight = testSpan.offsetHeight; // H cellule 

    document.body.removeChild(testSpan); // le span ne sert plus a rien c'est juste pour tester donc tchao

    // Calcule le nombre de colonnes et de lignes selon la taille de la fenêtre
    cols = Math.floor(window.innerWidth / cellWidth) + 4; // ptit surplux pour etre sur que ca rempli bien t'as compris
    rows = Math.floor(window.innerHeight / cellHeight) + 1; // la meme 

    // Fonction appelée à chaque fois que la souris survole une cellle
    const ballChanger = (e) => {
      console.log(e.target); // Affiche l'élément sur lequel la souris est passée ou alors ca afiche juste la souris jsp 
      currentHue += 2; // Change UN TOUT PITIT PEU  la teinte pour les couleurs

      //cette partie la est inconnnu au bataillon
      const [rowStr, colStr] = e.target.id.split('-');
      const x = Number(rowStr.slice(2));
      const y = Number(colStr); // Colonne

      //Alors je suis aps sur du tout mais je crois que ca parcourt toutes les cellules pour appliquer l'animation selon la distance
      for (let k = 0; k < rows; k++) { // Boucle sur les lignes ca c'est sur mais pk je sais pas 
        for (let l = 0; l < cols; l++) { // Boucle sur les colonnes je suis sur aussi mais jsp a quoi ca sert 
          const item = document.querySelector(`#id${k}-${l}`); // Sélectionne la cellule va savoir pk
          if (!item) continue; // Si la cellule n'existe pas, passe à la suivante

          // Calcul de la distance de monsieur moen locoz , pour savoir la distance entre la cellule d'avant et celle de actuel 
          const distance = Math.sqrt((k - x) ** 2 + (l - y) ** 2);
          console.log(distance); // Affiche la distance dans la console

          //  ca cest sur nimation selon la distance
          if (distance === 0) {
            // Centre
            animateItem(item, randomFromArray(center), timeout * Math.random() + timeout, 'shadow');
          } else if (distance <= max) {
            // Premier cercle autour du centre
            animateItem(item, randomFromArray(tertiary), timeout2 * Math.random() + timeout2, `circle${k % 3}`);
          } else if (distance <= max2) {
            // Deuxième cercle autour du centre
            animateItem(item, randomFromArray(secondary), timeout3 * Math.random() + timeout3, `circle${k % 3}`);
          }
        }
      }
    }

    // Fonction utilitaire pour prendre un élément aléatoire dans un tableau
    const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

    // Fonction pour gérer l'animation d'une cellule
    const animateItem = (item, char, delay, extraClass) => {
      // Début de l'animation après un DELAI D'ATTENTE 
      setTimeout(() => {
        item.innerHTML = char; // Change le caractère de la cellule
        item.style.backgroundColor = `hsla(${currentHue % 360}, 00%, 0%, .8)`; // Culeur de fond
        item.style.color = `hsla(${(currentHue + 180) % 360}, 100%, 70%, 1)`; // ouleur du texte
        item.classList.add(extraClass); // Ajoute la classe CSS pour animation supplémentaire
      }, delay);

      // Fin de l'animation : revient à l'état initial
      setTimeout(() => {
        item.innerHTML = primary; // Reviens au caractère initial
        item.style.backgroundColor = `hsla(${currentHue % 360}, 100%, 50%, .3)`; // Couleur de fond atténuée
        item.classList.remove(extraClass); // Retire la classe CSS
      }, delay * 2);
    };

    // Fonction pour créer la grille dans le jsp quoi 
    const buildBrid = () => {
      for (let i = 0; i < rows; i++) { // boucle sur les lignes pourquoi faire jsp
        for (let j = 0; j < cols; j++) { // Boucle sur les colonnes de meme  
          const span = document.createElement('span'); // Crée un span pour chaque cellule
          span.id = `id${i}-${j}`; // Nom unique pour la cellule basé sur sa position
          span.innerHTML = primary; // Remplit avec le caractère initial
          span.addEventListener('mouseover', ballChanger); // Ajoute l'écouteur de survol
          document.body.appendChild(span); // Ajoute la cellule au DOM
        }
        document.body.appendChild(document.createElement('br')); // Nouvelle ligne
      }
    }

    // Initialisation
    calculateGridSize(); // Calcule la taille de la grille
    buildBrid(); // Construit la grille
    // console.log(cols, rows); // Affiche le nombre de colonnes et lignes (debug)
  };
}