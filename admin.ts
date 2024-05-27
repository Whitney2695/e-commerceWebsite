interface Item {
    id: number;
    name: string;
    price: string;
    description: string;
    imageUrl: string;
}

document.getElementById('add-item-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = (document.getElementById('name') as HTMLInputElement).value;
    const price = (document.getElementById('price') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;
    const imageInput = document.getElementById('image') as HTMLInputElement;
    const imageFile = imageInput.files ? imageInput.files[0] : null;

    if (!imageFile) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageUrl = e.target?.result as string;

        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then((items: Item[]) => {
                const newItem: Item = {
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
                    (document.getElementById('add-item-form') as HTMLFormElement).reset();
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

document.getElementById('view-all-items')?.addEventListener('click', function () {
    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then((items: Item[]) => {
            const itemsList = document.getElementById('items-list') as HTMLDivElement;
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

document.getElementById('update-item')?.addEventListener('click', function () {
    const itemId = prompt('Enter the ID of the item to update:');
    if (!itemId) {
        return;
    }
    fetch(`http://localhost:3000/items/${itemId}`)
        .then(response => response.json())
        .then((item: Item) => {
            const name = prompt('Enter new name:', item.name);
            const price = prompt('Enter new price:', item.price);
            const description = prompt('Enter new description:', item.description);

            if (name && price && description) {
                const updatedItem: Item = {
                    ...item,
                    name,
                    price,
                    description
                };
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

document.getElementById('delete-item')?.addEventListener('click', function () {
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

function viewItem(id: number) {
    window.location.href = `product.html?id=${id}`;
}
