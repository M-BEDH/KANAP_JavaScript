confirmationCommande();

function confirmationCommande(){
    //endroit inscription dans le fichier html
    const confirmation = document.querySelector('#orderId');
    
    //recupération de l'orderId
    let url = window.location.href;
    let orderId = new URL(url).searchParams.get("orderId");
    
    // Ecriture dans le html
  confirmation.innerHTML = orderId;
};

clearLocalStorage();
// Fonction pour effacer le localStorage une fois la commande validée
function clearLocalStorage(){
  let myKeys = Object.keys(localStorage);
  localStorage.clear(myKeys);
};