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
    const roundedDate = roundToNextHalfHour(date);
  
    // Extraire les différentes parties de la date
    const dayName = daysOfWeek[roundedDate.getDay()];
    const day = roundedDate.getDate();
    const month = months[roundedDate.getMonth()];
    const year = roundedDate.getFullYear();
  
    // Extraire l'heure et les minutes
    const hours = roundedDate.getHours();
    const hoursMinusOne = hours -1;
    const hoursPlusOne = hours +1;
    const hoursMinusOneFormatted = hoursMinusOne.toString().padStart(2, "0"); // Format avec deux chiffres
    const hoursPusOneFormatted = hoursPlusOne.toString().padStart(2, "0"); // Format avec deux chiffres
    const minutes = roundedDate.getMinutes().toString().padStart(2, "0");

    return `Arrivée de notre technicien le ${dayName} ${day} ${month} ${year} entre  ${hoursMinusOneFormatted}h${minutes} et ${hoursPusOneFormatted}h${minutes}`
  
    // Retourner la date formatée
    return `${dayName} ${day} ${month} ${year} à ${hours}h${minutes}`;
  }

  function roundToNextHalfHour(date: Date): Date {
    const newDate = new Date(date); // Créer une copie de la date originale pour éviter de la modifier
    const minutes = newDate.getMinutes();

    if (minutes > 0 && minutes <= 30) {
        newDate.setMinutes(30, 0, 0); // Si les minutes sont entre 1 et 30, arrondir à 30
    } else if (minutes > 30) {
        newDate.setMinutes(0, 0, 0); // Si les minutes sont entre 31 et 59, arrondir à l'heure suivante
        newDate.setHours(newDate.getHours() + 1); // Incrémenter l'heure
    }

    return newDate;
}