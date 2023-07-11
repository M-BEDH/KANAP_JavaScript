// Creation nouvelle url avec id par produit
let url = window.location.href;
let id = new URL(url).searchParams.get("id");
// Appel de l'API --> reponse json
fetch('http://localhost:3000/api/products/'+id)
.then(function(response) {
  return response.json();
})

// Emplacement de l'affichage information produit sur la page html
.then(function(myJson) {
  const sectionContent = document.getElementById('title');
  const sectionPrice = document.getElementById('price');
  const sectionProductDescription = document.getElementById('description');
  const optionColors = document.getElementById('colors');
  const sectionImage = document.getElementsByClassName('item__img')[0];
  
  // Valeurs correspondantes
  let nameProduct = myJson.name;
  let priceProduct = myJson.price;
  let productDescription = myJson.description;
  let imageUrl = myJson.imageUrl;
  let altTxt = myJson.altTxt;
  
  // Affichage nom, image, prix et description du produit
  sectionContent.innerHTML = nameProduct; 
  sectionPrice.innerHTML = priceProduct;
  sectionProductDescription.innerHTML = productDescription;
  sectionImage.innerHTML =  '<img src=" '+ imageUrl +' " alt=" '+altTxt+'">' 
  
  
  // boucle pour récupérer les couleurs de chaque Kanap
  for (let i = 0; i < myJson.colors.length; i++){
    let color = myJson.colors[i];
    
    // Affichage choix couleurs
    optionColors.innerHTML += 
    '<option value="'+color+'">'+color+'</option>'
  };
  

  // **** Code page produit pour choisir les produits et les mettre au panier ****
  
  
  // action du bouton ajouter au panier
  document.getElementById("addToCart").addEventListener('click',function(){
    
    //declaration des valeurs pour un article 
    let productsKanap = {id:id, color:colors.value, name:nameProduct, description:productDescription, img:imageUrl, altText:altTxt};
    
    let color = document.getElementById("colors").value;
    
    // variable pour la quantité mise au format nb entier ==> parseInt
    let quantity = parseInt(document.getElementById("quantity").value);
    
    // condition si l'utilisateur oublie de choisir la quantite et/ou la couleur
    if (color == null || color === "" || quantity == null || quantity == 0){
      alert("Choisir couleur et quantite svp");
      return false;
    }
    if (quantity > 100 || quantity < 0){
      alert ("quantite incorrecte");
      return false;
    };
    //ajoute le produit selectionné
    addCart(productsKanap); 

  });
  
  // fonction pour enregistrer le panier dans le local storage
  function saveCart(productsKanap){ // POUR ENREGISTRER LE LOCALSTORAGE
    
    //mettre la valeur java script en chaîne de caractère pour l'enregistrer dans le storage.
    // Clé: id + couleur ---> valeurs au format json(.stringify)
    localStorage.setItem(productsKanap.id+colors.value,JSON.stringify(productsKanap));
  }; 
  //fonction pour ajouter de nouveaux produits dans le panier
  function addCart(productsKanap) {
    
    // variable pour récuperer la quantité selectionnée et la passer au format nb entier
    // car additionne les chaînes de caracteres 101010 au lieu de 10+10+10  
    let selected_Quantity = parseInt(document.getElementById("quantity").value);
    
    // variable produit = id+ couleurs canape, récupérés dans le localStorage et mis au format javascript( .parse) pour comparaisons avant ajout au panier
    let product = JSON.parse(localStorage.getItem(productsKanap.id+colors.value));
    
    // condition pour ajouter au panier
    // Si different de null, additionne les quantités 
    if(product != null){
      let totalQuantity = product.quantity + selected_Quantity;

      // si le total du produit au panier est superieur à 100
      if (totalQuantity > 100){
        alert (" Total de l'article au panier supérieur à 100");
        return false;

        // sinon le total du produit au panier n'est pas supérieur à 100, ajout au panier
      } else {
        product.quantity = totalQuantity; 
        alert(selected_Quantity + " Article(s) ajouté(s)"+" - Total pour cet article : "+ totalQuantity);
      } 
    }  
    // si aucun article au panier, ajoute l'article
    else{
      product = productsKanap;
      product.quantity = selected_Quantity;
      alert(product.quantity + " Article(s) ajouté(s) au panier");
    };
    saveCart(product);
  };                               
});



