interface Item {
    id: number;
    name: string;
    price: string;
    description: string;
    category: string;
    imageUrl: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const showAddItemFormButton = document.getElementById('show-add-item-form-button') as HTMLButtonElement;
    const addItemForm = document.getElementById('add-item-form') as HTMLFormElement;
    const itemsList = document.getElementById('items-list') as HTMLDivElement;

    const apiUrl = 'http://localhost:3000/items';

    showAddItemFormButton.addEventListener('click', () => {
        addItemForm.classList.toggle('hidden');
    });

    addItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addItemForm);
        const newItem: Omit<Item, 'id'> = {
            name: formData.get('name') as string,
            price: formData.get('price') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            imageUrl:formData.get('image') as string
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            const createdItem = await response.json() as Item;
            addItemToList(createdItem);
            addItemForm.reset();
            addItemForm.classList.add('hidden');
            console.log('Item added successfully:', createdItem);
        } else {
            console.error('Failed to add item');
        }
    });

    itemsList.addEventListener('click', async (event) => {
        const target = event.target as HTMLElement;
        const itemElement = target.closest('.item') as HTMLElement | null;
        if (itemElement) {
            const itemId = itemElement.dataset.id || '';
            console.log('itemId:', itemId);
    
            if (target.classList.contains('delete-button')) {
                const response = await fetch(`${apiUrl}/${itemId}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    itemElement.remove();
                    console.log('Item deleted successfully');
                } else {
                    console.error('Failed to delete item');
                }
            }
        }
    });
    

    async function fetchItems() {
        const response = await fetch(apiUrl);
        const items: Item[] = await response.json();
        items.forEach(addItemToList);
    }

    function addItemToList(item: Item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.dataset.id = item.id.toString();
        itemElement.innerHTML = `
            <div class="card">
                <img src="${item.imageUrl}" alt="${item.name}"> <!-- Changed from item.image to item.imageUrl -->
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
