interface Item {
    id: number;
    name: string;
    price: string;
    description: string;
    imageUrl: string;
}

document.addEventListener('DOMContentLoaded', function () {
    const itemsContainer = document.getElementById('item-container') as HTMLDivElement;
    const cart = [] as Item[];

    function fetchItems() {
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then((items: Item[]) => {
                displayItems(items);
            })
            .catch(error => {
                console.error('Failed to fetch items:', error);
            });
    }

    function displayItems(items: Item[]) {
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
                <button onclick="viewItem(${item.id})">View Details</button>
                <button onclick="addToCart(${item.id})">Add to Cart</button>
            `;
            itemsContainer.appendChild(itemDiv);
        });
    }

    function viewItem(id: number) {
        window.location.href = `product.html?id=${id}`;
    }

    function addToCart(id: number) {
        fetch(`http://localhost:3000/items/${id}`)
            .then(response => response.json())
            .then((item: Item) => {
                cart.push(item);
                updateCartDisplay();
            })
            .catch(error => {
                console.error('Failed to add item to cart:', error);
            });
    }

    function updateCartDisplay() {
        // Update cart display logic (e.g., a modal, sidebar, etc.)
        console.log('Cart:', cart);
    }

    (window as any).viewItem = viewItem;
    (window as any).addToCart = addToCart;

    fetchItems();
});
