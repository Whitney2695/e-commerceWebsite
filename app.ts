document.addEventListener('DOMContentLoaded', function () {
    const itemsContainer = document.getElementById('item-container') as HTMLDivElement;
    const messageDiv = document.getElementById('message') as HTMLDivElement; // Get the message display area
    const cart: Item[] = JSON.parse(localStorage.getItem('cart') || '[]'); // Retrieve cart from localStorage

    interface Item {
        id: string;
        name: string;
        price: string;
        description: string;
        imageUrl: string;
    }

    function fetchItems(): void {
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then((items: Item[]) => {
                displayItems(items);
            })
            .catch(error => {
                console.error('Failed to fetch items:', error);
            });
    }

    function displayItems(items: Item[]): void {
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
        const target = event.target as HTMLElement;
        if (target.matches('.view-item-button')) {
            const id = target.getAttribute('data-id') || '0'; // ID as string
            viewItem(id);
        } else if (target.matches('.add-to-cart-button')) {
            const id = target.getAttribute('data-id') || '0'; // ID as string
            addToCart(id);
        }
    });

    function viewItem(id: string): void {
        window.location.href = `product.html?id=${id}`;
    }

    function addToCart(id: string): void {
        fetch(`http://localhost:3000/items/${id}`)
            .then(response => response.json())
            .then((item: Item) => {
                cart.push(item);
                updateCartDisplay();
                displayMessage("Item added to cart successfully!"); // Display success message
                localStorage.setItem('cart', JSON.stringify(cart)); // Store updated cart in localStorage
            })
            .catch(error => {
                console.error('Failed to add item to cart:', error);
            });
    }

    function updateCartDisplay(): void {
        console.log('Cart:', cart);
    }

    function displayMessage(msg: string): void {
        messageDiv.textContent = msg;
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000); // Clear message after 3 seconds
    }

    fetchItems();
});
