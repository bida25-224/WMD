// Hope's Touch - Simplified Custom Script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Cart System ---
    let cart = JSON.parse(localStorage.getItem('hope_bag')) || [];
    updateCartUI();

    // Add to Bag
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('add-bag')) {
            const btn = e.target;
            const item = {
                id: Date.now(),
                name: btn.getAttribute('data-name'),
                price: parseFloat(btn.getAttribute('data-price')),
                img: btn.getAttribute('data-img')
            };
            
            cart.push(item);
            localStorage.setItem('hope_bag', JSON.stringify(cart));
            updateCartUI();
            
            if(confirm(`${item.name} added to bag!\n\nView bag now?`)) {
                window.location.href = 'cart.html';
            }
        }
    });

    // Cart Rendering
    const cartBox = document.getElementById('cartItems');
    if (cartBox) {
        renderCart();
        
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            if (cart.length === 0) return alert("Bag is empty.");
            alert("Thank you! Order confirmed at Hope's Touch.");
            clearBag();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            if (cart.length > 0 && confirm("Clear bag?")) clearBag();
        });
    }

    // --- Image Slider Logic (controls, indicators, pause on hover) ---
    (function initSlider() {
        const slides = Array.from(document.querySelectorAll('.slide-box'));
        if (slides.length === 0) return;

        const sliderRoot = document.querySelector('.image-slider');
        const prevBtn = document.querySelector('.slider-control.prev');
        const nextBtn = document.querySelector('.slider-control.next');
        const indicatorsWrap = document.querySelector('.slide-indicators');

        let current = 0;
        let slideInterval = null;

        function goToSlide(index) {
            index = ((index % slides.length) + slides.length) % slides.length;
            if (index === current) return;
            slides[current].classList.remove('active');
            slides[index].classList.add('active');
            updateIndicators(index);
            current = index;
        }

        function updateIndicators(activeIndex) {
            if (!indicatorsWrap) return;
            Array.from(indicatorsWrap.children).forEach((b, i) => {
                b.classList.toggle('active', i === activeIndex);
            });
        }

        function startAuto() {
            stopAuto();
            if (slides.length <= 1) return;
            slideInterval = setInterval(() => {
                goToSlide((current + 1) % slides.length);
            }, 5000);
        }

        function stopAuto() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // Build indicators
        if (indicatorsWrap) {
            indicatorsWrap.innerHTML = '';
            slides.forEach((s, i) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) b.classList.add('active');
                b.addEventListener('click', () => { goToSlide(i); startAuto(); });
                indicatorsWrap.appendChild(b);
            });
        }

        // Prev / Next
        if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(current - 1); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(current + 1); startAuto(); });

        // Pause on hover/focus
        if (sliderRoot) {
            sliderRoot.addEventListener('mouseenter', stopAuto);
            sliderRoot.addEventListener('mouseleave', startAuto);
            sliderRoot.addEventListener('focusin', stopAuto);
            sliderRoot.addEventListener('focusout', startAuto);
        }

        // Initialize
        slides.forEach((s, i) => s.classList.toggle('active', i === 0));
        updateIndicators(0);
        startAuto();
    })();

    // --- Helper Functions ---

    function updateCartUI() {
        const badge = document.getElementById('cartCount');
        if (badge) badge.innerText = cart.length;
    }

    function renderCart() {
        const box = document.getElementById('cartItems');
        const totalText = document.getElementById('cartTotal');
        if (!box) return;
        
        box.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            box.innerHTML = '<div style="width: 100%; text-align: center; padding: 50px;"><p class="copy-text">Your bag is empty.</p></div>';
            totalText.innerText = 'P0';
            return;
        }

        cart.forEach((item, i) => {
            total += item.price;
            box.innerHTML += `
                <div class="three-cols">
                    <div class="shop-card flex-box item-center" style="text-align: left; padding: 15px;">
                        <img src="${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                        <div style="flex-grow: 1;">
                            <h4 class="card-name" style="font-size: 1rem; margin: 0;">${item.name}</h4>
                            <p class="card-price" style="font-size: 0.9rem;">P${item.price.toLocaleString()}</p>
                            <button class="copy-text" style="background: none; border: none; color: #ff4444; cursor: pointer; padding: 0; font-size: 0.8rem;" onclick="removeProduct(${i})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
        totalText.innerText = `P${total.toLocaleString()}`;
    }

    function clearBag() {
        cart = [];
        localStorage.setItem('hope_bag', JSON.stringify(cart));
        updateCartUI();
        if (document.getElementById('cartItems')) renderCart();
    }

    window.removeProduct = (i) => {
        cart.splice(i, 1);
        localStorage.setItem('hope_bag', JSON.stringify(cart));
        updateCartUI();
        renderCart();
    };

    // Contact Form
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Sent! Thank you for contacting Hope's Touch.");
            form.reset();
        });
    }
});
