"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id') || '0');
    const productDetails = document.getElementById('product-details');
    function fetchItem(id) {
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then((items) => {
            const item = items.find(item => item.id === id);
            if (item) {
                displayItem(item);
            }
            else {
                console.error('Item not found');
            }
        })
            .catch(error => {
            console.error('Failed to fetch item:', error);
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
