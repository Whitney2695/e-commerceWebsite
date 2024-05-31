"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const showAddItemFormButton = document.getElementById('show-add-item-form-button');
    const addItemForm = document.getElementById('add-item-form');
    const editItemForm = document.getElementById('edit-item-form');
    const cancelAddButton = document.getElementById('cancel-add');
    const cancelEditButton = document.getElementById('cancel-edit');
    const itemsList = document.getElementById('items-list');
    const apiUrl = 'http://localhost:3000/items';
    showAddItemFormButton.addEventListener('click', () => {
        addItemForm.classList.toggle('hidden');
        editItemForm.classList.add('hidden');
    });
    cancelAddButton.addEventListener('click', () => {
        addItemForm.classList.add('hidden');
    });
    cancelEditButton.addEventListener('click', () => {
        editItemForm.classList.add('hidden');
    });
    addItemForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const formData = new FormData(addItemForm);
        const newItem = {
            name: formData.get('name'),
            price: formData.get('price'),
            description: formData.get('description'),
            category: formData.get('category'),
            imageUrl: formData.get('image')
        };
        const response = yield fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });
        if (response.ok) {
            const createdItem = yield response.json();
            addItemToList(createdItem);
            addItemForm.reset();
            addItemForm.classList.add('hidden');
            console.log('Item added successfully:', createdItem);
        }
        else {
            console.error('Failed to add item');
        }
    }));
    itemsList.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const target = event.target;
        const itemElement = target.closest('.item');
        if (itemElement) {
            const itemId = itemElement.dataset.id || '';
            console.log('itemId:', itemId);
            if (target.classList.contains('delete-button')) {
                const response = yield fetch(`${apiUrl}/${itemId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    itemElement.remove();
                    console.log('Item deleted successfully');
                }
                else {
                    console.error('Failed to delete item');
                }
            }
            else if (target.classList.contains('edit-button')) {
                const response = yield fetch(`${apiUrl}/${itemId}`);
                const item = yield response.json();
                editItemForm.classList.remove('hidden');
                addItemForm.classList.add('hidden');
                document.getElementById('edit-id').value = item.id.toString();
                document.getElementById('edit-name').value = item.name;
                document.getElementById('edit-price').value = item.price;
                document.getElementById('edit-description').value = item.description;
                document.getElementById('edit-category').value = item.category;
                document.getElementById('edit-image').value = item.imageUrl;
            }
        }
    }));
    editItemForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const id = document.getElementById('edit-id').value;
        const updatedItem = {
            id: parseInt(id),
            name: document.getElementById('edit-name').value,
            price: document.getElementById('edit-price').value,
            description: document.getElementById('edit-description').value,
            category: document.getElementById('edit-category').value,
            imageUrl: document.getElementById('edit-image').value
        };
        const response = yield fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        });
        if (response.ok) {
            const itemElement = itemsList.querySelector(`.item[data-id="${id}"]`);
            if (itemElement) {
                itemElement.querySelector('img').src = updatedItem.imageUrl;
                itemElement.querySelector('h4 b').textContent = updatedItem.name;
                itemElement.querySelector('p:nth-child(2)').textContent = `Price: ${updatedItem.price}`;
                itemElement.querySelector('p:nth-child(3)').textContent = `Category: ${updatedItem.category}`;
            }
            editItemForm.classList.add('hidden');
            console.log('Item updated successfully:', updatedItem);
        }
        else {
            console.error('Failed to update item');
        }
    }));
    function fetchItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(apiUrl);
            const items = yield response.json();
            items.forEach(addItemToList);
        });
    }
    function addItemToList(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.dataset.id = item.id.toString();
        itemElement.innerHTML = `
            <div class="card">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="container">
                    <h4><b>${item.name}</b></h4>
                    <p>Price: ${item.price}</p>
                    <p>Category: ${item.category}</p>
                    <button class="view-button">View</button>
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
            </div>
        `;
        itemsList.appendChild(itemElement);
    }
    fetchItems();
});
