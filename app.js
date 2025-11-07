/*
============================================================
APP.JS - GLOBAL SCRIPT
============================================================
This file contains scripts that run on EVERY page:
1. 3D Particle Background
2. Custom Cursor
3. Modal Functionality (Search, Account, Cart, Wishlist)
4. Navigation (Mobile Menu, Logo Link)
5. Lucide Icons Initialization
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- [1] 3D PARTICLE BACKGROUND ---
    try {
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);

            const particleCount = 5000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const baseColors = [new THREE.Color('#ff8a00'), new THREE.Color('#e52e71'), new THREE.Color('#8a2be2')];

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
                const c = baseColors[i % baseColors.length];
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;
            }

            const particlesGeometry = new THREE.BufferGeometry();
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.02,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
            scene.add(particleSystem);
            camera.position.z = 5;

            const clock = new THREE.Clock();
            const mouse = new THREE.Vector2();

            window.addEventListener('mousemove', e => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            function animateThree() {
                requestAnimationFrame(animateThree);
                const elapsedTime = clock.getElapsedTime();
                particleSystem.rotation.y = elapsedTime * 0.05;
                camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
                camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
                camera.lookAt(scene.position);
                renderer.render(scene, camera);
            }
            animateThree();

            window.addEventListener('resize', () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            });
        }
    } catch (e) {
        console.error("Three.js background failed to load:", e);
    }

    // --- [2] CUSTOM CURSOR LOGIC ---
    try {
        const cursorDot = document.querySelector('.cursor-dot');
        if (cursorDot) {
            const VIBRANT_COLORS = ['#ff8a00', '#e52e71', '#8a2be2', '#00bfff', '#32cd32', '#ffdf00'];
            
            window.addEventListener('mousemove', e => {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
                createSparkleTrail(e.clientX, e.clientY);
            });
            document.body.addEventListener('click', e => createSparkleBurst(e.clientX, e.clientY));

            function createSparkleTrail(x, y) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-trail';
                sparkle.style.left = `${x}px`;
                sparkle.style.top = `${y}px`;
                sparkle.style.backgroundColor = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
                document.body.appendChild(sparkle);
                sparkle.animate([
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: `scale(0) translate(${(Math.random()-0.5)*50}px, ${(Math.random()-0.5)*50}px)` }
                ], 1000);
                setTimeout(() => sparkle.remove(), 1000);
            }

            function createSparkleBurst(x, y) {
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'sparkle-particle';
                    particle.style.left = `${x}px`;
                    particle.style.top = `${y}px`;
                    const color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
                    particle.style.backgroundColor = color;
                    document.body.appendChild(particle);
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * 80 + 20;
                    particle.animate([
                        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                        { transform: `translate(-50%, -50%) scale(0) translate(${radius * Math.cos(angle)}px, ${radius * Math.sin(angle)}px)`, opacity: 0 }
                    ], 800);
                    setTimeout(() => particle.remove(), 800);
                }
            }
        }
    } catch (e) {
        console.error("Cursor effects failed:", e);
    }

    // --- [3] GLOBAL NAVIGATION ---
    
    // Logo navigation
    const logo = document.getElementById('ourLogo');
    if (logo) {
        logo.addEventListener('click', () => window.location.href = 'index.html');
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- [4] MODAL FUNCTIONALITY ---

    // Define all products (for search)
    const allProducts = [
        { id: 1, name: 'Nebula Flow Dress', category: 'dress', price: 799, image: 'img1.jpeg' },
        { id: 2, name: 'Geometric Sun Dress', category: 'dress', price: 599, image: 'img2.jpeg' },
        { id: 3, name: 'Mandala Maxi Dress', category: 'dress', price: 549, image: 'img3.jpeg' },
        { id: 4, name: 'Symmetric Shift Dress', category: 'dress', price: 499, image: 'img4.jpeg' },
        { id: 5, name: 'Cosmic Tote Bag', category: 'bag', price: 299, image: 'img5.jpeg' },
        { id: 6, name: 'Lotus Crossbody Bag', category: 'bag', price: 279, image: 'img6.jpeg' },
        { id: 7, name: 'Patterned Backpack', category: 'bag', price: 299, image: 'img7.jpeg' },
        { id: 8, name: 'Embroidered Pouch', category: 'bag', price: 249, image: 'img8.jpeg' },
        { id: 9, name: 'Serenity Pillow Cover', category: 'pillow', price: 249, image: 'img9.jpeg' },
        { id: 10, name: 'Vibrant Mandala Cushion', category: 'pillow', price: 249, image: 'img10.jpeg' },
        { id: 11, name: 'Geometric Accent Pillow', category: 'pillow', price: 249, image: 'img11.jpeg' },
        { id: 12, name: 'Kolam Line Art Pillow', category: 'pillow', price: 249, image: 'img12.jpeg' },
        { id: 13, name: 'Galaxy Mandala Tapestry', category: 'wall', price: 349, image: 'img13.jpeg' },
        { id: 14, name: 'Sun & Moon Wall Art', category: 'wall', price: 299, image: 'img14.jpeg' },
        { id: 15, name: 'Seven Chakras Hanging', category: 'wall', price: 299, image: 'img15.jpeg' },
        { id: 16, name: 'Digital Bloom Canvas', category: 'wall', price: 299, image: 'img16.jpeg' },
    ];

    // Generic Modal Open/Close functions
    const openModal = (id) => {
        const modal = document.getElementById(id);
        if(modal) modal.classList.add('active');
    };
    const closeModal = (id) => {
        const modal = document.getElementById(id);
        if(modal) modal.classList.remove('active');
    };

    // --- Search Modal ---
    const searchBtn = document.getElementById('search-btn');
    const searchModalClose = document.getElementById('search-modal-close');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchPlaceholder = document.getElementById('search-placeholder');

    if (searchBtn) searchBtn.addEventListener('click', () => openModal('search-modal'));
    if (searchModalClose) searchModalClose.addEventListener('click', () => closeModal('search-modal'));
    if (searchInput) searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            searchResultsContainer.innerHTML = '';
            if(searchPlaceholder) searchPlaceholder.classList.remove('hidden');
            return;
        }

        const results = allProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        if(searchPlaceholder) searchPlaceholder.classList.add('hidden');

        if (results.length === 0) {
            searchResultsContainer.innerHTML = `<p class="text-gray-400 text-center">No results found for "${query}"</p>`;
        } else {
            searchResultsContainer.innerHTML = results.map(product => `
                <a href="shop.html?product=${product.id}" class="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover flex-shrink-0" onerror="this.src='https://placehold.co/64x64/3d2621/ff8a00?text=Art'; this.onerror=null;">
                    <div class="flex-grow">
                        <h4 class="font-semibold text-white">${product.name}</h4>
                        <p class="text-gray-300 capitalize text-sm">${product.category}</p>
                    </div>
                    <span class="text-lg font-bold page-title flex-shrink-0">₹${product.price}</span>
                </a>
            `).join('');
        }
    });

    // --- Account Modal ---
    const accountBtn = document.getElementById('account-btn');
    const accountModalClose = document.getElementById('account-modal-close');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const accountModalTitle = document.getElementById('account-modal-title');

    if (accountBtn) accountBtn.addEventListener('click', () => openModal('account-modal'));
    if (accountModalClose) accountModalClose.addEventListener('click', () => closeModal('account-modal'));

    if (showSignupBtn) showSignupBtn.addEventListener('click', () => {
        if(loginForm) loginForm.classList.add('hidden');
        if(signupForm) signupForm.classList.remove('hidden');
        if(accountModalTitle) accountModalTitle.textContent = "Sign Up";
    });
    if (showLoginBtn) showLoginBtn.addEventListener('click', () => {
        if(signupForm) signupForm.classList.add('hidden');
        if(loginForm) loginForm.classList.remove('hidden');
        if(accountModalTitle) accountModalTitle.textContent = "Login";
    });

    // --- Cart, Wishlist, Payment Modals (basic close) ---
    // The full logic for these lives in shop.js, but all pages
    // need to be able to close them.
    const cartModalClose = document.getElementById('cart-modal-close');
    const wishlistModalClose = document.getElementById('wishlist-modal-close');
    const paymentModalClose = document.getElementById('payment-modal-close');
    const paymentModalOk = document.getElementById('payment-modal-ok');

    if (cartModalClose) cartModalClose.addEventListener('click', () => closeModal('cart-modal'));
    if (wishlistModalClose) wishlistModalClose.addEventListener('click', () => closeModal('wishlist-modal'));
    if (paymentModalClose) paymentModalClose.addEventListener('click', () => closeModal('payment-modal'));
    if (paymentModalOk) paymentModalOk.addEventListener('click', () => closeModal('payment-modal'));
    
    // Basic open listeners for cart/wishlist for app.js
    const cartBtn = document.getElementById('cart-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    if(cartBtn) cartBtn.addEventListener('click', () => openModal('cart-modal'));
    if(wishlistBtn) wishlistBtn.addEventListener('click', () => openModal('wishlist-modal'));


    // --- [5] INITIALIZE ICONS ---
    // This runs last and draws all icons on the page.
    lucide.createIcons();
});

/*
============================================================
APP.JS - GLOBAL SCRIPT
============================================================
This file contains scripts that run on EVERY page:
1. 3D Particle Background
2. Custom Cursor
3. Modal Functionality (Search, Account, Cart, Wishlist)
4. Navigation (Mobile Menu, Logo Link)
5. Lucide Icons Initialization
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- [1] 3D PARTICLE BACKGROUND ---
    try {
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);

            const particleCount = 5000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const baseColors = [new THREE.Color('#ff8a00'), new THREE.Color('#e52e71'), new THREE.Color('#8a2be2')];

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
                const c = baseColors[i % baseColors.length];
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;
            }

            const particlesGeometry = new THREE.BufferGeometry();
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.02,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
            scene.add(particleSystem);
            camera.position.z = 5;

            const clock = new THREE.Clock();
            const mouse = new THREE.Vector2();

            window.addEventListener('mousemove', e => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            function animateThree() {
                requestAnimationFrame(animateThree);
                const elapsedTime = clock.getElapsedTime();
                particleSystem.rotation.y = elapsedTime * 0.05;
                camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
                camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
                camera.lookAt(scene.position);
                renderer.render(scene, camera);
            }
            animateThree();

            window.addEventListener('resize', () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            });
        }
    } catch (e) {
        console.error("Three.js background failed to load:", e);
    }

    // --- [2] CUSTOM CURSOR LOGIC ---
    try {
        const cursorDot = document.querySelector('.cursor-dot');
        if (cursorDot) {
            const VIBRANT_COLORS = ['#ff8a00', '#e52e71', '#8a2be2', '#00bfff', '#32cd32', '#ffdf00'];
            
            window.addEventListener('mousemove', e => {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
                createSparkleTrail(e.clientX, e.clientY);
            });
            document.body.addEventListener('click', e => createSparkleBurst(e.clientX, e.clientY));

            function createSparkleTrail(x, y) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-trail';
                sparkle.style.left = `${x}px`;
                sparkle.style.top = `${y}px`;
                sparkle.style.backgroundColor = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
                document.body.appendChild(sparkle);
                sparkle.animate([
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: `scale(0) translate(${(Math.random()-0.5)*50}px, ${(Math.random()-0.5)*50}px)` }
                ], 1000);
                setTimeout(() => sparkle.remove(), 1000);
            }

            function createSparkleBurst(x, y) {
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'sparkle-particle';
                    particle.style.left = `${x}px`;
                    particle.style.top = `${y}px`;
                    const color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
                    particle.style.backgroundColor = color;
                    document.body.appendChild(particle);
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * 80 + 20;
                    particle.animate([
                        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                        { transform: `translate(-50%, -50%) scale(0) translate(${radius * Math.cos(angle)}px, ${radius * Math.sin(angle)}px)`, opacity: 0 }
                    ], 800);
                    setTimeout(() => particle.remove(), 800);
                }
            }
        }
    } catch (e) {
        console.error("Cursor effects failed:", e);
    }

    // --- [3] GLOBAL NAVIGATION ---
    
    // Logo navigation
    const logo = document.getElementById('ourLogo');
    if (logo) {
        logo.addEventListener('click', () => window.location.href = 'index.html');
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- [4] MODAL FUNCTIONALITY ---

    // Define all products (for search)
    const allProducts = [
        { id: 1, name: 'Nebula Flow Dress', category: 'dress', price: 799, image: 'img1.jpeg' },
        { id: 2, name: 'Geometric Sun Dress', category: 'dress', price: 599, image: 'img2.jpeg' },
        { id: 3, name: 'Mandala Maxi Dress', category: 'dress', price: 549, image: 'img3.jpeg' },
        { id: 4, name: 'Symmetric Shift Dress', category: 'dress', price: 499, image: 'img4.jpeg' },
        { id: 5, name: 'Cosmic Tote Bag', category: 'bag', price: 299, image: 'img5.jpeg' },
        { id: 6, name: 'Lotus Crossbody Bag', category: 'bag', price: 279, image: 'img6.jpeg' },
        { id: 7, name: 'Patterned Backpack', category: 'bag', price: 299, image: 'img7.jpeg' },
        { id: 8, name: 'Embroidered Pouch', category: 'bag', price: 249, image: 'img8.jpeg' },
        { id: 9, name: 'Serenity Pillow Cover', category: 'pillow', price: 249, image: 'img9.jpeg' },
        { id: 10, name: 'Vibrant Mandala Cushion', category: 'pillow', price: 249, image: 'img10.jpeg' },
        { id: 11, name: 'Geometric Accent Pillow', category: 'pillow', price: 249, image: 'img11.jpeg' },
        { id: 12, name: 'Kolam Line Art Pillow', category: 'pillow', price: 249, image: 'img12.jpeg' },
        { id: 13, name: 'Galaxy Mandala Tapestry', category: 'wall', price: 349, image: 'img13.jpeg' },
        { id: 14, name: 'Sun & Moon Wall Art', category: 'wall', price: 299, image: 'img14.jpeg' },
        { id: 15, name: 'Seven Chakras Hanging', category: 'wall', price: 299, image: 'img15.jpeg' },
        { id: 16, name: 'Digital Bloom Canvas', category: 'wall', price: 299, image: 'img16.jpeg' },
    ];

    // Generic Modal Open/Close functions
    const openModal = (id) => {
        const modal = document.getElementById(id);
        if(modal) modal.classList.add('active');
    };
    const closeModal = (id) => {
        const modal = document.getElementById(id);
        if(modal) modal.classList.remove('active');
    };

    // --- Search Modal ---
    const searchBtn = document.getElementById('search-btn');
    const searchModalClose = document.getElementById('search-modal-close');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchPlaceholder = document.getElementById('search-placeholder');

    if (searchBtn) searchBtn.addEventListener('click', () => openModal('search-modal'));
    if (searchModalClose) searchModalClose.addEventListener('click', () => closeModal('search-modal'));
    if (searchInput) searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            searchResultsContainer.innerHTML = '';
            if(searchPlaceholder) searchPlaceholder.classList.remove('hidden');
            return;
        }

        const results = allProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        if(searchPlaceholder) searchPlaceholder.classList.add('hidden');

        if (results.length === 0) {
            searchResultsContainer.innerHTML = `<p class="text-gray-400 text-center">No results found for "${query}"</p>`;
        } else {
            searchResultsContainer.innerHTML = results.map(product => `
                <a href="shop.html?product=${product.id}" class="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-md object-cover flex-shrink-0" onerror="this.src='https://placehold.co/64x64/3d2621/ff8a00?text=Art'; this.onerror=null;">
                    <div class="flex-grow">
                        <h4 class="font-semibold text-white">${product.name}</h4>
                        <p class="text-gray-300 capitalize text-sm">${product.category}</p>
                    </div>
                    <span class="text-lg font-bold page-title flex-shrink-0">₹${product.price}</span>
                </a>
            `).join('');
        }
    });

    // --- Account Modal ---
    const accountBtn = document.getElementById('account-btn');
    const accountModalClose = document.getElementById('account-modal-close');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const accountModalTitle = document.getElementById('account-modal-title');

    if (accountBtn) accountBtn.addEventListener('click', () => openModal('account-modal'));
    if (accountModalClose) accountModalClose.addEventListener('click', () => closeModal('account-modal'));

    if (showSignupBtn) showSignupBtn.addEventListener('click', () => {
        if(loginForm) loginForm.classList.add('hidden');
        if(signupForm) signupForm.classList.remove('hidden');
        if(accountModalTitle) accountModalTitle.textContent = "Sign Up";
    });
    if (showLoginBtn) showLoginBtn.addEventListener('click', () => {
        if(signupForm) signupForm.classList.add('hidden');
        if(loginForm) loginForm.classList.remove('hidden');
        if(accountModalTitle) accountModalTitle.textContent = "Login";
    });

    // --- Cart, Wishlist, Payment Modals (basic close) ---
    // The full logic for these lives in shop.js, but all pages
    // need to be able to close them.
    const cartModalClose = document.getElementById('cart-modal-close');
    const wishlistModalClose = document.getElementById('wishlist-modal-close');
    const paymentModalClose = document.getElementById('payment-modal-close');
    const paymentModalOk = document.getElementById('payment-modal-ok');

    if (cartModalClose) cartModalClose.addEventListener('click', () => closeModal('cart-modal'));
    if (wishlistModalClose) wishlistModalClose.addEventListener('click', () => closeModal('wishlist-modal'));
    if (paymentModalClose) paymentModalClose.addEventListener('click', () => closeModal('payment-modal'));
    if (paymentModalOk) paymentModalOk.addEventListener('click', () => closeModal('payment-modal'));
    
    // Basic open listeners for cart/wishlist for app.js
    const cartBtn = document.getElementById('cart-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    if(cartBtn) cartBtn.addEventListener('click', () => openModal('cart-modal'));
    if(wishlistBtn) wishlistBtn.addEventListener('click', () => openModal('wishlist-modal'));


    // --- [5] INITIALIZE ICONS ---
    // This runs last and draws all icons on the page.
    lucide.createIcons();
});