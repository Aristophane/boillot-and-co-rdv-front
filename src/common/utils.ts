export function scrollToElementById(elementId: string) {
    const element = document.getElementById(elementId);
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth', // défilement fluide
        block: 'start',     // défile jusqu'au début de l'élément
      });
    } else {
      console.warn(`Élément avec l'ID ${elementId} introuvable.`);
    }
  }

  export function formatDate(dateStr: string): string {
    // Dictionnaire des jours de la semaine et des mois en français
    const daysOfWeek = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
  
    // Convertir la chaîne en objet Date
    const date = new Date(dateStr.replace(" ", "T")); // Remplacement de l'espace par un 'T' pour rendre la chaîne compatible avec le constructeur Date
  
    // Extraire les différentes parties de la date
    const dayName = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    // Extraire l'heure et les minutes
    const hours = date.getHours().toString().padStart(2, "0"); // Format avec deux chiffres
    const minutes = date.getMinutes().toString().padStart(2, "0");
  
    // Retourner la date formatée
    return `${dayName} ${day} ${month} ${year} à ${hours}h${minutes}`;
  }