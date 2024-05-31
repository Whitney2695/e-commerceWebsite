document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items') as HTMLDivElement;

    interface Item {
        id: string;
        name: string;
        price: string;
        description: string;
        imageUrl: string;
    }

    function displayCartItems(cart: Item[]): void {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" width="150px" height="150px">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                    <p>${item.description}</p>
                    <button class="remove-from-cart-button" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }

    const cart: Item[] = JSON.parse(localStorage.getItem('cart') || '[]');
    displayCartItems(cart);

    cartItemsContainer.addEventListener('click', function (event) {
        const target = event.target as HTMLElement;
        if (target.matches('.remove-from-cart-button')) {
            const id = target.getAttribute('data-id');
            if (id !== null) {
                removeFromCart(id);
            }
        }
    });

    function removeFromCart(id: string | null): void {
        if (id !== null) {
            const index = cart.findIndex(item => item.id === id);
            if (index !== -1) {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart)); 
                displayCartItems(cart);
            }
        }
    }

    function addItemToCart(item: Item): void {
        const index = cart.findIndex(cartItem => cartItem.id === item.id);
        if (index === -1) { 
            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems(cart);
        } else {
            alert('Item already added to cart!');
        }
    }
});
