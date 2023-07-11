 
 // Déclaration variable panier => un tableau
 let monPanier = [];
 
 // Récuperation de toutes les clés du localStorage 
 let myKeys = Object.keys(localStorage);
 
 // Boucle pour recuperer toutes les valeurs des clés  
 for (let i=0; i < myKeys.length; i ++){
  
  // Recuperation en objets (productsKanap) javascript (.parse) des valeurs des clés   
  let productsKanap = JSON.parse(localStorage.getItem(myKeys[i]));
  
  // push des éléments dans le tableau panier  
  // Le tableau panier contient tous les produits du localStorage
  monPanier.push(productsKanap);
};
// Boucle pour récuperer chaque valeur du panier ID pour chaque produits
for (let i=0; i < monPanier.length; i++){
  let id = monPanier[i].id;
  
  // Appel de l'API --> reponse json
  fetch('http://localhost:3000/api/products/'+id)
  .then(function(response) {
    return response.json();
  })
  
  .then(function(myJson){
    
    // Appel de la fonction pour écrire dans le html 
    // avec la clé du produit et le prix récupérer via api
    displayPanier(myKeys[i], myJson.price);
    
    // Appel de la fonction pour les évenements (addeventlistener) 
    //sûr input quantité(modification)
    addEventModif();
    
    // Appel de la fonction pour l'évenement du click supprimer 
    //(action addeventlistener) 
    addEventSuppr();
    
    // Appel de la fonction calcul des quantités totales + prix total
    calculQuantityAndTotal();
  });

  if(i === monPanier.length -1){
    calculQuantityAndTotal();
  };
};

//initialisation de la fonction pour l'input quantité, addevenlisterner
function addEventModif(){
  const inputsQuantity = document.getElementsByClassName('itemQuantity');
  
  for (let j= 0; j< inputsQuantity.length; j++){
    inputsQuantity[j].addEventListener('change', function(e){
      // appel de la fonction change quantite
      changeQte(e,this.value);
    });
  };
};

//initialisation de la fonction pour la classe supprimer, addevenlisterner
function addEventSuppr(){
  const supprimerArticle = document.getElementsByClassName('deleteItem');
  
  for (let k= 0; k< supprimerArticle.length; k++){
    supprimerArticle[k].addEventListener('click', function(e){
      //appel de la fonction supprimer 
      fonctionSupprimer(e);
      alert('Article Supprimé')
    });
  };
};

//initialisation de la fonction pour la suppression du produit du local storage
function fonctionSupprimer(e){
  
  let id = e.target.closest('article').dataset.id;
  let color = e.target.closest('article').dataset.color;
  
  localStorage.removeItem(id+color);
  e.target.closest('article').remove();
  calculQuantityAndTotal();
};

//initialisation de la fonction pour changer la quantité et la remplacer dans le local storage
function changeQte(e,newQuantity){
  
  let id = e.target.closest('article').dataset.id;
  let color = e.target.closest('article').dataset.color;
  let product =  JSON.parse(localStorage.getItem(id+color));
  
  if(newQuantity > 100 || newQuantity <= 0){
    alert('Quantité incorrecte')
    return false;
  } else {
    alert('Quantité changée')
    product.quantity = JSON.parse(newQuantity);
    localStorage.setItem(id+color,JSON.stringify(product));
    calculQuantityAndTotal();
  };
};

// initialisation de la fonction calcul des quantités totales et du prix total
// fonction asynchrone pour éviter les erreurs 
async function calculQuantityAndTotal()
{
  let sectionTotalQuantity = document.getElementById('totalQuantity');
  let sectionTotalPrice = document.getElementById('totalPrice');
  let quantiteTotale = 0;
  let totalPrice = 0;
  
  const articles = document.getElementsByClassName('cart__item');
  let quantity = document.getElementsByClassName('itemQuantity');
  if (articles.length === 0){
    sectionTotalQuantity.innerHTML  = 0;
    sectionTotalPrice.innerHTML = 0;
  };
  for(let i=0; i < articles.length; i++){
    let id = articles[i].dataset.id;
    let price = 0
    
    await  fetch('http://localhost:3000/api/products/'+id)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson){
      price = myJson.price;
      
      quantiteTotale += parseInt(quantity[i].value);
      totalPrice += quantity[i].value*price;
      
      if(i === (articles.length -1)){
        
        sectionTotalQuantity.innerHTML = quantiteTotale;
        sectionTotalPrice.innerHTML = totalPrice;
      };
    });
  };
};

//initialisation de la fonction pour écrire dans le html
function displayPanier(key, price){
  
  const sectionCartItemContent = document.querySelector("#cart__items");
  let product = JSON.parse(localStorage.getItem(key))
  
  sectionCartItemContent.innerHTML +=
  '<article class="cart__item" data-id="'+ product.id +'" data-color="'+ product.color+'">'+
  
  ' <div class="cart__item__img">'+
  ' <img src="'+product.img+' " alt="'+ product.altTxt +' ">'+ 
  '</div>'+
  '<div class="cart__item__content">'+
  ' <div class="cart__item__content__description">'+
  ' <h2>'+product.name+' </h2>'+
  ' <p> '+ product.color+'</p>'+
  ' <p>'+ price +'  €</p>'+
  '</div>'+
  ' <div class="cart__item__content__settings">'+
  
  '<div class="cart__item__content__settings__quantity">'+
  ' <p>Qté :  </p>'+
  '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value= '+ product.quantity +' >'+
  '</div>'+
  '<div class="cart__item__content__settings__delete">'+
  ' <p class="deleteItem" >Supprimer</p>'+
  ' </div>'+
  ' </div> '+
  ' </div>'+
  ' </article>'
};

//initialisation de la fonction pour l'input firstname
function addEventFirstName(){
  const firstName = document.getElementById('firstName');
  
  firstName.addEventListener('change', function(){
    validationFirstName(firstName.value);
  });
};
function validationFirstName(firstName){  
  const regexFirstNameAndLastName =  /^[a-zA-Z\-]{3,30}$/;

  if (firstName.match(regexFirstNameAndLastName)){
    return true;
  } else{
    alert("Prénom n'est pas valide");
    return false;
  };
};
addEventFirstName();

//initialisation de la fonction pour l'input lastName
function addEventLastName(){
  const lastName = document.getElementById('lastName');
  
  lastName.addEventListener('change', function(){
    validationLastName(lastName.value);
  });
};
function validationLastName(lastName){  
  const regexFirstNameAndLastName = /^[a-zA-Z\-]{2,30}$/;
  
  if (lastName.match(regexFirstNameAndLastName)){
    return true;
  } else{
    alert("Nom n'est pas valide");
    return false;
  };
};
addEventLastName();


//initialisation de la fonction pour l'input adress
function addEventAdress(){
  const address= document.getElementById('address');
  
  address.addEventListener('change', function(){
    validationAdress(address.value);
  });
};
function validationAdress(address){
  const regexAdress =  /^[a-zA-Z0-9\s\''\-]{3,50}$/;
  
  if(address.match(regexAdress)){
    return true
  } else {
    alert("adresse non valide");
    return false
  };
};
addEventAdress();


//initialisation de la fonction pour l'input city
function addEventCity(){
  const city= document.getElementById('city')
  
  city.addEventListener('change', function(){
    validationCity(city.value);
  });
};
function validationCity(city){
  const regexCity =  /^[a-zA-Z0-9\s\''\-]{3,50}$/;
  
  if (city.match(regexCity)){
    return true;
  }else{
    alert("Ville n'est pas valide");
    return false;
  };
};
addEventCity();


//initialisation de la fonction pour l'input email et vérification format email
function addEventEmail(){
  const email = document.getElementById('email');
  
  email.addEventListener('change', function(){
    validationEmail(email.value);
  });
};
function validationEmail(email){
  const regexValidationEmail = /[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/;
  if (email.match(regexValidationEmail)){
    return true;
  } else{
    alert(email + " : Cette adresse mail n'est pas valide");
    return false;
  };
};


// Récuperation d'un tableau des ID produits
function recupererTableauProductID(){
  let productID= [];
  let myKeys = Object.keys(localStorage);
  
  for (let i=0; i < myKeys.length; i ++){
    let product = JSON.parse(localStorage.getItem(myKeys[i]));
    productID.push(product.id);
  };
  
  if (productID.length != 0){
    //la conversion en Set (ensemble) permet de supprimer les doublons
    return Array.from(new Set(productID));
  } else {
    // Si panier vide alerte
   alert ('Panier vide');
    return false;
  };
};

// Action au click bouton commander 
const cartOrder = document.querySelector("#order")
cartOrder.addEventListener('click', function(e){
  (e).preventDefault();
  
  if (validationFirstName(firstName.value) != true || validationLastName(lastName.value) != true || validationAdress(address.value) != true || validationCity(city.value) != true || validationEmail(email.value) != true){
    alert("Le formulaire n'est pas valide");
  } else {
    submitFormulaire();
  };
});

// fonction pour soumettre le formulaire
function submitFormulaire(){
  let productID = recupererTableauProductID()
  const body = {
    contact : {
      firstName : firstName.value,
      lastName: lastName.value,
      address : address.value,
      city : city.value,
      email : email.value,
    },
    products : productID
  };
  
  //  requete post à l'api
  fetch("http://localhost:3000/api/products/order",{
  method: "POST",
  body: JSON.stringify(body),
  headers:{"Content-Type": "application/json"}
})
.then((response) => response.json())
.then((data) => 
// le data contient l'objet contact et le tableau de string de l'id des produits + l'orderId
{ 
  const orderId = data.orderId;  
  if(data.orderId != null || data.orderId != undefined){
    window.location.href = "confirmation.html" + "?orderId=" + orderId;
    return (data); 
  } else{
    alert('Commande invalide')
    return false;
  };
});
};



