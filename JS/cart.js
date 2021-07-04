// variables for updating cart, total price and submitting order
let cart = localStorage.getItem('cart') || "[]";
let cartArray = JSON.parse(cart);
let contact = localStorage.getItem('contact') || "{}";
let contactObj = JSON.parse(contact);
let main = document.querySelector('main');
let orderBtn = document.getElementById('order-btn');
let totalPriceContainer = document.createElement('div');
let totalPrice = 0;
let orderIdString = "";
let responseId = localStorage.getItem('responseId');
let cartContainer = document.getElementById('cartContainer');
totalPriceContainer.classList.add('mx-auto');
const itemList = document.getElementById('item-list');

main.classList.add('mt-5');
let emptyCartTitle = document.createElement('h4')
itemList.classList.add('row', 'd-lg-flex');
itemList.appendChild(emptyCartTitle);



// variables for contact form and error messages
const cartTitle = document.getElementById('cart-title');
const contactForm = document.getElementById('contactForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const checkbox = document.getElementById('checkbox');
const firstNameErrorMsg = document.getElementById('firstNameError');
const lastNameErrorMsg = document.getElementById('lastNameError');
const addressErrorMsg = document.getElementById('addressError');
const cityErrorMsg = document.getElementById('cityError');
const emailErrorMsg = document.getElementById('emailError');
const invalidInputAlert = document.createElement('div');
invalidInputAlert.setAttribute('id', 'invalidInputAlert');
invalidInputAlert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show', 'd-none');
invalidInputAlert.setAttribute('role', 'alert');
invalidInputAlert.textContent = `Please review input errors highlighted in red.`;
const missingInputError = document.getElementById('missingInputError');
const alertDismissBtn = document.createElement('button');
alertDismissBtn.classList.add('close');
alertDismissBtn.setAttribute('type', 'button');
alertDismissBtn.setAttribute('data-dismiss', 'alert');
alertDismissBtn.setAttribute('aria-label', 'Close');
alertDismissBtn.innerHTML = `<span>x</span`;
invalidInputAlert.appendChild(alertDismissBtn);
main.appendChild(invalidInputAlert);


if (cartArray.length === 0) {
    totalPriceContainer.classList.add('d-none');
    emptyCartTitle.textContent = 'No items in cart.';
    itemList.classList.add('text-center', 'text-center');
    cartTitle.classList.add('d-none');
    firstName.disabled = true;
    lastName.disabled = true;
    address.disabled = true;
    city.disabled = true;
    email.disabled = true;
    checkbox.disabled = true;
}


function createLineItem(obj) {
    let itemContainer = document.createElement('div');
    let cardListItem = document.createElement('li');
    let itemCard = document.createElement('div');
    let itemName = document.createElement('span');
    let itemLens = document.createElement('span');
    let itemPrice = document.createElement('span');
    let itemTotal = document.createElement('span');
    let itemImg = document.createElement('img');
    let itemQty = document.createElement('span');
    let qtyButtons = document.createElement('div');
    qtyButtons.classList.add('flex-row');
    itemContainer.classList.add('card-body');
    itemName.innerHTML = `<strong>${obj.name}</strong>`;
    itemName.classList.add('mt-2');
    cardListItem.innerHTML = `lens: ${obj.lens}`;
    itemLens.textContent = obj.lens;
    itemLens.classList.add('m-2');
    itemPrice.innerHTML = (`<strong>Price:</strong> $${(obj.price / 100).toLocaleString()}`);
    itemPrice.classList.add('m-2');
    itemTotal.innerHTML = `<strong>Subtotal:</strong> $${(obj.price * obj.qty / 100).toLocaleString()}`;
    itemTotal.classList.add('m-2');
    itemQty.innerHTML = `${obj.qty}`;
    itemQty.classList.add('m-2');
    itemImg.setAttribute('src', obj.imageUrl);
    itemImg.setAttribute('id', 'itemImg');
    itemImg.classList.add('card-img-top');
    let increaseButton = document.createElement('button');
    let decreaseButton = document.createElement('button');
    let removeButton = document.createElement('button');
    qtyButtons.appendChild(increaseButton);
    qtyButtons.appendChild(itemQty);
    qtyButtons.appendChild(decreaseButton);
    qtyButtons.appendChild(removeButton);
    increaseButton.setAttribute('type', 'button');
    increaseButton.setAttribute('id', 'incrBtn');
    decreaseButton.setAttribute('type', 'button');
    decreaseButton.setAttribute('id', 'decrBtn');
    removeButton.setAttribute('type', 'button');
    removeButton.setAttribute('id', 'removeBtn');
    increaseButton.classList.add('btn', 'btn-primary', 'my-2');
    decreaseButton.classList.add('btn', 'btn-primary', 'my-2');
    removeButton.classList.add('btn','btn-danger', 'my-2');
    increaseButton.innerText = '+';
    decreaseButton.innerText = '-';
    removeButton.innerText = 'X';
    itemCard.appendChild(itemImg);
    itemCard.appendChild(itemName);
    itemCard.appendChild(itemLens);
    itemCard.appendChild(itemPrice);
    itemCard.appendChild(itemTotal);
    itemCard.appendChild(qtyButtons);
    itemCard.classList.add('card', 'mb-4', 'mb-lg-5', 'shadow', 'col-lg-4', 'col-md-6', 'mx-auto');
    itemContainer.appendChild(itemCard);
    itemContainer.classList.add('mx-0');
    itemList.appendChild(itemContainer);
    
    increaseButton.addEventListener('click', (event) => {
        const name = event.target.parentElement.parentElement.firstChild.nextElementSibling.textContent;
        const lens = event.target.parentElement.parentElement.firstChild.nextElementSibling.nextElementSibling.textContent;
        for (let i = 0; i < cartArray.length; i++) {
            if (name === cartArray[i].name && lens == cartArray[i].lens) {
                cartArray[i].qty += 1;
                itemQty.innerHTML = `${cartArray[i].qty}`;
                itemTotal.innerHTML = `<strong>Subtotal:</strong> $${(cartArray[i].qty * cartArray[i].price / 100).toLocaleString()}`;
                totalPrice += cartArray[i].price;
                totalPriceContainer.innerHTML = `<strong>Total Amount:</strong> $${(totalPrice / 100).toLocaleString()}`;
                syncCart();
            } 
        }
    });

    decreaseButton.addEventListener('click', (event) => {
        const name = event.target.parentElement.parentElement.firstChild.nextElementSibling.textContent;
        const lens = event.target.parentElement.parentElement.firstChild.nextElementSibling.nextElementSibling.textContent;
        for (let i = 0; i < cartArray.length; i++) {
            if (name === cartArray[i].name && lens == cartArray[i].lens && cartArray[i].qty > 1) {
                cartArray[i].qty -= 1;
                itemQty.innerHTML = `${cartArray[i].qty}`;
                itemTotal.innerHTML = `<strong>Subtotal:</strong> $${(cartArray[i].qty * cartArray[i].price / 100).toLocaleString()}`;
                totalPrice -= cartArray[i].price;
                totalPriceContainer.innerHTML = `<strong>Total Amount:</strong> $${(totalPrice / 100).toLocaleString()}`;
                syncCart();
                } 
            }
        }    
    );

    removeButton.addEventListener('click', (event) => {
        // first remove element from the DOM

        const grandParent = event.target.parentElement.parentElement.parentElement.parentElement;
        const parent = event.target.parentElement.parentElement.parentElement;
        grandParent.removeChild(parent);


        //then remove it from the cart array
        const name = event.target.parentElement.parentElement.firstChild.nextElementSibling.textContent;
        const lens = event.target.parentElement.parentElement.firstChild.nextElementSibling.nextElementSibling.textContent;
        for (let i = 0; i < cartArray.length; i++) {
            if (name === cartArray[i].name && lens === cartArray[i].lens) {
                totalPrice -= cartArray[i].price * cartArray[i].qty;
                totalPriceContainer.innerHTML = `<strong>Total Amount:</strong> $${(totalPrice / 100).toLocaleString()}`;
                cartArray.splice(i, 1);
                syncCart();
            }
        }
        if (cartArray.length === 0) {
            itemList.textContent = 'No items in cart.';
            itemList.classList.add('h4');
            cartTitle.classList.add('d-none');
            orderBtn.setAttribute('disabled', 'true');
            totalPriceContainer.classList.add('d-none');
            firstName.disabled = true;
            lastName.disabled = true;
            address.disabled = true;
            city.disabled = true;
            email.disabled = true;
            checkbox.disabled = true;
        }
        // disables "Place order" button and form input fields
    });
};


function createLineItemList(array) {
    for(let i = 0; i < array.length; i++) {
        createLineItem(array[i]);
    }
}

function syncCart() {
    localStorage.setItem('cart', JSON.stringify(cartArray));
    cart = localStorage.getItem('cart');
    cartArray = JSON.parse(cart);
}

function addTotalPrice() {
    for (let i = 0; i < cartArray.length; i++) {
        totalPrice += cartArray[i].qty * cartArray[i].price;
        totalPriceContainer.innerHTML = `<strong>Total Amount:</strong> $${(totalPrice / 100).toLocaleString()}`;
        totalPriceContainer.classList.add('text-center', 'mt-5');
        cartContainer.appendChild(totalPriceContainer);
    }
}


if(cartArray.length !== 0) {
    orderBtn.removeAttribute('disabled');
}

//RegEx for input field validation

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const addressRegex = /^[A-Za-z0-9 ]{7,32}$/;
const nameRegex = /^[A-Za-z ]{3,32}$/;

let emailIsValid = false;
let firstNameIsValid = false;
let lastNameIsValid = false;
let addressIsValid = false;
let cityIsValid = false;


// Blur event listeners for all input fields
// If true - adds green, if false - adds red

firstName.addEventListener('blur', () => {
    if (nameRegex.test(firstName.value)) {
        firstNameErrorMsg.classList.add('d-none');
        firstName.style.border = 'thin solid green';
        firstNameIsValid = true;
    } else {
        firstNameErrorMsg.classList.remove('d-none');
        firstName.style.border = 'thin solid red';
        firstNameIsValid = false;
    }
});

lastName.addEventListener('blur', () => {
    if (nameRegex.test(lastName.value)) {
        lastNameErrorMsg.classList.add('d-none');
        lastName.style.border = 'thin solid green';
        lastNameIsValid = true;
    } else {
        lastNameErrorMsg.classList.remove('d-none');
        lastName.style.border = 'thin solid red';
        lastNameIsValid = false;
    }
});

address.addEventListener('blur', () => {
    if (addressRegex.test(address.value)) {
        addressErrorMsg.classList.add('d-none');
        address.style.border = 'thin solid green';
        addressIsValid = true;
    } else {
        addressErrorMsg.classList.remove('d-none');
        address.style.border = 'thin solid red';
        addressIsValid = false;
    }
});

city.addEventListener('blur', () => {
    if (nameRegex.test(city.value)) {
        cityErrorMsg.classList.add('d-none');
        city.style.border = 'thin solid green';
        cityIsValid = true;
    } else {
        cityErrorMsg.classList.remove('d-none');
        city.style.border = 'thin solid red';
        cityIsValid = false;
    }
});

email.addEventListener('blur', () => {
    if (emailRegex.test(email.value)) {
        emailErrorMsg.classList.add('d-none');
        email.style.border = 'thin solid green';
        emailIsValid = true;
    } else {
        emailErrorMsg.classList.remove('d-none');
        email.style.border = 'thin solid red';
        emailIsValid = false;
    }
});


// Removes error message if checkbox has been checked
checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
        missingInputError.classList.add('d-none');
    }
})

orderBtn.addEventListener('click', (event) => {
    // take info from cart and put it an array - need the id of each cartItem
    // get the info from the form fields
    // build object
    // post object to server
    // use response to create content and to change to new page with window.location.assign
    event.preventDefault();
    let orderObj = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products: []
    }
    // Add product IDs to products array within orderObj
    for (let i = 0; i < cartArray.length; i++) {
        orderObj.products.push(cartArray[i]._id);
    }

    localStorage.setItem('contact', JSON.stringify(orderObj.contact));
    contact = localStorage.getItem('contact');
    contactObj = JSON.parse(contact);


    // if all fields are empty - adds red border to each one

    if (email.value === '' && lastName.value === '' && address.value === '' && city.value === '' && email.value === '') {
        missingInputError.classList.remove('d-none');
        firstName.style.border = 'thin solid red';
        lastName.style.border = 'thin solid red';
        address.style.border = 'thin solid red';
        city.style.border = 'thin solid red';
        email.style.border = 'thin solid red';
    }


    // Validates inputs. If all conditions are true - submits post request to the server

    if (emailIsValid === true && firstNameIsValid === true && lastNameIsValid === true && addressIsValid === true && cityIsValid === true && checkbox.checked === true) {
        fetch(`http://localhost:3000/api/cameras/order`,
        {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderObj),
            }
        )
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data),
        orderIdString = data.orderId,
        localStorage.setItem('responseId', JSON.stringify(orderIdString))
        })
        .then(() => {
            window.location.assign('./confirmation.html');
        })
        .catch((error) => {
        console.error('Error:', error);
        });
        invalidInputAlert.classList.add('d-none');
        contactForm.reset();
    } else if (checkbox.checked === false) {
        invalidInputAlert.classList.remove('d-none');
        missingInputError.classList.remove('d-none');
    } else {
        invalidInputAlert.classList.remove('d-none');
        invalidInputAlert.classList.add('d-inline');
    }

});


// Render a list of items in shopping cart and adds total price due

createLineItemList(cartArray);
addTotalPrice();
