/*
============================================================
MAIN JAVASCRIPT (app.js)
- This file is shared across all pages
============================================================
*/

/* 
document.addEventListener('DOMContentLoaded', () => {

    // --- [1] E-COMMERCE APP LOGIC ---
    // This object manages the shop, cart, and wishlist state.
    const App = { 
        products: [ { id: 1, name: 'Nebula Flow Dress', category: 'dress', price: 799, image: 'img1.jpeg' }, { id: 2, name: 'Geometric Sun Dress', category: 'dress', price: 599, image: 'img2.jpeg' }, { id: 3, name: 'Mandala Maxi Dress', category: 'dress', price: 549, image: 'img3.jpeg' }, { id: 4, name: 'Symmetric Shift Dress', category: 'dress', price: 499, image: 'img4.jpeg' }, { id: 5, name: 'Cosmic Tote Bag', category: 'bag', price: 299, image: 'img5.jpeg' }, { id: 6, name: 'Lotus Crossbody Bag', category: 'bag', price: 279, image: 'img6.jpeg' }, { id: 7, name: 'Patterned Backpack', category: 'bag', price: 299, image: 'img7.jpeg' }, { id: 8, name: 'Embroidered Pouch', category: 'bag', price: 249, image: 'img8.jpeg' }, { id: 9, name: 'Serenity Pillow Cover', category: 'pillow', price: 249, image: 'img9.jpeg' }, { id: 10, name: 'Vibrant Mandala Cushion', category: 'pillow', price: 249, image: 'img10.jpeg' }, { id: 11, name: 'Geometric Accent Pillow', category: 'pillow', price: 249, image: 'img11.jpeg' }, { id: 12, name: 'Kolam Line Art Pillow', category: 'pillow', price: 249, image: 'img12.jpeg' }, { id: 13, name: 'Galaxy Mandala Tapestry', category: 'wall', price: 349, image: 'img13.jpeg' }, { id: 14, name: 'Sun & Moon Wall Art', category: 'wall', price: 299, image: 'img14.jpeg' }, { id: 15, name: 'Seven Chakras Hanging', category: 'wall', price: 299, image: 'img15.jpeg' }, { id: 16, name: 'Digital Bloom Canvas', category: 'wall', price: 299, image: 'img16.jpeg' }, ], 
        state: { cart: [], wishlist: [], orders: [], activeFilter: 'all' }, 
        
        // Initialization function, runs on page load
        init() { 
            this.loadState(); 
            this.renderProducts(); // Only runs if product grid exists
            this.updateCounters(); // Only runs if counters exist
            this.attachEventListeners(); 
            this.attachModalListeners(); // Attaches to *all* modals
        }, 
        
        // Load cart/wishlist from browser's local storage
        loadState() { const c=localStorage.getItem('rangVigyaan_cart'),w=localStorage.getItem('rangVigyaan_wishlist'),o=localStorage.getItem('rangVigyaan_orders'); if(c)this.state.cart=JSON.parse(c); if(w)this.state.wishlist=JSON.parse(w); if(o)this.state.orders=JSON.parse(o); }, 
        
        // Save cart/wishlist to browser's local storage
        saveState() { localStorage.setItem('rangVigyaan_cart', JSON.stringify(this.state.cart)); localStorage.setItem('rangVigyaan_wishlist', JSON.stringify(this.state.wishlist)); localStorage.setItem('rangVigyaan_orders', JSON.stringify(this.state.orders)); }, 
        
        // Renders the products on the Shop page
        renderProducts() { 
            const grid=document.getElementById('product-grid'); 
            if (!grid) return; // <-- IMPORTANT: Won't break on other pages
            const filtered=this.state.activeFilter==='all'?this.products:this.products.filter(p=>p.category===this.state.activeFilter); 
            grid.innerHTML=filtered.map(p=>{const inWish=this.state.wishlist.includes(p.id),inCart=this.state.cart.some(i=>i.id===p.id);return ` <div class="card-item glass-card glowing-border" style="animation-delay: ${filtered.indexOf(p)*50}ms"> <div class="card-content-wrapper"> <img src="${p.image}" alt="${p.name}" class="product-card-img"> <div class="p-6 flex-grow flex flex-col"> <h3 class="text-xl font-bold page-title">${p.name}</h3> <div class="mt-4 flex-grow flex justify-between items-center"> <span class="text-2xl font-bold text-white">₹${p.price}</span> <div class="flex items-center gap-2"> <button class="icon-btn wishlist-toggle-btn ${inWish?'active':''}" data-id="${p.id}" title="Wishlist"><i data-lucide="heart"></i></button> <button class="btn !px-4 !py-2 add-to-cart-btn" data-id="${p.id}">${inCart?'In Cart':'Add'}</button> </div> </div> </div> </div> </div>`}).join(''); 
            this.applyMesmerizingEffects(); 
            lucide.createIcons(); 
        }, 
        
        // Updates the red number counters on the header icons
        updateCounters() { 
            const c = this.state.cart.reduce((s, i) => s + i.quantity, 0);
            const w = this.state.wishlist.length;
            const cc = document.getElementById('cart-counter');
            const wc = document.getElementById('wishlist-counter');
            
            if (cc) { cc.textContent = c; cc.classList.toggle('hidden', c === 0); } 
            if (wc) { wc.textContent = w; wc.classList.toggle('hidden', w === 0); } 
        }, 
        
        // Attaches click listeners for shop filters and product buttons
        attachEventListeners() { 
            const pg=document.getElementById('product-grid'); 
            if(pg){pg.addEventListener('click',e=>{const acb=e.target.closest('.add-to-cart-btn'),wtb=e.target.closest('.wishlist-toggle-btn'); if(acb)this.addToCart(parseInt(acb.dataset.id)); if(wtb)this.toggleWishlist(parseInt(wtb.dataset.id));});} 
            const fc=document.getElementById('filter-container'); 
            if(fc){fc.addEventListener('click',e=>{if(e.target.matches('.filter-btn')){const activeBtn = fc.querySelector('.filter-btn.active'); if(activeBtn) activeBtn.classList.remove('active'); e.target.classList.add('active');this.state.activeFilter=e.target.dataset.category;this.renderProducts();}}); } 
        }, 
        
        addToCart(id) { 
            const i=this.state.cart.find(item=>item.id===id); 
            if(i) i.quantity++; 
            else this.state.cart.push({id,quantity:1}); 
            this.saveState(); 
            this.updateCounters(); 
            this.renderProducts(); 
        }, 
        
        toggleWishlist(id) { 
            const i=this.state.wishlist.indexOf(id); 
            if(i>-1) this.state.wishlist.splice(i,1); 
            else this.state.wishlist.push(id); 
            this.saveState(); 
            this.updateCounters(); 
            this.renderProducts(); 
        }, 
        
        applyMesmerizingEffects() { document.querySelectorAll(".card-item, .glass-card.interactive-card").forEach(c=>{c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,rx=(y-r.height/2)/(r.height/2)*-8,ry=(x-r.width/2)/(r.width/2)*8;c.style.setProperty("--mx",`${x}px`);c.style.setProperty("--my",`${y}px`);c.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.05,1.05,1.05)`;});c.addEventListener("mouseleave",()=>{c.style.transition='transform 0.6s cubic-bezier(0.23,1,0.32,1)';c.style.transform='perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';});c.addEventListener('mouseenter',()=>c.style.transition='transform 0.1s linear');}); },

        // --- [1B] MODAL LOGIC (Now includes Search & Account) ---
        
        attachModalListeners() {
            // --- NEW: Search Modal ---
            const searchBtn = document.getElementById('search-btn');
            const searchModal = document.getElementById('search-modal');
            const searchModalClose = document.getElementById('search-modal-close');
            const searchInput = document.getElementById('search-input');
            if (searchBtn && searchModal && searchModalClose && searchInput) {
                searchBtn.addEventListener('click', () => searchModal.classList.add('active'));
                searchModalClose.addEventListener('click', () => searchModal.classList.remove('active'));
                searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
            }

            // --- NEW: Account Modal ---
            const accountBtn = document.getElementById('account-btn');
            const accountModal = document.getElementById('account-modal');
            const accountModalClose = document.getElementById('account-modal-close');
            const showSignupBtn = document.getElementById('show-signup-btn');
            const showLoginBtn = document.getElementById('show-login-btn');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const accountModalTitle = document.getElementById('account-modal-title');
            if (accountBtn && accountModal && accountModalClose && showSignupBtn && showLoginBtn && loginForm && signupForm && accountModalTitle) {
                accountBtn.addEventListener('click', () => accountModal.classList.add('active'));
                accountModalClose.addEventListener('click', () => accountModal.classList.remove('active'));
                // Toggle forms
                showSignupBtn.addEventListener('click', () => {
                    loginForm.classList.add('hidden');
                    signupForm.classList.remove('hidden');
                    accountModalTitle.textContent = 'Sign Up';
                });
                showLoginBtn.addEventListener('click', () => {
                    signupForm.classList.add('hidden');
                    loginForm.classList.remove('hidden');
                    accountModalTitle.textContent = 'Login';
                });
            }

            // --- Cart Modal ---
            const cartBtn = document.getElementById('cart-btn');
            const cartModal = document.getElementById('cart-modal');
            const cartModalClose = document.getElementById('cart-modal-close');
            if (cartBtn && cartModal && cartModalClose) {
                cartBtn.addEventListener('click', () => this.showCartModal());
                cartModalClose.addEventListener('click', () => cartModal.classList.remove('active'));
            }
            
            // --- Wishlist Modal ---
            const wishlistBtn = document.getElementById('wishlist-btn');
            const wishlistModal = document.getElementById('wishlist-modal');
            const wishlistModalClose = document.getElementById('wishlist-modal-close');
            if (wishlistBtn && wishlistModal && wishlistModalClose) {
                wishlistBtn.addEventListener('click', () => this.showWishlistModal());
                wishlistModalClose.addEventListener('click', () => wishlistModal.classList.remove('active'));
            }

            // --- Payment Modal ---
            const checkoutBtn = document.getElementById('checkout-btn');
            const paymentModal = document.getElementById('payment-modal');
            const paymentModalClose = document.getElementById('payment-modal-close');
            const paymentModalOk = document.getElementById('payment-modal-ok');
            if (checkoutBtn && paymentModal && paymentModalClose && paymentModalOk) {
                checkoutBtn.addEventListener('click', () => {
                    if (cartModal) cartModal.classList.remove('active');
                    paymentModal.classList.add('active');
                });
                paymentModalClose.addEventListener('click', () => paymentModal.classList.remove('active'));
                paymentModalOk.addEventListener('click', () => paymentModal.classList.remove('active'));
            }

            // --- Modal Item Removal Listeners ---
            const cartItems = document.getElementById('cart-modal-items');
            if (cartItems) {
                cartItems.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-from-cart-btn')) {
                        const id = parseInt(e.target.closest('.remove-from-cart-btn').dataset.id);
                        this.removeFromCart(id);
                    }
                });
            }
            const wishlistItems = document.getElementById('wishlist-modal-items');
            if (wishlistItems) {
                wishlistItems.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-from-wishlist-btn')) {
                        const id = parseInt(e.target.closest('.remove-from-wishlist-btn').dataset.id);
                        this.removeFromWishlist(id);
                    }
                });
            }
        },

        // --- NEW: Search Function ---
        performSearch(query) {
            const container = document.getElementById('search-results-container');
            const placeholder = document.getElementById('search-placeholder');
            if (!container || !placeholder) return;

            if (query.length < 3) {
                container.innerHTML = '';
                placeholder.classList.remove('hidden');
                placeholder.textContent = 'Keep typing (3+ characters)...';
                return;
            }

            const lowerQuery = query.toLowerCase();
            const results = this.products.filter(p => 
                p.name.toLowerCase().includes(lowerQuery) || 
                p.category.toLowerCase().includes(lowerQuery)
            );

            placeholder.classList.add('hidden');
            if (results.length === 0) {
                container.innerHTML = `<p class="text-gray-400 text-center">No products found for "${query}".</p>`;
            } else {
                container.innerHTML = results.map(product => {
                    return `
                        <a href="shop.html" class="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover">
                            <div class="flex-grow">
                                <h4 class="font-semibold text-white">${product.name}</h4>
                                <p class="text-gray-400 text-sm capitalize">${product.category}</p>
                            </div>
                            <p class="text-lg font-bold page-title">₹${product.price}</p>
                        </a>
                    `;
                }).join('');
            }
        },

        showCartModal() {
            const container = document.getElementById('cart-modal-items');
            const totalEl = document.getElementById('cart-modal-total');
            if (!container || !totalEl) return;
            let total = 0;
            
            if (this.state.cart.length === 0) {
                container.innerHTML = `<p class="text-gray-400 text-center">Your cart is empty.</p>`;
            } else {
                container.innerHTML = this.state.cart.map(item => {
                    const product = this.products.find(p => p.id === item.id);
                    if (!product) return '';
                    total += product.price * item.quantity;
                    return `
                        <div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover">
                            <div class="flex-grow">
                                <h4 class="font-semibold text-white">${product.name}</h4>
                                <p class="text-gray-300">Quantity: ${item.quantity}</p>
                                <p class="text-lg font-bold page-title">₹${product.price * item.quantity}</p>
                            </div>
                            <button class="icon-btn !text-red-400 remove-from-cart-btn" data-id="${product.id}" title="Remove">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    `;
                }).join('');
            }
            
            totalEl.textContent = `₹${total}`;
            lucide.createIcons();
            document.getElementById('cart-modal').classList.add('active');
        },

        showWishlistModal() {
            const container = document.getElementById('wishlist-modal-items');
            if (!container) return;
            
            if (this.state.wishlist.length === 0) {
                container.innerHTML = `<p class="text-gray-400 text-center">Your wishlist is empty.</p>`;
            } else {
                container.innerHTML = this.state.wishlist.map(id => {
                    const product = this.products.find(p => p.id === id);
                    if (!product) return '';
                    return `
                        <div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover">
                            <div class="flex-grow">
                                <h4 class="font-semibold text-white">${product.name}</h4>
                                <p class="text-lg font-bold page-title">₹${product.price}</p>
                            </div>
                            <button class="icon-btn !text-red-400 remove-from-wishlist-btn" data-id="${product.id}" title="Remove">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    `;
                }).join('');
            }
            lucide.createIcons();
            document.getElementById('wishlist-modal').classList.add('active');
        },

        removeFromCart(id) {
            const index = this.state.cart.findIndex(item => item.id === id);
            if (index > -1) {
                this.state.cart.splice(index, 1);
            }
            this.saveState();
            this.updateCounters();
            this.renderProducts();
            this.showCartModal();
        },

        removeFromWishlist(id) {
            const index = this.state.wishlist.indexOf(id);
            if (index > -1) {
                this.state.wishlist.splice(index, 1);
            }
            this.saveState();
            this.updateCounters();
            this.renderProducts();
            this.showWishlistModal();
        }
    };
    // --- END OF E-COMMERCE APP ---


    // --- [2] HOME PAGE CAROUSEL SCRIPT ---
    const carouselContainer = document.getElementById('home-carousel-container');
    if (carouselContainer) { // Only runs if element exists
        const slidesContainer = document.getElementById('carousel-slides'); 
        const prevBtn = document.getElementById('carousel-prev'); 
        const nextBtn = document.getElementById('carousel-next'); 
        const dotsContainer = document.getElementById('carousel-dots'); 
        const slides = document.querySelectorAll('.carousel-slide'); 
        const totalSlides = slides.length; 
        let currentIndex = 0; 
        let carouselInterval; 
        function updateDots() { if (!dotsContainer) return; const dots = document.querySelectorAll('.carousel-dot'); dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentIndex); }); } 
        function showSlide(index) { currentIndex = (index + totalSlides) % totalSlides; const offset = -currentIndex * 100; if (slidesContainer) { slidesContainer.style.transform = `translateX(${offset}%)`; } updateDots(); } 
        function startInterval() { clearInterval(carouselInterval); carouselInterval = setInterval(() => { showSlide(currentIndex + 1); }, 5000); } 
        function resetInterval() { startInterval(); } 
        if (dotsContainer && totalSlides > 0) { dotsContainer.innerHTML = ''; for (let i = 0; i < totalSlides; i++) { const dot = document.createElement('button'); dot.classList.add('carousel-dot'); dot.setAttribute('data-index', i); dot.setAttribute('aria-label', `Go to slide ${i + 1}`); dot.addEventListener('click', () => { showSlide(i); resetInterval(); }); dotsContainer.appendChild(dot); } } 
        if(prevBtn) { prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); resetInterval(); }); } 
        if(nextBtn) { nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); resetInterval(); }); } 
        if (totalSlides > 0) { showSlide(0); startInterval(); } 
        lucide.createIcons({ nodes: [prevBtn, nextBtn].filter(Boolean) }); 
    }
    // --- END OF CAROUSEL SCRIPT ---


    // --- [3] DYNAMIC QUOTE SCRIPT ---
    const quotes = [ "Art enables us to find ourselves and lose ourselves at the same time.", "Creativity takes courage.", "Every artist dips his brush in his own soul, and paints his own nature into his pictures.", "The patterns of the infinite pulse through every line.", "Where tradition meets the future, beauty unfolds.", "In geometry, find harmony; in color, find life.", "Weaving pixels, painting dreams." ]; const quoteIcons = ['flower-2', 'aperture', 'sparkles', 'star', 'sun', 'moon', 'gem', 'atom', 'circle-dashed', 'infinity', 'feather', 'brain-circuit', 'dna']; const VIBRANT_COLORS = ['#ff8a00', '#e52e71', '#8a2be2', '#00bfff', '#32cd32', '#ffcc00', '#ff69b4', '#00ffcc', '#ff5733', '#cc00ff', '#ff0066']; const quoteAnimations = [ { in: 'quote-spin-in', out: 'quote-spin-out' }, { in: 'quote-zoom-drift-in', out: 'quote-zoom-drift-out' }, { in: 'quote-fade-blur-in', out: 'quote-fade-blur-out' }, ]; 
    const quoteContainer = document.getElementById('dynamic-quote-container'); 
    let quoteSpawnTimeoutId = null; 
    let isQuoteVisible = false; 
    function getRandom(min, max) { return Math.random() * (max - min) + min; } 
    function spawnQuote() { 
        clearTimeout(quoteSpawnTimeoutId); 
        if (!quoteContainer || isQuoteVisible) { quoteSpawnTimeoutId = setTimeout(spawnQuote, getRandom(500, 1000)); return; } 
        isQuoteVisible = true; const quoteIndex = Math.floor(Math.random() * quotes.length); const iconIndex = Math.floor(Math.random() * quoteIcons.length); const colorIndex = Math.floor(Math.random() * VIBRANT_COLORS.length); const animationIndex = Math.floor(Math.random() * quoteAnimations.length); const selectedQuote = quotes[quoteIndex]; const selectedIcon = quoteIcons[iconIndex]; const selectedColor = VIBRANT_COLORS[colorIndex]; const selectedAnimation = quoteAnimations[animationIndex]; const wrapper = document.createElement('div'); wrapper.className = 'quote-wrapper'; const iconElement = document.createElement('i'); iconElement.classList.add('quote-icon'); iconElement.setAttribute('data-lucide', selectedIcon); iconElement.style.color = selectedColor; const textElement = document.createElement('p'); textElement.className = 'quote-text'; textElement.textContent = `"${selectedQuote}"`; wrapper.appendChild(iconElement); wrapper.appendChild(textElement); const randomTop = getRandom(10, 90); const randomLeft = getRandom(10, 90); const randomMaxWidth = getRandom(40, 70); wrapper.style.maxWidth = `${randomMaxWidth}%`; wrapper.style.top = `${randomTop}%`; wrapper.style.left = `${randomLeft}%`; const fadeInDuration = getRandom(1.0, 2.0); const visibleDuration = getRandom(4.0, 7.0); const fadeOutDuration = getRandom(1.0, 2.0); const startRotation = getRandom(-30, 30); const endRotation = getRandom(-15, 15); const driftX = getRandom(-40, 40); const driftY = getRandom(-40, 40); wrapper.style.setProperty('--start-rotate', `${startRotation}deg`); wrapper.style.setProperty('--end-rotate', `${endRotation}


        */

        /*
============================================================
MAIN JAVASCRIPT (app.js)
- This file is shared across all pages
- It contains all logic, wrapped in "if(element_exists)"
  checks so it doesn't error on pages that don't
  need a particular script.
============================================================
*/



document.addEventListener('DOMContentLoaded', () => {

    // --- [1] E-COMMERCE APP LOGIC ---
    // This object manages the shop, cart, and wishlist state.
    const App = { 
        products: [ { id: 1, name: 'Nebula Flow Dress', category: 'dress', price: 799, image: 'img1.jpeg' }, { id: 2, name: 'Geometric Sun Dress', category: 'dress', price: 599, image: 'img2.jpeg' }, { id: 3, name: 'Mandala Maxi Dress', category: 'dress', price: 549, image: 'img3.jpeg' }, { id: 4, name: 'Symmetric Shift Dress', category: 'dress', price: 499, image: 'img4.jpeg' }, { id: 5, name: 'Cosmic Tote Bag', category: 'bag', price: 299, image: 'img5.jpeg' }, { id: 6, name: 'Lotus Crossbody Bag', category: 'bag', price: 279, image: 'img6.jpeg' }, { id: 7, name: 'Patterned Backpack', category: 'bag', price: 299, image: 'img7.jpeg' }, { id: 8, name: 'Embroidered Pouch', category: 'bag', price: 249, image: 'img8.jpeg' }, { id: 9, name: 'Serenity Pillow Cover', category: 'pillow', price: 249, image: 'img9.jpeg' }, { id: 10, name: 'Vibrant Mandala Cushion', category: 'pillow', price: 249, image: 'img10.jpeg' }, { id: 11, name: 'Geometric Accent Pillow', category: 'pillow', price: 249, image: 'img11.jpeg' }, { id: 12, name: 'Kolam Line Art Pillow', category: 'pillow', price: 249, image: 'img12.jpeg' }, { id: 13, name: 'Galaxy Mandala Tapestry', category: 'wall', price: 349, image: 'img13.jpeg' }, { id: 14, name: 'Sun & Moon Wall Art', category: 'wall', price: 299, image: 'img14.jpeg' }, { id: 15, name: 'Seven Chakras Hanging', category: 'wall', price: 299, image: 'img15.jpeg' }, { id: 16, name: 'Digital Bloom Canvas', category: 'wall', price: 299, image: 'img16.jpeg' }, ], 
        state: { cart: [], wishlist: [], orders: [], activeFilter: 'all' }, 
        
        // Initialization function, runs on page load
        init() { 
            this.loadState(); 
            this.renderProducts(); // Only runs if product grid exists
            this.updateCounters(); // Only runs if counters exist
            this.attachEventListeners(); 
            this.attachModalListeners(); // Attaches to *all* modals
        }, 
        
        // Load cart/wishlist from browser's local storage
        loadState() { const c=localStorage.getItem('rangVigyaan_cart'),w=localStorage.getItem('rangVigyaan_wishlist'),o=localStorage.getItem('rangVigyaan_orders'); if(c)this.state.cart=JSON.parse(c); if(w)this.state.wishlist=JSON.parse(w); if(o)this.state.orders=JSON.parse(o); }, 
        
        // Save cart/wishlist to browser's local storage
        saveState() { localStorage.setItem('rangVigyaan_cart', JSON.stringify(this.state.cart)); localStorage.setItem('rangVigyaan_wishlist', JSON.stringify(this.state.wishlist)); localStorage.setItem('rangVigyaan_orders', JSON.stringify(this.state.orders)); }, 
        
        // Renders the products on the Shop page
        renderProducts() { 
            const grid=document.getElementById('product-grid'); 
            if (!grid) return; // <-- IMPORTANT: Won't break on other pages
            const filtered=this.state.activeFilter==='all'?this.products:this.products.filter(p=>p.category===this.state.activeFilter); 
            grid.innerHTML=filtered.map(p=>{const inWish=this.state.wishlist.includes(p.id),inCart=this.state.cart.some(i=>i.id===p.id);return ` <div class="card-item glass-card glowing-border" style="animation-delay: ${filtered.indexOf(p)*50}ms"> <div class="card-content-wrapper"> <img src="${p.image}" alt="${p.name}" class="product-card-img" onerror="this.src='https::placehold.co/600x600/6f2e21/white?text=${p.name}'; this.onerror=null;"> <div class="p-6 flex-grow flex flex-col"> <h3 class="text-xl font-bold page-title">${p.name}</h3> <div class="mt-4 flex-grow flex justify-between items-center"> <span class="text-2xl font-bold text-white">₹${p.price}</span> <div class="flex items-center gap-2"> <button class="icon-btn wishlist-toggle-btn ${inWish?'active':''}" data-id="${p.id}" title="Wishlist"><i data-lucide="heart"></i></button> <button class="btn !px-4 !py-2 add-to-cart-btn" data-id="${p.id}">${inCart?'In Cart':'Add'}</button> </div> </div> </div> </div> </div>`}).join(''); 
            this.applyMesmerizingEffects(); 
            lucide.createIcons(); 
        }, 
        
        // Updates the red number counters on the header icons
        updateCounters() { 
            const c = this.state.cart.reduce((s, i) => s + i.quantity, 0);
            const w = this.state.wishlist.length;
            const cc = document.getElementById('cart-counter');
            const wc = document.getElementById('wishlist-counter');
            
            if (cc) { cc.textContent = c; cc.classList.toggle('hidden', c === 0); } 
            if (wc) { wc.textContent = w; wc.classList.toggle('hidden', w === 0); } 
        }, 
        
        // Attaches click listeners for shop filters and product buttons
        attachEventListeners() { 
            const pg=document.getElementById('product-grid'); 
            if(pg){pg.addEventListener('click',e=>{const acb=e.target.closest('.add-to-cart-btn'),wtb=e.target.closest('.wishlist-toggle-btn'); if(acb)this.addToCart(parseInt(acb.dataset.id)); if(wtb)this.toggleWishlist(parseInt(wtb.dataset.id));});} 
            const fc=document.getElementById('filter-container'); 
            if(fc){fc.addEventListener('click',e=>{if(e.target.matches('.filter-btn')){const activeBtn = fc.querySelector('.filter-btn.active'); if(activeBtn) activeBtn.classList.remove('active'); e.target.classList.add('active');this.state.activeFilter=e.target.dataset.category;this.renderProducts();}}); } 
        }, 
        
        addToCart(id) { 
            const i=this.state.cart.find(item=>item.id===id); 
            if(i) i.quantity++; 
            else this.state.cart.push({id,quantity:1}); 
            this.saveState(); 
            this.updateCounters(); 
            this.renderProducts(); 
        }, 
        
        toggleWishlist(id) { 
            const i=this.state.wishlist.indexOf(id); 
            if(i>-1) this.state.wishlist.splice(i,1); 
            else this.state.wishlist.push(id); 
            this.saveState(); 
            this.updateCounters(); 
            this.renderProducts(); 
        }, 
        
        applyMesmerizingEffects() { document.querySelectorAll(".card-item, .glass-card.interactive-card").forEach(c=>{c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,rx=(y-r.height/2)/(r.height/2)*-8,ry=(x-r.width/2)/(r.width/2)*8;c.style.setProperty("--mx",`${x}px`);c.style.setProperty("--my",`${y}px`);c.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.05,1.05,1.05)`;});c.addEventListener("mouseleave",()=>{c.style.transition='transform 0.6s cubic-bezier(0.23,1,0.32,1)';c.style.transform='perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';});c.addEventListener('mouseenter',()=>c.style.transition='transform 0.1s linear');}); },

        // --- [1B] MODAL LOGIC (Now includes Search & Account) ---
        
        attachModalListeners() {
            // --- NEW: Search Modal ---
            const searchBtn = document.getElementById('search-btn');
            const searchModal = document.getElementById('search-modal');
            const searchModalClose = document.getElementById('search-modal-close');
            const searchInput = document.getElementById('search-input');
            if (searchBtn && searchModal && searchModalClose && searchInput) {
                searchBtn.addEventListener('click', () => searchModal.classList.add('active'));
                searchModalClose.addEventListener('click', () => searchModal.classList.remove('active'));
                searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
            }

            // --- NEW: Account Modal ---
            const accountBtn = document.getElementById('account-btn');
            const accountModal = document.getElementById('account-modal');
            const accountModalClose = document.getElementById('account-modal-close');
            const showSignupBtn = document.getElementById('show-signup-btn');
            const showLoginBtn = document.getElementById('show-login-btn');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const accountModalTitle = document.getElementById('account-modal-title');
            if (accountBtn && accountModal && accountModalClose && showSignupBtn && showLoginBtn && loginForm && signupForm && accountModalTitle) {
                accountBtn.addEventListener('click', () => accountModal.classList.add('active'));
                accountModalClose.addEventListener('click', () => accountModal.classList.remove('active'));
                // Toggle forms
                showSignupBtn.addEventListener('click', () => {
                    loginForm.classList.add('hidden');
                    signupForm.classList.remove('hidden');
                    accountModalTitle.textContent = 'Sign Up';
                });
                showLoginBtn.addEventListener('click', () => {
                    signupForm.classList.add('hidden');
                    loginForm.classList.remove('hidden');
                    accountModalTitle.textContent = 'Login';
                });
            }

            // --- Cart Modal ---
            const cartBtn = document.getElementById('cart-btn');
            const cartModal = document.getElementById('cart-modal');
            const cartModalClose = document.getElementById('cart-modal-close');
            if (cartBtn && cartModal && cartModalClose) {
                cartBtn.addEventListener('click', () => this.showCartModal());
                cartModalClose.addEventListener('click', () => cartModal.classList.remove('active'));
            }
            
            // --- Wishlist Modal ---
            const wishlistBtn = document.getElementById('wishlist-btn');
            const wishlistModal = document.getElementById('wishlist-modal');
            const wishlistModalClose = document.getElementById('wishlist-modal-close');
            if (wishlistBtn && wishlistModal && wishlistModalClose) {
                wishlistBtn.addEventListener('click', () => this.showWishlistModal());
                wishlistModalClose.addEventListener('click', () => wishlistModal.classList.remove('active'));
            }

            // --- Payment Modal ---
            const checkoutBtn = document.getElementById('checkout-btn');
            const paymentModal = document.getElementById('payment-modal');
            const paymentModalClose = document.getElementById('payment-modal-close');
            const paymentModalOk = document.getElementById('payment-modal-ok');
            if (checkoutBtn && paymentModal && paymentModalClose && paymentModalOk) {
                checkoutBtn.addEventListener('click', () => {
                    if (cartModal) cartModal.classList.remove('active');
                    paymentModal.classList.add('active');
                });
                paymentModalClose.addEventListener('click', () => paymentModal.classList.remove('active'));
                paymentModalOk.addEventListener('click', () => paymentModal.classList.remove('active'));
            }

            // --- Modal Item Removal Listeners ---
            const cartItems = document.getElementById('cart-modal-items');
            if (cartItems) {
                cartItems.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-from-cart-btn')) {
                        const id = parseInt(e.target.closest('.remove-from-cart-btn').dataset.id);
                        this.removeFromCart(id);
                    }
                });
            }
            const wishlistItems = document.getElementById('wishlist-modal-items');
            if (wishlistItems) {
                wishlistItems.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-from-wishlist-btn')) {
                        const id = parseInt(e.target.closest('.remove-from-wishlist-btn').dataset.id);
                        this.removeFromWishlist(id);
                    }
                });
            }
        },

        // --- NEW: Search Function ---
        performSearch(query) {
            const container = document.getElementById('search-results-container');
            const placeholder = document.getElementById('search-placeholder');
            if (!container || !placeholder) return;

            if (query.length < 3) {
                container.innerHTML = '';
                placeholder.classList.remove('hidden');
                placeholder.textContent = 'Keep typing (3+ characters)...';
                return;
            }

            const lowerQuery = query.toLowerCase();
            const results = this.products.filter(p => 
                p.name.toLowerCase().includes(lowerQuery) || 
                p.category.toLowerCase().includes(lowerQuery)
            );

            placeholder.classList.add('hidden');
            if (results.length === 0) {
                container.innerHTML = `<p class="text-gray-400 text-center">No products found for "${query}".</p>`;
            } else {
                container.innerHTML = results.map(product => {
                    // Clicking search result takes you to the shop page
                    return `
                        <a href="shop.html" class="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover" onerror="this.src='https::placehold.co/100x100/6f2e21/white?text=${product.name}'; this.onerror=null;">
                            <div class="flex-grow">
                                <h4 class="font-semibold text-white">${product.name}</h4>
                                <p class="text-gray-400 text-sm capitalize">${product.category}</p>
                            </div>
                            <p class="text-lg font-bold page-title">₹${product.price}</p>
                        </a>
                    `;
                }).join('');
            }
        },

        showCartModal() {
            const container = document.getElementById('cart-modal-items');
            const totalEl = document.getElementById('cart-modal-total');
            if (!container || !totalEl) return;
            let total = 0;
            
            if (this.state.cart.length === 0) {
                container.innerHTML = `<p class="text-gray-400 text-center">Your cart is empty.</p>`;
            } else {
                container.innerHTML = this.state.cart.map(item => {
                    const product = this.products.find(p => p.id === item.id);
                    if (!product) return '';
                    total += product.price * item.quantity;
                    return `
                        <div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover" onerror="this.src='https::placehold.co/100x100/6f2e21/white?text=${product.name}'; this.onerror=null;">
                            <div class="flex-grow">
                                <h4 class="font-semibold text-white">${product.name}</h4>
                                <p class="text-gray-300">Quantity: ${item.quantity}</p>
                                <p class="text-lg font-bold page-title">₹${product.price * item.quantity}</p>
                            </div>
                            <button class="icon-btn !text-red-400 remove-from-cart-btn" data-id="${product.id}" title="Remove">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    `;
                }).join('');
            }
            
            totalEl.textContent = `₹${total}`;
            lucide.createIcons();
            document.getElementById('cart-modal').classList.add('active');
        },

        showWishlistModal() {
            const container = document.getElementById('wishlist-modal-items');
            if (!container) return;
            
            if (this.state.wishlist.length === 0) {
                container.innerHTML = `<p class="text-gray-400 text-center">Your wishlist is empty.</p>`;
            } else {
                container.innerHTML = this.state.wishlist.map(id => {
                    const product = this.products.find(p => p.id === id);
                    if (!product) return '';
                    return `
                        <div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover" onerror="this.src='https::placehold.co/100x100/6f2e21/white?text=${product.name}'; this.onerror=null;">
                            <div class="flex-grow">
                                <h4 class="font-semibold text-white">${product.name}</h4>
                                <p class="text-lg font-bold page-title">₹${product.price}</p>
                            </div>
                            <button class="icon-btn !text-red-400 remove-from-wishlist-btn" data-id="${product.id}" title="Remove">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    `;
                }).join('');
            }
            lucide.createIcons();
            document.getElementById('wishlist-modal').classList.add('active');
        },

        removeFromCart(id) {
            const index = this.state.cart.findIndex(item => item.id === id);
            if (index > -1) {
                this.state.cart.splice(index, 1);
            }
            this.saveState();
            this.updateCounters();
            this.renderProducts();
            this.showCartModal();
        },

        removeFromWishlist(id) {
            const index = this.state.wishlist.indexOf(id);
            if (index > -1) {
                this.state.wishlist.splice(index, 1);
            }
            this.saveState();
            this.updateCounters();
            this.renderProducts();
            this.showWishlistModal();
        }
    };
    // --- END OF E-COMMERCE APP ---


    // --- [2] HOME PAGE CAROUSEL SCRIPT ---
    const carouselContainer = document.getElementById('home-carousel-container');
    if (carouselContainer) { // Only runs if element exists
        const slidesContainer = document.getElementById('carousel-slides'); 
        const prevBtn = document.getElementById('carousel-prev'); 
        const nextBtn = document.getElementById('carousel-next'); 
        const dotsContainer = document.getElementById('carousel-dots'); 
        const slides = document.querySelectorAll('.carousel-slide'); 
        const totalSlides = slides.length; 
        let currentIndex = 0; 
        let carouselInterval; 
        function updateDots() { if (!dotsContainer) return; const dots = document.querySelectorAll('.carousel-dot'); dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentIndex); }); } 
        function showSlide(index) { currentIndex = (index + totalSlides) % totalSlides; const offset = -currentIndex * 100; if (slidesContainer) { slidesContainer.style.transform = `translateX(${offset}%)`; } updateDots(); } 
        function startInterval() { clearInterval(carouselInterval); carouselInterval = setInterval(() => { showSlide(currentIndex + 1); }, 5000); } 
        function resetInterval() { startInterval(); } 
        if (dotsContainer && totalSlides > 0) { dotsContainer.innerHTML = ''; for (let i = 0; i < totalSlides; i++) { const dot = document.createElement('button'); dot.classList.add('carousel-dot'); dot.setAttribute('data-index', i); dot.setAttribute('aria-label', `Go to slide ${i + 1}`); dot.addEventListener('click', () => { showSlide(i); resetInterval(); }); dotsContainer.appendChild(dot); } } 
        if(prevBtn) { prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); resetInterval(); }); } 
        if(nextBtn) { nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); resetInterval(); }); } 
        if (totalSlides > 0) { showSlide(0); startInterval(); } 
        lucide.createIcons({ nodes: [prevBtn, nextBtn].filter(Boolean) }); 
    }
    // --- END OF CAROUSEL SCRIPT ---


    // --- [3] DYNAMIC QUOTE SCRIPT (for index.html) ---
    // (This is the completed function from the truncated file)
    const quotes = [ "Art enables us to find ourselves and lose ourselves at the same time.", "Creativity takes courage.", "Every artist dips his brush in his own soul, and paints his own nature into his pictures.", "The patterns of the infinite pulse through every line.", "Where tradition meets the future, beauty unfolds.", "In geometry, find harmony; in color, find life.", "Weaving pixels, painting dreams." ]; const quoteIcons = ['flower-2', 'aperture', 'sparkles', 'star', 'sun', 'moon', 'gem', 'atom', 'circle-dashed', 'infinity', 'feather', 'brain-circuit', 'dna']; const VIBRANT_COLORS = ['#ff8a00', '#e52e71', '#8a2be2', '#00bfff', '#32cd32', '#ffcc00', '#ff69b4', '#00ffcc', '#ff5733', '#cc00ff', '#ff0066']; const quoteAnimations = [ { in: 'quote-spin-in', out: 'quote-spin-out' }, { in: 'quote-zoom-drift-in', out: 'quote-zoom-drift-out' }, { in: 'quote-fade-blur-in', out: 'quote-fade-blur-out' }, ]; 
    const quoteContainer = document.getElementById('dynamic-quote-container'); 
    let quoteSpawnTimeoutId = null; 
    let isQuoteVisible = false; 
    function getRandom(min, max) { return Math.random() * (max - min) + min; } 
    
    function spawnQuote() { 
        clearTimeout(quoteSpawnTimeoutId); 
        if (!quoteContainer || isQuoteVisible) { 
            quoteSpawnTimeoutId = setTimeout(spawnQuote, getRandom(500, 1000)); 
            return; 
        } 
        isQuoteVisible = true; 
        const quoteIndex = Math.floor(Math.random() * quotes.length); 
        const iconIndex = Math.floor(Math.random() * quoteIcons.length); 
        const colorIndex = Math.floor(Math.random() * VIBRANT_COLORS.length); 
        const animationIndex = Math.floor(Math.random() * quoteAnimations.length); 
        const selectedQuote = quotes[quoteIndex]; 
        const selectedIcon = quoteIcons[iconIndex]; 
        const selectedColor = VIBRANT_COLORS[colorIndex]; 
        const selectedAnimation = quoteAnimations[animationIndex]; 
        const wrapper = document.createElement('div'); 
        wrapper.className = 'quote-wrapper'; 
        const iconElement = document.createElement('i'); 
        iconElement.classList.add('quote-icon'); 
        iconElement.setAttribute('data-lucide', selectedIcon); 
        iconElement.style.color = selectedColor; 
        const textElement = document.createElement('p'); 
        textElement.className = 'quote-text'; 
        textElement.textContent = `"${selectedQuote}"`; 
        wrapper.appendChild(iconElement); 
        wrapper.appendChild(textElement); 
        const randomTop = getRandom(10, 90); 
        const randomLeft = getRandom(10, 90); 
        const randomMaxWidth = getRandom(40, 70); 
        wrapper.style.maxWidth = `${randomMaxWidth}%`; 
        wrapper.style.top = `${randomTop}%`; 
        wrapper.style.left = `${randomLeft}%`; 
        const fadeInDuration = getRandom(1.0, 2.0); 
        const visibleDuration = getRandom(4.0, 7.0); 
        const fadeOutDuration = getRandom(1.0, 2.0); 
        const startRotation = getRandom(-30, 30); 
        const endRotation = getRandom(-15, 15); // <-- This is where your file was cut off
        const driftX = getRandom(-40, 40); 
        const driftY = getRandom(-40, 40); 
        wrapper.style.setProperty('--start-rotate', `${startRotation}deg`); 
        wrapper.style.setProperty('--end-rotate', `${endRotation}deg`); 
        wrapper.style.setProperty('--start-rotate-rev', `${-startRotation}deg`); 
        wrapper.style.setProperty('--drift-x', `${driftX}px`); 
        wrapper.style.setProperty('--drift-y', `${driftY}px`); 
        wrapper.style.animation = `${selectedAnimation.in} ${fadeInDuration}s cubic-bezier(0.1, 0.7, 0.3, 1) forwards`; 
        quoteContainer.appendChild(wrapper); 
        lucide.createIcons({ nodes: [iconElement] }); 
        const fadeOutStartTime = (fadeInDuration + visibleDuration) * 1000; 
        setTimeout(() => { 
            if (quoteContainer.contains(wrapper)) { 
                wrapper.style.animation = `${selectedAnimation.out} ${fadeOutDuration}s cubic-bezier(0.7, 0.1, 0.9, 0.3) forwards`; 
                isQuoteVisible = false; 
                spawnQuote(); 
                setTimeout(() => { 
                    if (quoteContainer.contains(wrapper)) { 
                        quoteContainer.removeChild(wrapper); 
                    } 
                }, fadeOutDuration * 1000); 
            } else { 
                isQuoteVisible = false; 
                spawnQuote(); 
            } 
        }, fadeOutStartTime); 
    } 
    
    if (quoteContainer) { // Only run if on Home page
        spawnQuote(); 
    }
    // --- END OF QUOTE SCRIPT ---


    // --- [4] TESTIMONIAL SCROLLER SCRIPT (for index.html) ---
    const track = document.getElementById("testimonial-track");
    if (track) { // Only run if on Home page
        const cards = Array.from(track.children); 
        cards.forEach(card => { 
            const clone = card.cloneNode(true); 
            track.appendChild(clone); 
        }); 
    }
    // --- END OF TESTIMONIAL SCRIPT ---


    // --- [5] THREE.JS BACKGROUND SCRIPT (Global) ---
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
        const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000),renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true});renderer.setSize(window.innerWidth,window.innerHeight);const pC=5000,pos=new Float32Array(pC*3),cls=new Float32Array(pC*3),bC=[new THREE.Color('#ff8a00'),new THREE.Color('#e52e71'),new THREE.Color('#8a2be2')];for(let i=0;i<pC;i++){pos[i*3]=(Math.random()-0.5)*15;pos[i*3+1]=(Math.random()-0.5)*15;pos[i*3+2]=(Math.random()-0.5)*15;const c=bC[i%bC.length];cls[i*3]=c.r;cls[i*3+1]=c.g;cls[i*3+2]=c.b;}const parts=new THREE.BufferGeometry();parts.setAttribute('position',new THREE.BufferAttribute(pos,3));parts.setAttribute('color',new THREE.BufferAttribute(cls,3));const pSys=new THREE.Points(parts,new THREE.PointsMaterial({size:0.02,vertexColors:true,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending}));scene.add(pSys);camera.position.z=5;const clock=new THREE.Clock(),mouse=new THREE.Vector2();window.addEventListener('mousemove',e=>{mouse.x=(e.clientX/window.innerWidth)*2-1;mouse.y=-(e.clientY/window.innerHeight)*2+1;});function animateThree(){requestAnimationFrame(animateThree);const eT=clock.getElapsedTime();pSys.rotation.y=eT*0.05;camera.position.x+=(mouse.x*0.8-camera.position.x)*0.04;camera.position.y+=(mouse.y*0.8-camera.position.y)*0.04;camera.lookAt(scene.position);renderer.render(scene,camera);}animateThree();
    }
    // --- END OF BACKGROUND SCRIPT ---

    
    // --- [6] AI KOLAM SCRIPT (for ai-kolam.html) ---
    let isDrawing = false;
    const aiDesignLibrary = { 'default': { descriptiveText: "An excellent choice. Here is a beautiful, perfectly symmetrical flower design with eight petals. Watch as ancient art and modern tech weave together to create it.", drawingCommands: [ ...Array(8).fill(0).map((_, i) => { const angle = (i/8)*2*Math.PI; const x = 250+120*Math.cos(angle); const y = 250+120*Math.sin(angle); return { path: `M ${x-3} ${y} A 3 3 0 1 1 ${x+3} ${y} A 3 3 0 1 1 ${x-3} ${y}`, color: 'white', fill: 'white' }; }), { path: "M 220 250 A 30 30 0 1 1 280 250 A 30 30 0 1 1 220 250", color: "#8a2be2"}, ...Array(8).fill(0).map((_, i) => { return { path: "M 250 250 Q 180 150, 250 50 Q 320 150, 250 250 Z", color: i % 2 === 0 ? "#ff8a00" : "#e52e71", transform: `rotate(${i * 45}, 250, 250)` }; }) ], historicContext: "Floral motifs are universal symbols of life, beauty, and purity...", mathAndScience: "The flower is constructed using <strong>Polar Coordinates</strong>..." }, };
    const promptInput = document.getElementById('prompt-input');
    const sendBtn = document.getElementById('send-btn');
    const chatArea = document.getElementById('gemini-chat-area');
    
    if(promptInput && sendBtn && chatArea) { // Only run if on AI Kolam page
        promptInput.addEventListener('input', () => sendBtn.classList.toggle('hidden', promptInput.value.trim().length === 0)); 
        sendBtn.addEventListener('click', handlePrompt); 
        promptInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePrompt(); } }); 
    }
    
    function handlePrompt() { 
        const promptText = promptInput.value.trim(); 
        if (isDrawing || promptText === '') return; 
        document.getElementById('chat-welcome')?.remove(); 
        isDrawing = true; 
        promptInput.value = ''; 
        addMessageToChat(promptText, 'user'); 
        const thinkingMessage = addMessageToChat('...', 'ai', true); 
        setTimeout(() => { 
            const aiResponse = aiDesignLibrary['default']; 
            thinkingMessage.remove(); 
            addMessageWithKolam(aiResponse); 
            isDrawing = false; 
            sendBtn.classList.add('hidden'); 
        }, 1500); 
    }
    function addMessageToChat(content, role, isThinking = false) { 
        const msg = document.createElement('div'); 
        msg.className = `chat-message ${role}-message`; 
        const icon = role === 'user' ? 'pen-square' : 'palette'; 
        const thinkingHTML = `<div class="flex gap-2 items-center"><div class_name="w-2 h-2 bg-white rounded-full animate-pulse"></div><div class="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.2s]"></div><div class="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.4s]"></div></div>`; 
        const contentHTML = isThinking ? thinkingHTML : `<p>${content}</p>`; 
        msg.innerHTML = `<div class="chat-avatar"><i data-lucide="${icon}"></i></div><div class="chat-content w-full">${contentHTML}</div>`; 
        chatArea.appendChild(msg); 
        lucide.createIcons({ nodes: [msg] }); 
        chatArea.scrollTop = chatArea.scrollHeight; 
        return msg; 
    }
    function addMessageWithKolam(response) { 
        const msg = document.createElement('div'); 
        msg.className = 'chat-message ai-message'; 
        msg.innerHTML = ` <div class="chat-avatar"><i data-lucide="palette"></i></div> <div class="chat-content w-full"> <p class="mb-4 text-gray-300">${response.descriptiveText}</p> <div class="flex flex-col gap-6 items-center"> <div class_name="w-full max-w-lg flex flex-col gap-6"> <div class="svg-container glass-card glowing-border p-2 sm:p-4 card-item"> <div class="card-content-wrapper"></div> </div> </div> </div> </div>`; 
        chatArea.appendChild(msg); 
        lucide.createIcons({ nodes: [msg] }); 
        animateSVGPaths(msg.querySelector('.svg-container .card-content-wrapper'), response.drawingCommands); 
        App.applyMesmerizingEffects(); 
        chatArea.scrollTop = chatArea.scrollHeight; 
    }
    async function animateSVGPaths(container, commands) { 
        container.innerHTML = ''; const svgNS = "http://www.w3.org/2000/svg"; 
        const svg = document.createElementNS(svgNS, 'svg'); 
        svg.setAttribute('viewBox', '0 0 500 500'); 
        svg.style.position = 'absolute'; svg.style.width = '100%'; svg.style.height = '100%'; 
        container.appendChild(svg); 
        const dots = commands.filter(c=>c.fill==='white'), lines=commands.filter(c=>c.fill!=='white'); 
        for(const c of dots){const p=document.createElementNS(svgNS,'path');p.setAttribute('d',c.path);p.setAttribute('fill',c.fill);p.setAttribute('stroke',c.color);p.style.transformOrigin='center';p.style.transform='scale(0)';p.style.transition='transform 0.2s ease-out';svg.appendChild(p);await new Promise(r=>setTimeout(r,25));p.style.transform='scale(1)';await new Promise(r=>setTimeout(r,50));} 
        await new Promise(r=>setTimeout(r,800)); 
        for(const c of lines){const p=document.createElementNS(svgNS,'path');p.setAttribute('d',c.path);p.setAttribute('fill','none');p.setAttribute('stroke',c.color);p.setAttribute('stroke-width','4');p.setAttribute('stroke-linecap','round');if(c.transform)p.setAttribute('transform',c.transform);svg.appendChild(p);const len=p.getTotalLength();if(len>0){p.style.strokeDasharray=len;p.style.strokeDashoffset=len;await new Promise(res=>{p.getBoundingClientRect();const dur=len/400;p.style.transition=`stroke-dashoffset ${dur}s ease-in-out`;p.style.strokeDashoffset='0';setTimeout(res,dur*1000);});}} 
    }
    // --- END OF AI KOLAM SCRIPT ---


    // --- [7] GLOBAL NAVIGATION LOGIC ---
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    // --- END OF NAVIGATION LOGIC ---


    // --- [8] INITIAL PAGE SETUP ---
    App.init(); // Initialize the e-commerce app
    lucide.createIcons(); // Draw all icons on the page
    // --- END OF INITIAL SETUP ---

});

/* --- [9] GLOBAL CLICK HANDLER --- */
// This script makes cards without buttons act as links
document.addEventListener("DOMContentLoaded", function () { 
    const cards = document.querySelectorAll("#shop .card-item, #gallery-3d .card-item, #gallery-mandala .card-item, #learn .card-item, #diy-kits .card-item"); 
    cards.forEach(card => { 
        const hasButton = card.querySelector('button'); 
        if (!hasButton && !card.closest('.category-grid')) { 
            card.addEventListener("click", () => { 
                // This is not an SPA, so we can't link to a hash
                // In a multi-page site, this would link to a product page
                // For now, let's just log it.
                console.log("Card clicked. In a real site, this would go to a product page.");
                // window.location.href = "https://rangvigyaan.netlify.app"; 
            }); 
        } 
    }); 
});