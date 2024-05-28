"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const showAddItemFormButton = document.getElementById('show-add-item-form-button');
    const addItemForm = document.getElementById('add-item-form');
    const itemsList = document.getElementById('items-list');
    if (showAddItemFormButton) {
        showAddItemFormButton.addEventListener('click', function () {
            if (addItemForm) {
                if (addItemForm.classList.contains('hidden')) {
                    addItemForm.classList.remove('hidden');
                    window.scrollTo(0, 0); // Scroll to top when showing the form
                }
                else {
                    addItemForm.classList.add('hidden');
                }
            }
        });
    }
    if (addItemForm) {
        addItemForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Add item logic here
        });
    }
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            fetchItems(categoryFilter.value);
        });
    }
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
            fetchItems(null, searchTerm);
        });
    }
    function fetchItems(category = null, searchTerm = '') {
        let url = 'http://localhost:3000/items';
        if (category) {
            url += `?category=${category}`;
        }
        if (searchTerm) {
            url += `${category ? '&' : '?'}q=${searchTerm}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(displayItems)
            .catch(error => console.error('Failed to fetch items:', error));
    }
    function displayItems(items) {
        if (itemsList) {
            itemsList.innerHTML = '';
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Price: $${item.price}</p>
                    <img src="${item.imageUrl}" width="200px" height="150px" alt="${item.name}">
                    <button class="edit-item" data-id="${item.id}">Edit</button>
                    <button class="delete-item" data-id="${item.id}">Delete</button>
                `;
                const editButton = itemDiv.querySelector('.edit-item');
                if (editButton) {
                    editButton.addEventListener('click', function () {
                        if (editButton.dataset.id) {
                            editItem(parseInt(editButton.dataset.id));
                        }
                    });
                }
                itemsList.appendChild(itemDiv);
            });
        }
    }
    function editItem(id) {
        // Fetch item details and display edit form
        console.log('Edit item with ID:', id);
    }
    function deleteItem(id, button) {
        // Delete item logic here
        console.log('Delete item with ID:', id);
    }
    // Initial fetch to display items
    fetchItems();
});
