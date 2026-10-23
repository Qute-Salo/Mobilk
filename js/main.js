document.addEventListener('DOMContentLoaded', () => {
    
    // Получение данных из кэша браузера
    let cart = JSON.parse(localStorage.getItem('food_cart')) || [];
    
    // Обновление счетчика товаров в header
    function updateCartCounter() {
        const counter = document.querySelector('.cart-count');
        if (counter) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            counter.textContent = totalItems;
        }
    }

    // Логика страницы МЕНЮ
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productName = productCard.querySelector('.product-name').textContent;
                const productPrice = parseInt(productCard.querySelector('.product-price').textContent);
                
                const existingItem = cart.find(item => item.name === productName);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('food_cart', JSON.stringify(cart));
                updateCartCounter();
                
                // Анимация успешного добавления
                const originalText = button.textContent;
                button.textContent = 'Добавлено! ✓';
                button.style.background = '#2ed573';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '#ff4757';
                    button.disabled = false;
                }, 1000);
            });
        });
    }

    // Логика страницы ОФОРМЛЕНИЯ ЗАКАЗА
    const cartContainer = document.getElementById('cart-items-container');
    
    if (cartContainer) {
        function renderCheckoutCart() {
            cartContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p style="color:#747d8c; text-align:center; padding: 1rem 0;">Ваша корзина пуста</p>';
                document.getElementById('items-subtotal').textContent = '0 ₽';
                document.getElementById('final-total-price').textContent = '0 ₽';
                return;
            }
            
            let subtotal = 0;
            
            cart.forEach((item, index) => {
                const itemCost = item.price * item.quantity;
                subtotal += itemCost;
                
                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item-flex';
                itemRow.innerHTML = `
                    <span class="item-name">${item.name}</span>
                    <span class="item-count">${item.quantity} шт.</span>
                    <span class="item-price">${itemCost} ₽</span>
                    <button class="btn-delete-item" data-index="${index}" style="background:none; border:none; color:#ff4757; cursor:pointer; margin-left:0.5rem;"><i class="fa-solid fa-trash"></i></button>
                `;
                cartContainer.appendChild(itemRow);
            });
            
            document.getElementById('items-subtotal').textContent = `${subtotal} ₽`;
            document.getElementById('final-total-price').textContent = `${subtotal} ₽`;
            
            // Удаление элементов
            const deleteButtons = document.querySelectorAll('.btn-delete-item');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const indexToDelete = btn.getAttribute('data-index');
                    cart.splice(indexToDelete, 1);
                    localStorage.setItem('food_cart', JSON.stringify(cart));
                    renderCheckoutCart();
                    updateCartCounter();
                });
            });
        }
        
        renderCheckoutCart();
        
        const deliveryForm = document.querySelector('.delivery-form');
        if (deliveryForm) {
            deliveryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Спасибо за заказ! Наш курьер уже выезжает.');
                cart = [];
                localStorage.removeItem('food_cart');
                window.location.href = 'index.html';
            });
        }
    }

    updateCartCounter();
});
