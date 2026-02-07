document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт AnnaPhoto загружен!');
    
    // ==================== МОБИЛЬНОЕ МЕНЮ ====================
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            menuToggle.innerHTML = navList.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
    
    // ==================== ПЛАВНЫЙ СКРОЛЛ ====================
    document.querySelectorAll('.scroll-to').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== ВАЛИДАЦИЯ ФОРМЫ ====================
    const form = document.getElementById('bookingForm');
    if (form) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const nameError = document.getElementById('nameError');
        const phoneError = document.getElementById('phoneError');
        const emailError = document.getElementById('emailError');
        const modal = document.getElementById('successModal');
        const modalClose = document.getElementById('modalClose');
        const modalOk = document.getElementById('modalOk');
        
        // Маска для телефона
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    value = '+7' + value.substring(1);
                }
                
                let formatted = '';
                for (let i = 0; i < value.length; i++) {
                    if (i === 2) formatted += ' (';
                    else if (i === 5) formatted += ') ';
                    else if (i === 8 || i === 10) formatted += '-';
                    formatted += value[i];
                }
                
                e.target.value = formatted.substring(0, 18);
            });
        }
        
        // Валидаторы
        function validateName() {
            if (!nameInput || !nameError) return true;
            const name = nameInput.value.trim();
            if (name.length < 2) {
                nameError.textContent = 'Имя должно содержать минимум 2 символа';
                nameError.style.display = 'block';
                return false;
            } else {
                nameError.style.display = 'none';
                return true;
            }
        }
        
        function validatePhone() {
            if (!phoneInput || !phoneError) return true;
            const phone = phoneInput.value.replace(/\D/g, '');
            if (phone.length !== 11) {
                phoneError.textContent = 'Введите корректный номер телефона';
                phoneError.style.display = 'block';
                return false;
            } else {
                phoneError.style.display = 'none';
                return true;
            }
        }
        
        function validateEmail() {
            if (!emailInput || !emailError) return true;
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                emailError.textContent = 'Введите корректный email';
                emailError.style.display = 'block';
                return false;
            } else {
                emailError.style.display = 'none';
                return true;
            }
        }
        
        // События валидации
        if (nameInput) nameInput.addEventListener('blur', validateName);
        if (phoneInput) phoneInput.addEventListener('blur', validatePhone);
        if (emailInput) emailInput.addEventListener('blur', validateEmail);
        
        // Отправка формы
        form.addEventListener('submit', function(e) {
            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isEmailValid = validateEmail();
            
            if (isNameValid && isPhoneValid && isEmailValid) {
                // Formspree сам обработает отправку
                // Показываем модальное окно через 500мс
                setTimeout(() => {
                    if (modal) modal.style.display = 'flex';
                    form.reset();
                }, 500);
            } else {
                e.preventDefault();
            }
        });
        
        // Закрытие модального окна формы
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        }
        
        if (modalOk) {
            modalOk.addEventListener('click', () => {
                if (modal) modal.style.display = 'none';
            });
        }
        
        // Закрытие модального окна по клику вне его
        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    // ==================== LAZY LOADING ====================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ==================== ФИКСИРОВАННЫЙ HEADER ====================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    // ==================== КНОПКИ "ПОДРОБНЕЕ" (РАБОЧАЯ ВЕРСИЯ) ====================
    console.log('Инициализация кнопок "Подробнее"...');
    
    // Создаем модальное окно для подробностей
    const offerModal = document.createElement('div');
    offerModal.className = 'offer-modal';
    offerModal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 2001; align-items: center; justify-content: center;';
    
    offerModal.innerHTML = `
        <div class="offer-modal-content" style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; position: relative;">
            <button class="offer-modal-close" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">×</button>
            <h3 style="font-family: Montserrat, sans-serif; font-size: 1.3rem; margin-bottom: 15px; color: #8AA68A;"></h3>
            <p style="color: #666; line-height: 1.6;"></p>
        </div>
    `;
    
    document.body.appendChild(offerModal);
    
    // Обработчик для кнопок "Подробнее" (исправленная версия)
    document.addEventListener('click', function(e) {
        // Открытие модального окна
        if (e.target.classList.contains('offer-details-btn')) {
            console.log('Кнопка "Подробнее" нажата!');
            
            const card = e.target.closest('.offer-card');
            if (card) {
                const title = card.querySelector('h3')?.textContent || 'Заголовок';
                const details = card.dataset.offerDetails || 'Описание отсутствует';
                
                const modalTitle = offerModal.querySelector('h3');
                const modalText = offerModal.querySelector('p');
                
                if (modalTitle) modalTitle.textContent = title;
                if (modalText) modalText.textContent = details;
                
                offerModal.style.display = 'flex';
            }
        }
        
        // Закрытие модального окна
        if (e.target.classList.contains('offer-modal-close') || e.target === offerModal) {
            offerModal.style.display = 'none';
        }
    });
    
    // ==================== УЛУЧШЕНИЕ НАВИГАЦИИ ====================
    document.querySelectorAll('a[href="#contact"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector('#contact');
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== АНИМАЦИЯ ПОЯВЛЕНИЯ ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Наблюдаем за элементами
        document.querySelectorAll('.offer-card, .step, .gallery-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
    
    console.log('Инициализация завершена!');
});