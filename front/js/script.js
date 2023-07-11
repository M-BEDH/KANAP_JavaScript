// Appel de l'API --> reponse json
fetch('http://localhost:3000/api/products/')
.then(function(response) {
  return response.json();
})

// Emplacement pour script js/ affichage produits
.then(function(myJson) {
  let sectionItems = document.getElementById('items');
  
  
  // Boucle affichage de chaque produit
  for (let i = 0; i < myJson.length; i++) {
    
    // Valeurs correspondantes      
    let imageURL = myJson[i].imageUrl;
    let altTxt = myJson[i].altTxt;
    let productName = myJson[i].name;
    let productDescription = myJson[i].description;
    let id = myJson[i]._id;
    
    
    sectionItems.innerHTML +=
    '<a href="./product.html?id='+ id+'">'+
    '<article>'+
    '<img src="'+imageURL +'" alt="'+ altTxt +'">'+ 
    '<h3 class="productName"> '+ productName +' </h3>'+
    '<p class="productDescription"> '+ productDescription + '</p>'+
    '</article>'+
    '</a>'
  };
}); 

    