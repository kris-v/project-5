// Access DOM elements

const main = document.querySelector("main");
const homeButton = document.getElementById("homeButton");
const thankYouContainer = document.getElementById("thankYouMessage");
const thankYou = document.createElement("h4");
const confNumber = document.createElement("p");
const orderId = localStorage.getItem('responseId');
const billingInfo = document.getElementById('billingInfo');


// Accessing products array and contact object stored in Local Storage

let cart = localStorage.getItem('cart') || "[]";
let cartArray = JSON.parse(cart);
let contact = localStorage.getItem('contact') || "{}";
let contactObj = JSON.parse(contact);
let totalPriceContainer = document.createElement('div');
let totalPrice = 0;
main.appendChild(totalPriceContainer);
console.log(totalPrice);


// Billing information - built through local storage

const contactInfo = document.createElement('div');
const billingInfoTitle = document.createElement('h4');
billingInfoTitle.classList.add('text-center');
billingInfoTitle.textContent = 'Billing information';
billingInfoTitle.classList.add('mb-4');
contactInfo.classList.add('col-lg-12', 'ml-5');
let contactInfoList = document.createElement('ul');
let fullName = document.createElement('p');
let address = document.createElement('p');
let city = document.createElement('p');
let email = document.createElement('p');
fullName.innerHTML = `<strong>Name</strong>: ${contactObj['firstName']} ${contactObj['lastName']}`;
address.innerHTML = `<strong>Address</strong>: ${contactObj['address']}`;
city.innerHTML = `<strong>City</strong>: ${contactObj['city']}`;
email.innerHTML = `<strong>email</strong>: ${contactObj['email']}`;

let list = [fullName, address, city, email];

for (let item of list) {
    contactInfo.append(item);
}

billingInfo.appendChild(billingInfoTitle);
billingInfo.appendChild(contactInfo);

thankYou.textContent = 'Thank you for your purchase!';
thankYou.classList.add('text-center');
confNumber.textContent = `Your order confirmation number is ${orderId.replace(/^"(.*)"$/, '$1')}.`;
confNumber.classList.add('text-center', 'mx-2');
main.insertBefore(thankYou, thankYouContainer);
main.insertBefore(confNumber, thankYouContainer);


// Takes user to the home (all products) page

homeButton.addEventListener('click', () => {
    localStorage.clear();
    window.location.assign('./index.html');
})


function createCard(productsArray) {
    console.log('in createCard');
    
    const cards = document.getElementById('cards');
    const orderSummary = document.createElement("h4");
    orderSummary.classList.add('text-center', 'mt-5');
    orderSummary.textContent = 'Order Summary';
    cards.appendChild(orderSummary);
    for (let i=0; i < productsArray.length; i++) {
        const cardContainer = document.createElement('div');
        const card = document.createElement('article');
        const cardBody = document.createElement('div');
        const title = document.createElement('h4');
        const img = document.createElement('img');
        const price = document.createElement('p');
        const subtotalAmount = document.createElement('p');
        const lensType = document.createElement('p');
        const quantity = document.createElement('p');
        const separator = document.createElement('hr');

        cardContainer.classList.add('col-12', 'col-lg-8', 'mx-auto', 'mt-4');
        card.classList.add('card', 'mt-5', 'mb-4', 'mb-lg-5', 'shadow');
        cardBody.classList.add('card-body');
        title.classList.add('card-title');
        img.classList.add('card-img');
        price.classList.add('card-text', 'text-left', 'mt-3', 'mb-0');
        price.innerHTML = `<strong>Unit price:</strong> $ ${(productsArray[i].price / 100).toLocaleString()}`;
        subtotalAmount.classList.add('card-text', 'text-right', 'mt-3', 'mb-0');
        subtotalAmount.innerHTML = `<strong>Subtotal:</strong> $ ${((productsArray[i].price / 100) * productsArray[i].qty).toLocaleString()}`;
        quantity.classList.add('card-text', 'text-left', 'mt-3');
        quantity.innerHTML = `<strong>Quantity: </strong>${productsArray[i].qty}`;
        lensType.classList.add('card-text', 'text-left', 'mt-3');
        lensType.innerHTML = `<strong>Lens:</strong> ${productsArray[i].lens}`;

        title.textContent = productsArray[i].name;
        img.setAttribute('src', productsArray[i].imageUrl);
        img.setAttribute('alt', 'Vintage camera');

        cardContainer.appendChild(card);
        cardBody.appendChild(title);
        cardBody.appendChild(img);
        cardBody.appendChild(lensType);
        cardBody.appendChild(quantity);
        cardBody.appendChild(price);
        cardBody.appendChild(separator);
        cardBody.appendChild(subtotalAmount);
        card.appendChild(cardBody);
        cards.appendChild(cardContainer);
    }

}

function addTotalPrice() {
    console.log('In total price function')
    for (let i = 0; i < cartArray.length; i++) {
        totalPrice += cartArray[i].qty * cartArray[i].price;
        totalPriceContainer.innerHTML = `<strong>Total amount:</strong> $${(totalPrice / 100).toLocaleString()}`;
        totalPriceContainer.classList.add('text-center', 'mt-5');
    }
}


// creates cards for every product that was purchased and adds their total price (grand total)

createCard(cartArray);
addTotalPrice();

