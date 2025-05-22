document.addEventListener('DOMContentLoaded', function() {
    // Хранилище пользователей
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // Элементы интерфейса
    const authButtons = document.querySelector('.auth-buttons');
    const userGreeting = document.createElement('div');
    userGreeting.className = 'user-greeting';
    authButtons.appendChild(userGreeting);

    // Функция для показа уведомлений
    // Улучшенная функция показа уведомлений
    function showMessage(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = notification.querySelector('.notification-message');
        
        // Скрываем предыдущее уведомление перед показом нового
        notification.style.display = 'none';
        void notification.offsetWidth; // Триггер reflow
        
        // Устанавливаем тип и сообщение
        notification.className = 'notification';
        notification.classList.add(type);
        messageEl.textContent = message;
        notification.style.display = 'block';
        
        // Очищаем предыдущие таймеры
        if (notification.timer) {
            clearTimeout(notification.timer);
        }
        
        // Автоматическое скрытие через 3 секунды
        notification.timer = setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
        
        // Возможность закрыть кликом
        notification.onclick = () => {
            notification.style.display = 'none';
            clearTimeout(notification.timer);
        };
    }

    // Обновление интерфейса в зависимости от авторизации
    function updateAuthUI() {
        if (currentUser) {
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('register-btn').style.display = 'none';
            userGreeting.innerHTML = `
                <span>Привет, ${currentUser.name}!</span>
                <button id="logout-btn">Выйти</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', logout);
        } else {
            document.getElementById('login-btn').style.display = 'inline-block';
            document.getElementById('register-btn').style.display = 'inline-block';
            userGreeting.innerHTML = '';
        }
    }

    // Функция выхода
    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
        showMessage('Вы успешно вышли из системы');
    }

    // Инициализация интерфейса
    updateAuthUI();

    // Модальные окна
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeBtns = document.querySelectorAll('.close');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    // Открытие модального окна входа
    loginBtn?.addEventListener('click', function() {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Открытие модального окна регистрации
    registerBtn?.addEventListener('click', function() {
        registerModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Закрытие модальных окон
    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
    
    // Переключение между окнами входа и регистрации
    showRegister?.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
    
    showLogin?.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Мобильное меню
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Обработка формы входа
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            updateAuthUI();
            showMessage(`Добро пожаловать, ${user.name}!`);
        } else {
            showMessage('Неверный email или пароль!', 'error');
        }
    });
    
    // Обработка формы регистрации
    const registerForm = document.getElementById('register-form');
    registerForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            showMessage('Пароли не совпадают!', 'error');
            return;
        }
        
        if (users.some(u => u.email === email)) {
            showMessage('Пользователь с таким email уже существует!', 'error');
            return;
        }
        
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        registerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        updateAuthUI();
        showMessage('Регистрация прошла успешно! Добро пожаловать!');
    });
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
            
            // Закрываем мобильное меню после клика
            nav.classList.remove('active');
        });
    });

    // Корзина покупок
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.fa-shopping-cart');
    
    // Обновление количества товаров в корзине
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const cartBadge = document.querySelector('.cart-badge') || document.createElement('span');
        
        if (count > 0) {
            cartBadge.className = 'cart-badge';
            cartBadge.textContent = count;
            cartIcon.parentNode.appendChild(cartBadge);
        } else {
            const existingBadge = document.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
        }
    }
    
    // Инициализация корзины
    updateCartCount();
    
    // Добавление товара в корзину
    document.querySelectorAll('.product-card .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!currentUser) {
                showMessage('Для добавления товаров в корзину необходимо авторизоваться!', 'warning');
                loginModal.style.display = 'block';
                return;
            }
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent);
            
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
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Анимация добавления в корзину
            const cartPosition = cartIcon.getBoundingClientRect();
            const btnPosition = this.getBoundingClientRect();
            
            const flyingItem = document.createElement('div');
            flyingItem.className = 'flying-item';
            flyingItem.innerHTML = '<i class="fas fa-jug"></i>';
            flyingItem.style.left = `${btnPosition.left}px`;
            flyingItem.style.top = `${btnPosition.top}px`;
            document.body.appendChild(flyingItem);
            
            setTimeout(() => {
                flyingItem.style.left = `${cartPosition.left}px`;
                flyingItem.style.top = `${cartPosition.top}px`;
                flyingItem.style.opacity = '0.5';
                flyingItem.style.transform = 'scale(0.5)';
            }, 10);
            
            setTimeout(() => {
                flyingItem.remove();
            }, 1000);
            
            showMessage(`Товар "${productName}" добавлен в корзину!`);
        });
    });
    
    // Открытие корзины
    cartIcon.addEventListener('click', function() {
        if (cart.length === 0) {
            showMessage('Корзина пуста!', 'info');
            return;
        }
        
        const cartModal = document.createElement('div');
        cartModal.className = 'modal';
        cartModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Ваша корзина</h2>
                <div class="cart-items"></div>
                <div class="cart-total">
                    <strong>Итого: ${cart.reduce((total, item) => total + (item.price * item.quantity), 0)} руб.</strong>
                </div>
                
                <div class="address-section">
                    <label for="address">Адрес доставки:</label>
                    <input type="text" id="address" placeholder="Введите ваш полный адрес с индексом">
                </div>
                
                <div class="payment-section">
                    <h3>Способ оплаты</h3>
                    <div class="payment-methods">
                        <div class="payment-method">
                            <input type="radio" id="cash" name="payment" value="cash" checked>
                            <label for="cash">
                                <i class="fas fa-money-bill-wave payment-icon"></i>
                                Наличными при получении
                            </label>
                        </div>
                        <div class="payment-method">
                            <input type="radio" id="card" name="payment" value="card">
                            <label for="card">
                                <i class="fas fa-credit-card payment-icon"></i>
                                Банковской картой при получении
                            </label>
                        </div>
                    </div>
                </div>
                
                <button class="btn checkout-btn">Оформить заказ</button>
            </div>
        `;
        document.body.appendChild(cartModal);

        // Обработка выбора способа оплаты
        const paymentMethods = cartModal.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
                method.querySelector('input').checked = true;
            });
        });

        // Обработка кнопки оформления
        cartModal.querySelector('.checkout-btn').addEventListener('click', () => {
            const addressInput = cartModal.querySelector('#address');
            const address = addressInput.value.trim();
            const paymentMethod = cartModal.querySelector('input[name="payment"]:checked').value;
            
            if (!address) {
                addressInput.classList.add('error');
                showMessage('Пожалуйста, введите адрес доставки', 'error');
                return;
            }
            
            // Создаем объект заказа
            const order = {
                items: [...cart],
                total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
                address: address,
                payment: paymentMethod,
                date: new Date().toISOString()
            };
            
            // Здесь можно отправить заказ на сервер
            console.log('Заказ оформлен:', order);
            
            // Очищаем корзину
            cart.length = 0;
            localStorage.removeItem('cart');
            updateCartCounter();
            
            // Показываем подтверждение
            showMessage(`Заказ оформлен! Способ оплаты: ${getPaymentMethodName(paymentMethod)}`, 'success');
            cartModal.remove();
        });

        // Вспомогательная функция для получения названия способа оплаты
        function getPaymentMethodName(method) {
            const methods = {
                'cash': 'Наличные при получении',
                'card': 'Банковская карта онлайн',
                'sbp': 'СБП (Система быстрых платежей)'
            };
            return methods[method] || method;
        }

        
        document.body.appendChild(cartModal);
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        const cartItemsContainer = cartModal.querySelector('.cart-items');
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.price} руб. × ${item.quantity} = ${item.price * item.quantity} руб.</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn minus-btn">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn plus-btn">+</button>
                    <button class="btn remove-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            
            // Обработчики для кнопок
            cartItem.querySelector('.plus-btn').addEventListener('click', () => {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartModal();
            });
            
            cartItem.querySelector('.minus-btn').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    if (confirm('Удалить товар из корзины?')) {
                        cart.splice(cart.indexOf(item), 1);
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartModal();
            });
            
            cartItem.querySelector('.remove-btn').addEventListener('click', () => {
                if (confirm('Удалить товар из корзины?')) {
                    cart.splice(cart.indexOf(item), 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartModal();
                }
            });
        });
        
        function updateCartModal() {
            if (cart.length === 0) {
                cartModal.querySelector('.cart-items').innerHTML = '<p>Корзина пуста</p>';
                cartModal.querySelector('.checkout-btn').style.display = 'none';
                cartModal.querySelector('.cart-total').style.display = 'none';
                updateCartCount();
            } else {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartModal.querySelector('.cart-total strong').textContent = `Итого: ${total} руб.`;
                updateCartCount();
            }
        }
        
        // Оформление заказа
        cartModal.querySelector('.checkout-btn')?.addEventListener('click', () => {
            showMessage('Заказ оформлен! Спасибо за покупку!');
            localStorage.removeItem('cart');
            cart.length = 0;
            updateCartCount();
            cartModal.querySelector('.close').click();
        });
        
        // Закрытие модального окна
        cartModal.querySelector('.close').addEventListener('click', () => {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            cartModal.remove();
        });
        
        // Закрытие при клике вне окна
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                cartModal.remove();
            }
        });
    });
    
    // Фильтрация товаров (дополнительный функционал)
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Поиск товаров...';
    filterInput.className = 'filter-input';
    document.querySelector('.products .container').insertBefore(filterInput, document.querySelector('.product-grid'));
    
    filterInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});