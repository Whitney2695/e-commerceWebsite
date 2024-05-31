"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const itemsContainer = document.getElementById('item-container');
    const messageDiv = document.getElementById('message'); // Get the message display area
    const cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart from localStorage
    function fetchItems() {
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then((items) => {
            displayItems(items);
        })
            .catch(error => {
            console.error('Failed to fetch items:', error);
        });
    }
    function displayItems(items) {
        itemsContainer.innerHTML = '';
        items.forEach(function (item) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h2>${item.name}</h2>
                <p>${item.price}</p>
                <div class="icons">
                    <ion-icon name="star"></ion-icon>
                    <ion-icon name="star"></ion-icon>
                    <ion-icon name="star"></ion-icon>
                    <ion-icon name="star"></ion-icon>
                    <ion-icon name="star"></ion-icon>
                </div>
                <button class="view-item-button" data-id="${item.id}">View Details</button>
                <button class="add-to-cart-button" data-id="${item.id}">Add to Cart</button>
            `;
            itemsContainer.appendChild(itemDiv);
        });
    }
    // Event delegation to handle click events on dynamically added buttons
    itemsContainer.addEventListener('click', function (event) {
        const target = event.target;
        if (target.matches('.view-item-button')) {
            const id = target.getAttribute('data-id') || '0'; // ID as string
            viewItem(id);
        }
        else if (target.matches('.add-to-cart-button')) {
            const id = target.getAttribute('data-id') || '0'; // ID as string
            addToCart(id);
        }
    });
    function viewItem(id) {
        window.location.href = `product.html?id=${id}`;
    }
    function addToCart(id) {
        fetch(`http://localhost:3000/items/${id}`)
            .then(response => response.json())
            .then((item) => {
            cart.push(item);
            updateCartDisplay();
            displayMessage("Item added to cart successfully!"); // Display success message
            localStorage.setItem('cart', JSON.stringify(cart)); // Store updated cart in localStorage
        })
            .catch(error => {
            console.error('Failed to add item to cart:', error);
        });
    }
    function updateCartDisplay() {
        console.log('Cart:', cart);
    }
    function displayMessage(msg) {
        messageDiv.textContent = msg;
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000); // Clear message after 3 seconds
    }
    fetchItems();
});
