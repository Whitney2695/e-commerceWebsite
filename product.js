"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id') || '0', 10);
    const productDetails = document.getElementById('product-details');
    function fetchItem(id) {
        fetch(`http://localhost:3000/items/${id}`) // Fetch item by ID
            .then(response => {
            if (!response.ok) {
                throw new Error('Item not found');
            }
            return response.json();
        })
            .then((item) => {
            displayItem(item);
        })
            .catch(error => {
            console.error('Failed to fetch item:', error);
            productDetails.innerHTML = '<p>Item not found</p>'; // Display error message
        });
    }
    function displayItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-details');
        const itemImage = document.createElement('img');
        itemImage.src = item.imageUrl;
        itemImage.alt = item.name;
        const itemName = document.createElement('h2');
        itemName.textContent = item.name;
        const itemPrice = document.createElement('p');
        itemPrice.textContent = item.price;
        const itemDescription = document.createElement('p');
        itemDescription.textContent = item.description;
        itemDiv.appendChild(itemImage);
        itemDiv.appendChild(itemName);
        itemDiv.appendChild(itemPrice);
        itemDiv.appendChild(itemDescription);
        productDetails.appendChild(itemDiv);
    }
    fetchItem(itemId);
});
