const main = document.querySelector('main');
const serverErrorDiv = document.createElement('div');
serverErrorDiv.setAttribute('id', 'server-error');
const serverError = document.createElement('h5');
serverErrorDiv.appendChild(serverError);
serverError.innerHTML = 'Failed to connect to the server. Please check your connection.';
main.appendChild(serverErrorDiv);


// create API request with fetch
// returns an array containing the objects corresponding to each camera

fetch('http://localhost:3000/api/cameras/')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        createCard(data);
    })
    .catch(error => console.log("Failed to connect to server.", error))
    .then(serverErrorDiv.classList.remove('d-none'))
  

// create the card for every camera in the all products page

function createCard(productsArray) {
    console.log('in createCard');
    serverErrorDiv.classList.add('d-none');
    const cards = document.getElementById('cards');
    for (let i=0; i < productsArray.length; i++) {
        const cardContainer = document.createElement('div');
        const card = document.createElement('article');
        const cardBody = document.createElement('div');
        const title = document.createElement('h4');
        const description = document.createElement('p');
        const img = document.createElement('img');
        const link = document.createElement('a');
        const price = document.createElement('p');

        cardContainer.classList.add('col-12', 'col-lg-6', 'mt-4');
        card.classList.add('card', 'mb-4', 'mb-lg-5', 'shadow');
        cardBody.classList.add('card-body');
        title.classList.add('card-title');
        description.classList.add('card-text', 'mt-3');
        img.classList.add('card-img');
        link.classList.add('stretched-link', 'btn', 'btn-primary', 'mt-3');
        price.classList.add('card-text', 'text-right');
        price.innerHTML = `<strong>$ ${(productsArray[i].price / 100).toLocaleString()}</strong>`;

        title.textContent = productsArray[i].name;
        description.textContent = productsArray[i].description;
        link.textContent = 'Learn more';
        img.setAttribute('src', productsArray[i].imageUrl);
        img.setAttribute('alt', 'Vintage camera');
        link.setAttribute('href', `single_product.html?id=${productsArray[i]._id}`);

        cardContainer.appendChild(card);
        cardBody.appendChild(title);
        cardBody.appendChild(img);
        cardBody.appendChild(link);
        cardBody.appendChild(price);
        card.appendChild(cardBody);
        cards.appendChild(cardContainer);
    }

}