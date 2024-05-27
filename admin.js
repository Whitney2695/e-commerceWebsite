"use strict";
var _a, _b, _c, _d;
(_a = document.getElementById('add-item-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files ? imageInput.files[0] : null;
    if (!imageFile) {
        alert('Please select an image file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        const imageUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then((items) => {
            const newItem = {
                id: items.length + 1,
                name: name,
                price: price,
                description: description,
                imageUrl: imageUrl,
            };
            // Save updated item to server
            fetch('http://localhost:3000/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            })
                .then(() => {
                alert('Item added successfully!');
                document.getElementById('add-item-form').reset();
                // Optionally reload main page items
                window.location.href = 'index.html';
            })
                .catch(error => {
                console.error('Failed to save item:', error);
            });
        })
            .catch(error => {
            console.error('Failed to fetch items:', error);
        });
    };
    reader.readAsDataURL(imageFile);
});
(_b = document.getElementById('view-all-items')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then((items) => {
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = '';
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <h2>${item.name}</h2>
                    <p>${item.price}</p>
                    <button onclick="viewItem(${item.id})">View Details</button>
                `;
            itemsList.appendChild(itemDiv);
        });
    })
        .catch(error => {
        console.error('Failed to fetch items:', error);
    });
});
(_c = document.getElementById('update-item')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    const itemId = prompt('Enter the ID of the item to update:');
    if (!itemId) {
        return;
    }
    fetch(`http://localhost:3000/items/${itemId}`)
        .then(response => response.json())
        .then((item) => {
        const name = prompt('Enter new name:', item.name);
        const price = prompt('Enter new price:', item.price);
        const description = prompt('Enter new description:', item.description);
        if (name && price && description) {
            const updatedItem = Object.assign(Object.assign({}, item), { name,
                price,
                description });
            fetch(`http://localhost:3000/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            })
                .then(() => {
                alert('Item updated successfully!');
            })
                .catch(error => {
                console.error('Failed to update item:', error);
            });
        }
    })
        .catch(error => {
        console.error('Failed to fetch item:', error);
    });
});
(_d = document.getElementById('delete-item')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
    const itemId = prompt('Enter the ID of the item to delete:');
    if (!itemId) {
        return;
    }
    fetch(`http://localhost:3000/items/${itemId}`, {
        method: 'DELETE'
    })
        .then(() => {
        alert('Item deleted successfully!');
    })
        .catch(error => {
        console.error('Failed to delete item:', error);
    });
});
function viewItem(id) {
    window.location.href = `product.html?id=${id}`;
}
