// Access DOM elements

const pageTitle = document.querySelector('title');
const main = document.querySelector('main');
const container = document.getElementById('card-wrap')
const addButton = document.getElementById('add-button');
const cardContainer = document.querySelector('#card-container');
const card = document.createElement('div');
const cardBody = document.createElement('div');
const title = document.createElement('h4');
const description = document.createElement('p');
const img = document.createElement('img');
const price = document.createElement('p');
const formContainer = document.createElement('div');
const dropDownLabel = document.createElement('label');
const dropDown = document.createElement('select');
const itemAddedAlert = document.createElement('div');
const alertDismissBtn = document.createElement('button');
itemAddedAlert.setAttribute('id', 'itemAddedAlert');

let cart = localStorage.getItem('cart') || '[]';
let cartArray = JSON.parse(cart);

// create current item object

let currentItem = {
    _id: '',
    name: '',
    price,
    lens: '',
    description: '',
    imageUrl: '',
    qty: 1
}

// accessing each product's ID using query parameters

const params = new URLSearchParams(window.location.search);
console.log(params);
console.log(params.get('id'));
const id = params.get('id');


// uses fetch to make a get request to the server with the selected product's ID

fetch(`http://localhost:3000/api/cameras/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        createCard(data);
        currentItemInCart(data);
        pageTitle.textContent = `${currentItem.name} - Orinoco Cameras`;
    })
    .catch(error => console.log("Failed to connect to server.", error));


// creates the card for the product, using the object returned by the server    

function createCard(productObject) {
    console.log('in createCard function');
    
    const lensesArray = productObject.lenses;

    cardContainer.classList.add('col-12','col-lg-8', 'm-0', 'mt-5','m-lg-auto');
    card.classList.add('card', 'mb-4', 'mb-lg-5', 'mt-4', 'shadow');
    cardBody.classList.add('card-body');
    title.classList.add('card-title');
    description.classList.add('card-text', 'mt-3', 'mt-lg-4');
    img.classList.add('card-img');
    price.innerHTML = `<strong>$ ${(productObject.price / 100).toLocaleString()}</strong>`;
    formContainer.classList.add('form-group');
    dropDown.classList.add('form-control', 'col-md-4');
    dropDown.setAttribute('id', 'lense-type');
    dropDownLabel.setAttribute('for', 'lense-type');
    dropDownLabel.textContent = 'Lens specs';

    for (let i=0; i < lensesArray.length; i++) {
        let lensOption = document.createElement('option');
        lensOption.setAttribute('value', lensesArray[i]);
        lensOption.textContent = lensesArray[i];
        dropDown.appendChild(lensOption);
        formContainer.appendChild(dropDownLabel);
        formContainer.appendChild(dropDown);
    }

    title.textContent = productObject.name;
    description.textContent = productObject.description;
    img.setAttribute('src', productObject.imageUrl);
    img.setAttribute('alt', 'Vintage camera');

    cardContainer.appendChild(card);
    cardBody.appendChild(title);
    cardBody.appendChild(img);
    cardBody.appendChild(description);
    cardBody.appendChild(price);
    cardBody.appendChild(formContainer);
    card.appendChild(cardBody);
}


// Assigns values to "currentItem" properties

function currentItemInCart(productObject) {
    currentItem._id = productObject._id;
    currentItem.name = productObject.name;
    currentItem.price = productObject.price;
    currentItem.lens = productObject.lenses[0];
    currentItem.description = productObject.description;
    currentItem.imageUrl = productObject.imageUrl;
}

// Lens type dropdown event listener - on change

dropDown.addEventListener('change', (event) => {
    const thing = event.target.parentElement;
    console.log(thing);
    currentItem.lens = event.target.value;
    for (let i = 0; i < cartArray.length; i++) {
        if (currentItem.name === cartArray[i].name && currentItem.lens !== cartArray[i].lens) {
            addButton.removeAttribute('disabled');
        }
    }
})

// "Add to cart" button event listener
// If array is empty, pushes item to the array
// If not empty, checks current item against all items in the array, comparing name and lens type


addButton.addEventListener('click', () => {
    alertDismissBtn.classList.add('close');
    alertDismissBtn.setAttribute('type', 'button');
    alertDismissBtn.setAttribute('data-dismiss', 'alert');
    alertDismissBtn.setAttribute('aria-label', 'Close');
    alertDismissBtn.innerHTML = `<span>x</span`;
    itemAddedAlert.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show');
    itemAddedAlert.setAttribute('role', 'alert');
    itemAddedAlert.textContent = `${currentItem.name} ${currentItem.lens} succesfully added to cart.`;
    itemAddedAlert.appendChild(alertDismissBtn);
    card.appendChild(itemAddedAlert);

    let pushItem = true;
    if (cartArray.length === 0) {
        cartArray.push(currentItem);
        pushItem = false;
    } else {
        for (let i = 0; i < cartArray.length; i++) {
            if (currentItem.name === cartArray[i].name && currentItem.lens === cartArray[i].lens) {
                pushItem = false;
                itemAddedAlert.textContent = 'Item has already been added to cart.';
                addButton.setAttribute('disabled', 'true');
            }
        }
    }
    if (pushItem) {
        cartArray.push(currentItem);
    }
    localStorage.setItem('cart', JSON.stringify(cartArray));
    cart = localStorage.getItem('cart');
    cartArray = JSON.parse(cart);
});