document.addEventListener('DOMContentLoaded', () => {
    // --- Destination Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('.destination-card');
    const searchInput = document.getElementById('destination-search');

    let visibleCount = 6;
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreContainer = document.getElementById('load-more-container');

    function applyFilters(resetCount = false) {
        if (resetCount) {
            visibleCount = 6;
        }

        // Get active region
        let activeRegion = 'all';
        filterButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                activeRegion = btn.getAttribute('data-region');
            }
        });

        // Get search query
        const query = searchInput ? searchInput.value.toLowerCase() : '';

        // Filter cards and track matching ones
        let matchIndex = 0;
        let totalMatches = 0;

        destinationCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            
            const matchesRegion = (activeRegion === 'all' || card.getAttribute('data-region') === activeRegion);
            const matchesSearch = title.includes(query) || desc.includes(query);

            if (matchesRegion && matchesSearch) {
                totalMatches++;
                if (matchIndex < visibleCount) {
                    if (card.style.display !== 'block') {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        setTimeout(() => { card.style.opacity = '1'; }, 50);
                    }
                    matchIndex++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Handle Load More visibility
        if (loadMoreContainer) {
            if (totalMatches > visibleCount) {
                loadMoreContainer.style.display = 'flex';
                setTimeout(() => loadMoreContainer.classList.add('visible'), 50);
            } else {
                loadMoreContainer.classList.remove('visible');
                setTimeout(() => { loadMoreContainer.style.display = 'none'; }, 600);
            }
        }
    }

    if (filterButtons && filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active style from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active style to clicked button
                button.classList.add('active');

                applyFilters(true); // Reset count on filter change
            });
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 6;
            applyFilters(false);
        });
    }

    // Initial Filter Call
    applyFilters(true);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            applyFilters(true); // Reset count on search
            
            // If they start typing, boldly scroll to the destinations so they can see results
            const destinationsSection = document.getElementById('destinations');
            if (destinationsSection && e.target.value.trim().length > 0) {
                const rect = destinationsSection.getBoundingClientRect();
                // If it's more than half a viewport away, scroll smoothly
                if (rect.top > window.innerHeight / 2 || rect.bottom < 0) {
                    destinationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        // Ensure Enter key also forces a scroll
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const destinationsSection = document.getElementById('destinations');
                if (destinationsSection) {
                    destinationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
    // --- Chatbot Logic ---
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    // Toggle Chat visibility
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.remove('hidden-custom');
        chatWidget.classList.add('visible-custom');
        chatToggle.style.display = 'none';
        chatInput.focus();
    });

    closeChat.addEventListener('click', () => {
        chatWidget.classList.remove('visible-custom');
        chatWidget.classList.add('hidden-custom');
        chatToggle.style.display = 'flex';
    });

    // Simple Rule-Based Chatbot Responses
    const botResponses = {
        'hello': 'Hi there! Welcome to AntiGravity Travels. How can I help you plan your next adventure?',
        'hi': 'Hello! Looking for a getaway? I can help you find the best places to visit.',
        'price': 'Our packages start from $499. The final price depends on the destination, duration, and accommodation. Which region are you interested in?',
        'europe': 'Europe is wonderful! We have great packages for Paris, Rome, and the Swiss Alps. Check our Best Places section!',
        'asia': 'Asia offers rich culture and beautiful landscapes. Bali and Tokyo are our top recommendations right now.',
        'india': 'India is incredible! We offer trips to the majestic Taj Mahal in Agra and the serene backwaters of Kerala. Check our Best Places section!',
        'africa': 'Africa is perfect for adventures! Our Cape Town packages offer breathtaking mountain views and amazing safaris.',
        'oceania': 'Oceania has stunning coastlines! Check out our packages for Sydney, Australia to see the Opera House and Bondi Beach.',
        'booking': 'You can book directly through our website by selecting a destination and clicking "Book Now", or you can call our agents at 1-800-TRAVEL.',
        'cancel': 'We offer flexible cancellation policies. Usually, you can cancel up to 48 hours before the trip for a full refund.',
        'default': 'I\'m still learning! For detailed queries, please reach out to our human agents at support@antigravitytravels.com. Or ask me about prices, Europe, Asia, India, Africa, Oceania, or booking!'
    };

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('mb-4', 'max-w-[80%]');
        
        if (sender === 'user') {
            messageDiv.classList.add('ml-auto');
            messageDiv.innerHTML = `
                <div class="bg-blue-600 text-white rounded-t-xl rounded-bl-xl p-3 shadow-md text-sm">
                    ${text}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl p-3 shadow-md text-sm">
                    ${text}
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    function processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        let reply = botResponses['default'];

        for (const key in botResponses) {
            if (lowerMessage.includes(key) && key !== 'default') {
                reply = botResponses[key];
                break;
            }
        }

        // Simulate network delay for realism
        setTimeout(() => {
            appendMessage('bot', reply);
        }, 600);
    }

    sendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            appendMessage('user', message);
            chatInput.value = '';
            processUserMessage(message);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLoginBtn = document.getElementById('mobile-nav-login-btn');
    const mobileBookBtn = document.getElementById('mobile-nav-book-btn');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.add('hidden');
            if (navLoginBtn) navLoginBtn.click(); // Trigger the desktop login button logic
        });
    }

    if (mobileBookBtn) {
        mobileBookBtn.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.add('hidden');
            // Call the same function used by desktop buttons
            openBookingModal('');
        });
    }

    // --- Auth Modal Logic ---
    const authModal = document.getElementById('auth-modal');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const closeAuthBtn = document.getElementById('close-auth');
    
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');

    // Open Modal
    if(navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.remove('hidden-custom');
            authModal.classList.add('visible-custom');
        });
    }

    // Close Modal
    if(closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authModal.classList.remove('visible-custom');
            authModal.classList.add('hidden-custom');
        });
    }

    // Close on clicking outside modal
    if(authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthBtn.click();
            }
        });
    }

    // Switch to Sign Up
    if(tabSignup) {
        tabSignup.addEventListener('click', () => {
            tabSignup.classList.remove('text-gray-500', 'hover:text-gray-700');
            tabSignup.classList.add('text-blue-600', 'bg-white', 'shadow-sm');
            
            tabLogin.classList.remove('text-blue-600', 'bg-white', 'shadow-sm');
            tabLogin.classList.add('text-gray-500', 'hover:text-gray-700');
            
            formLogin.classList.add('hidden');
            formSignup.classList.remove('hidden');
        });
    }

    // Switch to Log In
    if(tabLogin) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.remove('text-gray-500', 'hover:text-gray-700');
            tabLogin.classList.add('text-blue-600', 'bg-white', 'shadow-sm');
            
            tabSignup.classList.remove('text-blue-600', 'bg-white', 'shadow-sm');
            tabSignup.classList.add('text-gray-500', 'hover:text-gray-700');
            
            formSignup.classList.add('hidden');
            formLogin.classList.remove('hidden');
        });
    }

    // --- Booking Logic ---
    const bookingModal = document.getElementById('booking-modal');
    const closeBookingBtn = document.getElementById('close-booking');
    const destInput = document.getElementById('dest-input');
    const formBooking = document.getElementById('form-booking');
    const navBookBtn = document.getElementById('nav-book-btn');
    
    // Select all Book buttons inside destination cards
    const cardBookBtns = document.querySelectorAll('.destination-card button');

    function openBookingModal(destinationName = '') {
        if(destInput) {
            destInput.value = destinationName;
        }

        // Reset staggered form state - hide payment section by default
        const paymentOptionsWrapper = document.getElementById('payment-options-wrapper');
        const paymentToggleContainer = document.getElementById('payment-toggle-container');
        if (paymentOptionsWrapper) paymentOptionsWrapper.classList.add('hidden-payment');
        if (paymentToggleContainer) paymentToggleContainer.style.display = 'block';

        if(bookingModal) {
            bookingModal.classList.remove('hidden-custom');
            bookingModal.classList.add('visible-custom');
        }
    }

    if(navBookBtn) {
        navBookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openBookingModal('');
        });
    }

    cardBookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.destination-card');
            const destName = card ? card.querySelector('h4').textContent : '';
            openBookingModal(destName);
        });
    });

    if(closeBookingBtn) {
        closeBookingBtn.addEventListener('click', () => {
            bookingModal.classList.remove('visible-custom');
            bookingModal.classList.add('hidden-custom');
        });
    }

    if(bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingBtn.click();
            }
        });
    }

    // --- Payment Staggered Reveal ---
    const showPaymentBtn = document.getElementById('show-payment-btn');
    const paymentOptionsWrapper = document.getElementById('payment-options-wrapper');
    const paymentToggleContainer = document.getElementById('payment-toggle-container');

    if (showPaymentBtn) {
        showPaymentBtn.addEventListener('click', () => {
            if (paymentOptionsWrapper) {
                paymentOptionsWrapper.classList.remove('hidden-payment');
            }
            if (paymentToggleContainer) {
                paymentToggleContainer.style.display = 'none';
            }
        });
    }

    // --- Payment Method Selection Logic ---
    const paymentRadios = document.querySelectorAll('.payment-radio');
    const cardDetailsSection = document.getElementById('card-details-section');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardDetailsSection.classList.remove('hidden-payment');
            } else {
                cardDetailsSection.classList.add('hidden-payment');
            }
        });
    });

    // Form Submission Logs/Alerts
    if(formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login submitted! (Mockup)');
            closeAuthBtn.click();
        });
    }
    
    if(formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Sign Up submitted! (Mockup)');
            closeAuthBtn.click();
        });
    }

    if(formBooking) {
        formBooking.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const paymentOptionsWrapper = document.getElementById('payment-options-wrapper');
            if (paymentOptionsWrapper && paymentOptionsWrapper.classList.contains('hidden-payment')) {
                // If they haven't revealed payment yet, show it first
                showPaymentBtn.click();
                return;
            }

            const destination = document.getElementById('dest-input').value;
            const name = document.getElementById('name-booking').value;
            
            // --- Success Animation/Message ---
            const modalInner = formBooking.closest('.p-8');
            const originalContent = modalInner.innerHTML;
            
            modalInner.style.opacity = '0';
            setTimeout(() => {
                modalInner.innerHTML = `
                    <div class="text-center py-12">
                        <div class="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 scale-0 animate-[bounce_0.6s_ease-out_forwards]">
                            <i class="fa-solid fa-check text-4xl"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-slate-50 mb-2">Booking Successful!</h3>
                        <p class="text-slate-400 mb-8">Thank you ${name}! Your adventure to <strong>${destination}</strong> has been initiated. We've sent the details to your email.</p>
                        <button id="finish-booking" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all">
                            Done
                        </button>
                    </div>
                `;
                modalInner.style.opacity = '1';
                
                document.getElementById('finish-booking').addEventListener('click', () => {
                    closeBookingBtn.click();
                    // Restore original content for next time
                    setTimeout(() => {
                        modalInner.innerHTML = originalContent;
                        // Re-attach listeners is complex, so better just reload or re-init
                        // For now, let's just use the reset logic in openBookingModal
                    }, 500);
                });
            }, 300);
        });
    }
});
