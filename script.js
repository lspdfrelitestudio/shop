/* ============================================
   LSPDFR ELITE STUDIO - Main JavaScript
   ============================================ */

/* ============================================
   CONFIGURATION (Зміни тут ціни, посилання, товари)
   ============================================ */
const CONFIG = {
    // Google Auth Client ID
    GOOGLE_CLIENT_ID: '637144604768-b3rfbbg673ahe3ii0mjuhofn0e7qi7jm.apps.googleusercontent.com',
    
    // Discord Webhook URL для оформлення замовлень
    // ЗАМІНІТЬ НА ВАШ ВЕБХУК!
    DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE',
    
    // Discord server link (редагуйте для зміни посилання)
    DISCORD_LINK: 'https://discord.gg/your-server',
    
    // Discord QR API link
    DISCORD_QR_LINK: 'https://discord.gg/your-server',
    
    // Товари магазину
    PRODUCTS: {
        basic: {
            id: 'basic',
            name: 'Пак "Звичайний"',
            price: 150,
            cars: 28,
            description: 'Базовий набір для сервера',
            image: 'https://via.placeholder.com/800x400/1a1a2e/eab308?text=Basic+Pack'
        },
        premium: {
            id: 'premium',
            name: 'Пак "Преміум"',
            price: 300,
            cars: 18,
            description: 'Повний набір з підтримкою',
            image: 'https://via.placeholder.com/800x400/1a1a2e/eab308?text=Premium+Pack'
        },
        duster: {
            id: 'duster',
            name: 'Renault Duster 2024 Pack',
            price: 500,
            cars: 4,
            description: 'Сучасний поліцейський SUV',
            image: 'https://via.placeholder.com/800x400/1a1a2e/eab308?text=Renault+Duster'
        }
    },
    
    // Автомобілі для 360° галереї
    CARS_360: [
        { name: 'Toyota Prius Police', angle: 1 },
        { name: 'Toyota Prius Police', angle: 10 },
        { name: 'Toyota Prius Police', angle: 18 },
        { name: 'Toyota Prius Police', angle: 27 },
        { name: 'Toyota Prius Police', angle: 36 }
    ],
    
    // Графік роботи підтримки (години)
    SUPPORT_HOURS: {
        start: 10,  // 10:00
        end: 22     // 22:00
    },
    
    // AI Responses для чату
    AI_RESPONSES: {
        greetings: [
            'Вітаю! Я віртуальний помічник LSPDFR Elite Studio. Чим можу допомогти?',
            'Привіт! Радий вас бачити! Як можу допомогти з вибором пакету?',
            'Привіт! Чим можу бути корисним?'
        ],
        products: {
            keywords: ['пак', 'товар', 'купити', 'ціна', 'авто', 'машина'],
            responses: [
                'У нас є три пакети: Звичайний (150₴ - 28 авто), Преміум (300₴ - 18 авто) та Renault Duster (500₴ - 4 авто). Який вас цікавить?',
                'Рекомендую пак Преміум - найкраще співвідношення ціни та якості!',
                'Всі пакети включають оновлення та підтримку. Преміум має пріоритетну підтримку та ексклюзивні авто.'
            ]
        },
        support: {
            keywords: ['підтримка', 'допомога', 'проблема', 'помилка'],
            responses: [
                'Якщо у вас виникла проблема, напишіть, будь ласка, детальніше. Ми постараємось допомогти!',
                'Для термінової підтримки зверніться до нашого Discord серверу.',
                'Опишіть вашу проблему, і ми передамо її нашій команді.'
            ]
        },
        default: [
            'Дякую за повідомлення! Наш менеджер зв\'яжеться з вами найближчим часом.',
            'Цікаве питання! Я передам його нашій команді.',
            'Розумію. Можу я ще чимось допомогти?'
        ]
    },
    
    // Live Sales налаштування
    LIVE_SALES: {
        enabled: true,
        interval: 15000, // 15 секунд
        names: ['AlexPolice', 'MaxDriver', 'JohnCop', 'MikePatrol', 'SamOfficer', 'KateEnforcement', 'TomSheriff']
    }
};

/* ============================================
   STATE MANAGEMENT
   ============================================ */
const state = {
    user: null,
    cart: [],
    promoCode: null,
    promoDiscount: 0,
    isLoggedIn: false
};

/* ============================================
   DOM ELEMENTS
   ============================================ */
const elements = {
    // Hero
    heroVideo: document.getElementById('hero-video'),
    
    // Auth
    loginModal: document.getElementById('login-modal'),
    openLoginBtn: document.getElementById('open-login-btn'),
    closeLoginBtn: document.getElementById('close-login'),
    cabinetSection: document.getElementById('cabinet'),
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Cart
    cartBtn: document.getElementById('cart-btn'),
    cartSidebar: document.getElementById('cart-sidebar'),
    closeCartBtn: document.getElementById('close-cart'),
    cartItems: document.getElementById('cart-items'),
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total'),
    promoInput: document.getElementById('promo-input'),
    applyPromoBtn: document.getElementById('apply-promo'),
    checkoutBtn: document.getElementById('checkout-btn'),
    
    // Shop
    buyButtons: document.querySelectorAll('.buy-btn'),
    
    // 360 Gallery
    slider360: document.getElementById('360-slider'),
    carImage360: document.getElementById('car-360-image'),
    carName360: document.getElementById('car-name'),
    
    // Support
    supportBtn: document.getElementById('support-btn'),
    chatWindow: document.getElementById('chat-window'),
    closeChatBtn: document.getElementById('close-chat'),
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    
    // Live Sales
    liveSales: document.getElementById('live-sales'),
    liveNick: document.getElementById('live-nick'),
    
    // Footer
    discordLink: document.getElementById('discord-link'),
    qrCodeImg: document.querySelector('#footer img')
};

/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize all modules
    initVideoBackground();
    initAuth();
    initCart();
    initShop();
    init360Gallery();
    initSupport();
    initLiveSales();
    initFooter();
    
    console.log('LSPDFR Elite Studio initialized successfully!');
}

/* ============================================
   1. VIDEO BACKGROUND (Hero Section)
   ============================================ */
function initVideoBackground() {
    if (elements.heroVideo) {
        // Ensure video is muted for autoplay
        elements.heroVideo.muted = true;
        elements.heroVideo.playsInline = true;
        
        // Handle video loading errors
        elements.heroVideo.addEventListener('error', () => {
            console.warn('Video failed to load, showing fallback background');
            elements.heroVideo.style.display = 'none';
            document.getElementById('hero').style.background = 
                'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        });
        
        // Retry play if autoplay was blocked
        document.addEventListener('click', () => {
            if (elements.heroVideo.paused) {
                elements.heroVideo.play().catch(() => {});
            }
        }, { once: true });
    }
}

/* ============================================
   2. GOOGLE AUTHENTICATION
   ============================================ */
function initAuth() {
    // Open login modal
    elements.openLoginBtn?.addEventListener('click', () => {
        elements.loginModal?.classList.remove('hidden');
    });
    
    // Close login modal
    elements.closeLoginBtn?.addEventListener('click', () => {
        elements.loginModal?.classList.add('hidden');
    });
    
    // Close modal on outside click
    elements.loginModal?.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) {
            elements.loginModal.classList.add('hidden');
        }
    });
    
    // Logout
    elements.logoutBtn?.addEventListener('click', logout);
    
    // Check for stored session
    checkStoredSession();
}

// Google Identity callback
function handleCredentialResponse(response) {
    // Decode the JWT token
    const responsePayload = decodeJWT(response.credential);
    
    if (responsePayload) {
        // Store user data
        state.user = {
            name: responsePayload.name,
            email: responsePayload.email,
            picture: responsePayload.picture
        };
        state.isLoggedIn = true;
        
        // Save to localStorage
        localStorage.setItem('lspdfr_user', JSON.stringify(state.user));
        
        // Update UI
        updateUserUI();
        
        // Close modal
        elements.loginModal?.classList.add('hidden');
        
        console.log('User logged in:', state.user.name);
    }
}

// Decode JWT token
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding JWT:', e);
        return null;
    }
}

// Check for stored session
function checkStoredSession() {
    const storedUser = localStorage.getItem('lspdfr_user');
    if (storedUser) {
        try {
            state.user = JSON.parse(storedUser);
            state.isLoggedIn = true;
            updateUserUI();
        } catch (e) {
            localStorage.removeItem('lspdfr_user');
        }
    }
}

// Update user UI
function updateUserUI() {
    if (state.isLoggedIn && state.user) {
        elements.cabinetSection?.classList.remove('hidden');
        
        if (elements.userAvatar) {
            elements.userAvatar.src = state.user.picture;
            elements.userAvatar.classList.remove('hidden');
        }
        
        if (elements.userName) {
            elements.userName.textContent = state.user.name;
            elements.userName.classList.remove('hidden');
        }
        
        elements.logoutBtn?.classList.remove('hidden');
    }
}

// Logout function
function logout() {
    state.user = null;
    state.isLoggedIn = false;
    localStorage.removeItem('lspdfr_user');
    
    elements.cabinetSection?.classList.add('hidden');
    elements.userAvatar?.classList.add('hidden');
    elements.userName?.classList.add('hidden');
    elements.logoutBtn?.classList.add('hidden');
    
    console.log('User logged out');
}

/* ============================================
   3. CART FUNCTIONALITY
   ============================================ */
function initCart() {
    // Open cart sidebar
    elements.cartBtn?.addEventListener('click', () => {
        elements.cartSidebar?.classList.add('open');
    });
    
    // Close cart sidebar
    elements.closeCartBtn?.addEventListener('click', () => {
        elements.cartSidebar?.classList.remove('open');
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (elements.cartSidebar?.classList.contains('open') && 
            !elements.cartSidebar.contains(e.target) && 
            e.target !== elements.cartBtn &&
            !elements.cartBtn.contains(e.target)) {
            elements.cartSidebar.classList.remove('open');
        }
    });
    
    // Apply promo code
    elements.applyPromoBtn?.addEventListener('click', applyPromoCode);
    
    // Checkout
    elements.checkoutBtn?.addEventListener('click', checkout);
    
    // Update cart UI
    updateCartUI();
}

// Add item to cart with animation
function addToCart(productId, buttonElement) {
    const product = CONFIG.PRODUCTS[productId];
    if (!product) return;
    
    // Create flying item animation
    if (buttonElement) {
        const flyingItem = createFlyingItem(buttonElement, product);
        document.body.appendChild(flyingItem);
        
        // Remove flying item after animation
        setTimeout(() => {
            flyingItem.remove();
            
            // Add to cart after animation
            addItemToCart(product);
        }, 800);
    } else {
        addItemToCart(product);
    }
}

// Create flying item element
function createFlyingItem(button, product) {
    const rect = button.getBoundingClientRect();
    const cartRect = elements.cartBtn.getBoundingClientRect();
    
    const item = document.createElement('div');
    item.className = 'flying-item';
    item.innerHTML = `
        <div class="w-16 h-10 bg-gold rounded-lg flex items-center justify-center text-black font-bold text-xs">
            ${product.name.substring(0, 10)}
        </div>
    `;
    
    item.style.left = rect.left + rect.width / 2 - 32 + 'px';
    item.style.top = rect.top + rect.height / 2 - 20 + 'px';
    
    return item;
}

// Add item to cart array
function addItemToCart(product) {
    const existingItem = state.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Show success feedback
    showToast(`Додано: ${product.name}`);
    
    // Update cart UI
    updateCartUI();
}

// Remove item from cart
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, delta) {
    const item = state.cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Apply promo code
function applyPromoCode() {
    const code = elements.promoInput?.value.trim().toUpperCase();
    
    if (!code) {
        showToast('Введіть промокод');
        return;
    }
    
    // Тут можна додати перевірку промокодів
    const promoCodes = {
        'WELCOME10': 10,
        'PREMIUM20': 20,
        'ELITE30': 30
    };
    
    if (promoCodes[code]) {
        state.promoCode = code;
        state.promoDiscount = promoCodes[code];
        showToast(`Промокод застосовано! Знижка ${state.promoDiscount}%`);
        updateCartUI();
    } else {
        showToast('Невірний промокод');
    }
}

// Calculate total
function calculateTotal() {
    let subtotal = state.cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    if (state.promoDiscount > 0) {
        subtotal = subtotal * (1 - state.promoDiscount / 100);
    }
    
    return subtotal;
}

// Update cart UI
function updateCartUI() {
    // Update count
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (elements.cartCount) {
        elements.cartCount.textContent = totalCount;
    }
    
    // Update items
    if (elements.cartItems) {
        if (state.cart.length === 0) {
            elements.cartItems.innerHTML = '<p class="text-gray-400 text-center">Кошик порожній</p>';
        } else {
            elements.cartItems.innerHTML = state.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm">${item.name}</h4>
                        <p class="text-gold text-sm">${item.price} ₴</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update total
    if (elements.cartTotal) {
        elements.cartTotal.textContent = calculateTotal() + ' ₴';
    }
}

// Checkout function
async function checkout() {
    if (state.cart.length === 0) {
        showToast('Кошик порожній!');
        return;
    }
    
    // Create order message
    const orderDetails = state.cart.map(item => 
        `• ${item.name} x${item.quantity} - ${item.price * item.quantity}₴`
    ).join('\n');
    
    const total = calculateTotal();
    const promoText = state.promoCode ? `\nПромокод: ${state.promoCode} (-${state.promoDiscount}%)` : '';
    
    const orderMessage = {
        content: `🛒 **Нове замовлення LSPDFR Elite Studio**`,
        embeds: [{
            title: 'Деталі замовлення',
            color: 0xeab308,
            fields: [
                {
                    name: 'Товари',
                    value: orderDetails,
                    inline: false
                },
                {
                    name: 'Разом',
                    value: `${total} ₴${promoText}`,
                    inline: false
                },
                {
                    name: 'Користувач',
                    value: state.user ? state.user.email : 'Гість',
                    inline: false
                }
            ],
            timestamp: new Date().toISOString()
        }]
    };
    
    // Send to Discord webhook
    try {
        const response = await fetch(CONFIG.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderMessage)
        });
        
        if (response.ok) {
            showToast('Замовлення оформлено! Очікуйте на зв\'язок у Discord.');
            state.cart = [];
            state.promoCode = null;
            state.promoDiscount = 0;
            updateCartUI();
            elements.cartSidebar?.classList.remove('open');
        } else {
            showToast('Помилка оформлення. Спробуйте ще раз.');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Помилка з\'єднання. Спробуйте пізніше.');
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gold px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.innerHTML = `
        <p class="text-white font-semibold">${message}</p>
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* ============================================
   4. SHOP FUNCTIONALITY
   ============================================ */
function initShop() {
    elements.buyButtons?.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard?.dataset.id;
            
            if (productId) {
                addToCart(productId, this);
            }
        });
    });
}

/* ============================================
   5. 360 GALLERY
   ============================================ */
function init360Gallery() {
    if (!elements.slider360) return;
    
    elements.slider360.addEventListener('input', function() {
        const value = parseInt(this.value);
        const max = parseInt(this.max);
        
        // Update slider progress
        const progress = ((value - 1) / (max - 1)) * 100;
        this.style.setProperty('--progress', progress + '%');
        
        // Update image
        updateCarImage(value);
    });
}

function updateCarImage(angle) {
    // Map angle ranges to different car views
    let carIndex = 0;
    if (angle >= 1 && angle <= 9) carIndex = 0;
    else if (angle >= 10 && angle <= 17) carIndex = 1;
    else if (angle >= 18 && angle <= 26) carIndex = 2;
    else if (angle >= 27 && angle <= 35) carIndex = 3;
    else if (angle >= 36) carIndex = 4;
    
    const car = CONFIG.CARS_360[carIndex];
    
    if (elements.carImage360) {
        // Generate different placeholder images based on angle
        const imageUrl = `https://via.placeholder.com/800x400/1a1a2e/eab308?text=Police+Car+${carIndex * 45}°`;
        elements.carImage360.src = imageUrl;
    }
    
    if (elements.carName360) {
        elements.carName360.textContent = car.name;
    }
}

/* ============================================
   6. SMART SUPPORT
   ============================================ */
function initSupport() {
    if (!elements.supportBtn) return;
    
    elements.supportBtn.addEventListener('click', handleSupportClick);
    elements.closeChatBtn?.addEventListener('click', () => {
        elements.chatWindow?.classList.add('hidden');
    });
    
    // Chat input handler
    elements.chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function handleSupportClick() {
    const currentHour = new Date().getHours();
    
    // Check if within support hours
    if (currentHour >= CONFIG.SUPPORT_HOURS.start && currentHour < CONFIG.SUPPORT_HOURS.end) {
        // Show chat window
        elements.chatWindow?.classList.remove('hidden');
        
        // Add greeting message
        addChatMessage('bot', getRandomResponse('greetings'));
    } else {
        // Show out of hours message
        showOutOfHoursMessage();
    }
}

function showOutOfHoursMessage() {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-red-500 px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <p class="font-semibold text-white">Підтримка не працює</p>
                <p class="text-gray-400 text-sm">Підтримка працює з ${CONFIG.SUPPORT_HOURS.start}:00 до ${CONFIG.SUPPORT_HOURS.end}:00. Залиште повідомлення, ми відповімо вранці!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function sendMessage() {
    const message = elements.chatInput?.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage('user', message);
    
    // Clear input
    elements.chatInput.value = '';
    
    // Get bot response after delay
    setTimeout(() => {
        const response = getBotResponse(message);
        addChatMessage('bot', response);
        
        // Scroll to bottom
        elements.chatMessages?.scrollTo({
            top: elements.chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }, 500);
}

function addChatMessage(type, text) {
    if (!elements.chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full ${type === 'bot' ? 'bg-gold' : 'bg-gray-600'} flex-shrink-0 flex items-center justify-center">
            <span class="text-${type === 'bot' ? 'black' : 'white'} text-xs font-bold">${type === 'bot' ? 'AI' : 'U'}</span>
        </div>
        <div class="message-content">
            <p class="text-sm">${text}</p>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for product keywords
    for (const category in CONFIG.AI_RESPONSES) {
        if (category === 'greetings' || category === 'default') continue;
        
        const keywords = CONFIG.AI_RESPONSES[category].keywords;
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return getRandomResponse(category);
        }
    }
    
    return getRandomResponse('default');
}

function getRandomResponse(category) {
    const responses = CONFIG.AI_RESPONSES[category];
    if (Array.isArray(responses)) {
        return responses[Math.floor(Math.random() * responses.length)];
    } else if (responses && Array.isArray(responses.responses)) {
        return responses.responses[Math.floor(Math.random() * responses.responses.length)];
    }
    return CONFIG.AI_RESPONSES.default[0];
}

/* ============================================
   7. LIVE SALES NOTIFICATIONS
   ============================================ */
let liveSalesInterval = null;

function initLiveSales() {
    if (!CONFIG.LIVE_SALES.enabled) return;
    
    // Start live sales simulation
    liveSalesInterval = setInterval(() => {
        showLiveSale();
    }, CONFIG.LIVE_SALES.interval);
}

function showLiveSale() {
    // Get random name
    const names = CONFIG.LIVE_SALES.names;
    const randomName = names[Math.floor(Math.random() * names.length)];
    const products = Object.values(CONFIG.PRODUCTS);
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    // Update notification
    if (elements.liveNick) {
        elements.liveNick.textContent = randomName;
    }
    
    // Update message based on product
    const messageEl = elements.liveSales?.querySelector('p:last-child');
    if (messageEl) {
        messageEl.textContent = `приджав ${randomProduct.name.split(' ')[0]}!`;
    }
    
    // Show notification
    elements.liveSales?.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        elements.liveSales?.classList.add('hidden');
    }, 5000);
}

/* ============================================
   8. FOOTER INITIALIZATION
   ============================================ */
function initFooter() {
    // Update Discord link
    if (elements.discordLink) {
        elements.discordLink.href = CONFIG.DISCORD_LINK;
    }
    
    // Update QR code
    const qrImg = document.querySelector('#footer img');
    if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(CONFIG.DISCORD_QR_LINK)}`;
    }
}

/* ============================================
   GLOBAL FUNCTIONS (for onclick handlers)
   ============================================ */
window.updateQuantity = updateQuantity;
window.handleCredentialResponse = handleCredentialResponse;
