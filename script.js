const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const customCakeModal = document.getElementById('custom-cake-modal');
const openCustomModalButtons = document.querySelectorAll('.open-custom-modal');
const closeCustomModalButton = document.getElementById('close-custom-modal');
const addCustomCakeButton = document.getElementById('add-custom-cake');
const customCakeDescription = document.getElementById('custom-cake-description');

let cart = [];

// Abrir o Modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o Modal do carrinho
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(event){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        openProductModal(name, price)
    }
})

// Abrir o modal de bolo personalizado
openCustomModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        customCakeModal.style.display = 'flex';
    });
});

// Fechar o modal de bolo personalizado
closeCustomModalButton.addEventListener('click', () => {
    customCakeModal.style.display = 'none';
});

// Adicionar bolo personalizado ao carrinho
addCustomCakeButton.addEventListener('click', () => {
    const description = customCakeDescription.value.trim();
    if (description) {
        addToCart('Bolo Personalizado', 0, 1, null, null, description);
        customCakeModal.style.display = 'none';
        customCakeDescription.value = '';
        updateCartModal();
        Toastify({
            text: "Bolo personalizado adicionado ao carrinho!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    } else {
        Toastify({
            text: "Por favor, descreva seu bolo personalizado.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
        }).showToast();
    }
});


// Função para abrir o modal do produto
function openProductModal(name, price) {
    const isCake = name.toLowerCase().includes('bolo');
    const isSweet = !isCake && (name.toLowerCase().includes('doce') || name.toLowerCase().includes('bolacha'));
    
    const modal = document.createElement('div');
    modal.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg w-96 shadow-xl">
            <div class="relative h-48 mb-4">
                <img src="./assets/${name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${name}" class="w-full h-full object-cover rounded-t-lg">
            </div>
            <h2 class="text-xl font-bold mb-3 text-center">${name}</h2>
            <p class="mb-3 text-center">Preço base: ${price.toFixed(2)}€${isCake ? '/kg' : ''}</p>
            <div class="mb-3">
                <label class="block mb-1 text-sm font-medium">Quantidade:</label>
                <input type="number" class="quantity w-full border p-2 rounded mb-2" min="1" value="1">
                ${isSweet ? `
                <label class="block mb-1 text-sm font-medium">Ou escolha uma promoção:</label>
                <select class="promo-quantity w-full border p-2 rounded">
                    <option value="">Sem promoção</option>
                    <option value="15">15 (10% desconto)</option>
                    <option value="25">25 (10% desconto)</option>
                    <option value="35">35 (10% desconto)</option>
                    <option value="45">45 (10% desconto)</option>
                </select>
                ` : ''}
            </div>
            ${isCake ? `
            <div class="mb-3">
                <label class="block mb-1 text-sm font-medium">Peso (kg):</label>
                <input type="number" class="weight w-full border p-2 rounded" min="1" step="0.5" value="1">
            </div>
            ` : ''}
            <p class="mb-4 text-lg font-bold text-center">
                Total: <span class="old-price hidden"></span> <span class="total">${price.toFixed(2)}</span>€
            </p>
            <div class="flex justify-between">
                <button class="confirm-add bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out">Adicionar ao Carrinho</button>
                <button class="cancel bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out">Cancelar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const quantityInput = modal.querySelector('.quantity');
    const promoSelect = modal.querySelector('.promo-quantity');
    const weightInput = modal.querySelector('.weight');
    const totalSpan = modal.querySelector('.total');
    const oldPriceSpan = modal.querySelector('.old-price');
    const confirmBtn = modal.querySelector('.confirm-add');
    const cancelBtn = modal.querySelector('.cancel');

    function updateTotal() {
        let quantity = parseInt(quantityInput.value);
        const promoQuantity = promoSelect ? parseInt(promoSelect.value) : 0;
        const weight = isCake ? parseFloat(weightInput.value) : 1;
        let total = (promoQuantity || quantity) * weight * price;
        let oldPrice = total;
    
        if (isSweet && promoQuantity) {
            oldPrice = total;
            total *= 0.9; // 10% discount
            oldPriceSpan.textContent = oldPrice.toFixed(2) + '€ ';
            oldPriceSpan.classList.remove('hidden');
            oldPriceSpan.style.textDecoration = 'line-through';
            oldPriceSpan.style.color = 'gray';
        } else {
            oldPriceSpan.classList.add('hidden');
        }
    
        totalSpan.textContent = total.toFixed(2);
    }
    
    quantityInput.addEventListener('input', () => {
        if (promoSelect) promoSelect.value = "";
        updateTotal();
    });

    if (promoSelect) {
        promoSelect.addEventListener('change', () => {
            if (promoSelect.value) {
                quantityInput.value = promoSelect.value;
                quantityInput.disabled = true;
            } else {
                quantityInput.disabled = false;
            }
            updateTotal();
        });
    }

    if (isCake) {
        weightInput.addEventListener('input', updateTotal);
    }

    confirmBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const weight = isCake ? parseFloat(weightInput.value) : null;
        const total = parseFloat(totalSpan.textContent);
        const oldPrice = oldPriceSpan.classList.contains('hidden') ? null : parseFloat(oldPriceSpan.textContent);
        addToCart(name, total, quantity, weight, oldPrice);
        document.body.removeChild(modal);
    });

    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    updateTotal(); // Initial update
}





//funcao para adicionar ao carrinho
function addToCart(name, price, quantity, weight, oldPrice, description = '') {
    const existingItem = cart.find(item => item.name === name && item.weight === weight && item.description === description);

    if (existingItem && !oldPrice) {
        existingItem.quantity += quantity;
        existingItem.price += price;
    } else {
        cart.push({
            name,
            price,
            quantity,
            weight,
            oldPrice,
            description,
            image: `./assets/${name.toLowerCase().replace(/ /g, '-')}.jpg`
        });
    }

    updateCartModal();
}


// Função para atualizar o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col", "border-b", "pb-4");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                    <div>
                        <p class="font-medium">${item.name}</p>
                        ${item.description ? `<p class="text-sm text-gray-600">${item.description}</p>` : ''}
                        <p class="text-gray-500 text-sm">Quantidade: ${item.quantity}</p>
                        ${item.weight ? `<p class="text-gray-500 text-sm">Peso: ${item.weight.toFixed(1)}kg</p>` : ''}
                        <p class="font-medium mt-1">
                            ${item.oldPrice ? `<span class="line-through text-gray-500">${item.oldPrice.toFixed(2)}€</span> ` : ''}
                            ${item.price ? item.price.toFixed(2) + '€' : 'Preço sob consulta'}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col items-end">
                    ${!item.oldPrice && item.quantity > 1 ? `
                        <button class="decrease-quantity-btn text-blue-500 font-medium mb-2" data-name="${item.name}" data-description="${item.description || ''}" data-weight="${item.weight || ''}">
                            Remover 1
                        </button>
                    ` : ''}
                    <button class="remove-from-cart-btn text-red-500 font-medium" data-name="${item.name}" data-description="${item.description || ''}" data-weight="${item.weight || ''}">
                        Remover Tudo
                    </button>
                </div>
            </div>
        `;

        total += item.price || 0;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-PT", {
        style: "currency",
        currency: "EUR"
    });

    cartCounter.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}





//funcao para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    const name = event.target.getAttribute("data-name");
    const description = event.target.getAttribute("data-description");
    const weight = parseFloat(event.target.getAttribute("data-weight"));
    if (event.target.classList.contains("remove-from-cart-btn")) {
        removeItemCart(name, description, weight);
    } else if (event.target.classList.contains("decrease-quantity-btn")) {
        decreaseItemQuantity(name, description, weight);
    }
});

function decreaseItemQuantity(name, description, weight) {
    const index = cart.findIndex(item => item.name === name && item.description === description && item.weight === weight);

    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            if (cart[index].price) {
                cart[index].price -= cart[index].price / (cart[index].quantity + 1);
            }
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

function removeItemCart(name, description, weight) {
    const index = cart.findIndex(item => item.name === name && item.description === description && item.weight === weight);

    if (index !== -1) {
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "A Pastelaria está fechada",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
        return;
    }

    if(cart.length == 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Preparar a mensagem do pedido
    const cartItems = cart.map((item, index) => {
        return `*Item ${index + 1}:*
🍰 *${item.name}*
📦 Quantidade: ${item.quantity}
${item.weight ? `⚖️ Peso: ${item.weight.toFixed(1)}kg` : ''}
${item.description ? `📝 Descrição: ${item.description}` : ''}
${item.oldPrice ? `💰 Preço original: ${item.oldPrice.toFixed(2)}€` : ''}
💳 Preço final: ${item.price.toFixed(2)}€
`;
    }).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    const message = encodeURIComponent(`🎂 *Novo Pedido* 🎂

${cartItems}
------------------------
💰 *Total do pedido:* ${total.toFixed(2)}€
🏠 *Morada de entrega:* ${addressInput.value}

Obrigado pela sua preferência! 😊`);

    const phone = "932469242";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpar o carrinho e atualizar a interface
    cart = [];
    updateCartModal();
    addressInput.value = '';
})


//verificar a hora e manipular o card do horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 13 && hora < 20;
    //true = restaurante
}

const spanItem = document.getElementById("date-spam")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}

let slideIndex = 0;

function showSlides() {
    let slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.add('hidden');
    });

    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}

    slides[slideIndex - 1].classList.remove('hidden');

    setTimeout(showSlides, 5000); // Muda a cada 5 segundos
}

showSlides();
