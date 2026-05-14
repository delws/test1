document.addEventListener('DOMContentLoaded', function() {

    // ==============================
    // 1. ЛІЧИЛЬНИК ПОРУШНИКІВ
    // ==============================
    const narushiteley = document.querySelector('#narushiteley')

    if (narushiteley) {
        let count = parseInt(narushiteley.textContent)
        setInterval(function() {
            if (Math.random() > 0.7) {
                count = count + 1
                narushiteley.textContent = count
            }
        }, 3000)
    }


    // ==============================
    // 2. ЕФЕКТ ДРУКАРСЬКОЇ МАШИНКИ
    // ==============================
    const heroTitle = document.querySelector('.hero h2')

    if (heroTitle) {
        const originalText = heroTitle.textContent
        heroTitle.textContent = ''
        let i = 0
        const typing = setInterval(function() {
            heroTitle.textContent += originalText[i]
            i++
            if (i >= originalText.length) {
                clearInterval(typing)
            }
        }, 50)
    }


    // ==============================
    // 3. ПОПАП ПРИ ЗАВАНТАЖЕННІ
    // ==============================
    const popup = document.querySelector('#popup')
    const popupBtn = document.querySelector('#popup-btn')
    const waterInput = document.querySelector('#water-input')

    if (popup && popupBtn && waterInput) {
        const savedWater = localStorage.getItem('water_today')
        if (savedWater !== null) {
            popup.style.display = 'none'
        }

        popupBtn.addEventListener('click', function() {
            const glasses = parseInt(waterInput.value)

            if (isNaN(glasses) || glasses < 0) {
                alert('Введіть коректне число')
                return
            }

            localStorage.setItem('water_today', glasses)
            popup.style.display = 'none'

            if (glasses === 0) {
                alert('⚠️ УВАГА: Зафіксовано нульове споживання води. Направлено бригаду перевірки.')
            } else if (glasses > 8) {
                alert('⚠️ УВАГА: Зафіксовано підозріло велику кількість споживання води. Матеріали передано до відповідних органів.')
            } else {
                alert('✅ Дані прийнято. Ваше споживання води взято на облік. Гарного дня, громадянине.')
            }
        })
    }


    // ==============================
    // 4. ЛІЧИЛЬНИК ЗАЯВЛЕНЬ
    // ==============================
    const zayavleniyEl = document.querySelector('#zayavleniy')

    if (zayavleniyEl) {
        let zCount = 1284847
        setInterval(function() {
            const add = Math.floor(Math.random() * 3) + 1
            zCount = zCount + add
            zayavleniyEl.textContent = zCount.toLocaleString('uk-UA')
        }, 2000)
    }


    // ==============================
    // 5. ШПИГУНСЬКІ ПОВІДОМЛЕННЯ
    // ==============================
    const spyMessages = [
        'Ваші рухи зафіксовано.',
        'Міністерство спостерігає.',
        'Не рухайтесь різко.',
        'Ваша спрага проаналізована.',
        'Дані передано.',
        'Ви виглядаєте спраглим.',
        'Кількість кліків підозріла.',
        'Ваш браузер внесено до реєстру.',
    ]

    const spyMsg = document.createElement('div')
    spyMsg.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1a0000;
        border: 1px solid #ff5252;
        color: #ff5252;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        padding: 10px 16px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
    `
    document.body.appendChild(spyMsg)

    setInterval(function() {
        const randomMsg = spyMessages[Math.floor(Math.random() * spyMessages.length)]
        spyMsg.textContent = '👁️ ' + randomMsg
        spyMsg.style.opacity = '1'
        setTimeout(function() {
            spyMsg.style.opacity = '0'
        }, 3000)
    }, 15000)


    // ==============================
    // 6. АКТИВНЕ ПОСИЛАННЯ В НАВІГАЦІЇ
    // ==============================
    const navLinks = document.querySelectorAll('.nav a')
    const currentPage = window.location.pathname

    navLinks.forEach(function(link) {
        const href = link.getAttribute('href')
        if (currentPage.endsWith(href) || currentPage.includes(href.replace('../', ''))) {
            link.style.background = 'var(--color-accent)'
            link.style.color = '#000'
        }
    })


    // ==============================
    // 7. ПЛАВНА ПОЯВА ЕЛЕМЕНТІВ
    // ==============================
    const fadeElements = document.querySelectorAll(
        '.news-item, .stat-item, .section-title, .news-card, .cstat-item'
    )

    fadeElements.forEach(function(el) {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    })

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1'
                entry.target.style.transform = 'translateY(0)'
                observer.unobserve(entry.target)
            }
        })
    }, { threshold: 0.1 })

    fadeElements.forEach(function(el) {
        observer.observe(el)
    })


    // ==============================
    // 8. КОНСОЛЬНА ПАСХАЛКА
    // ==============================
    console.log('%c👁️ МИ БАЧИМО ВАС', 'color: #ff5252; font-size: 20px; font-weight: bold;')
    console.log('%cВи відкрили консоль. Це зафіксовано.', 'color: #4fc3f7; font-size: 14px;')
    console.log('%cЯкщо ви розробник — подайте заявку на технічний доступ. Форма №ТД-2031/б', 'color: #888; font-size: 12px;')
    console.log('%cПідказка: /pages/secret.html', 'color: #1a1a2e; font-size: 12px;')


    // ==============================
    // 9. СИСТЕМА ПОВІДОМЛЕНЬ — СТОПКА
    // Всі повідомлення в одному контейнері
    // Коли верхнє зникає — нижні плавно їдуть вгору
    // ==============================

    // Один контейнер для всіх повідомлень
    const notifContainer = document.createElement('div')
    notifContainer.id = 'notif-container'
    notifContainer.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        pointer-events: none;
    `
    document.body.appendChild(notifContainer)

    // Глобальна функція — доступна з будь-якого файлу
    window.showNotif = function(points, reason) {
        const isPositive = points >= 0

        const msg = document.createElement('div')
        msg.style.cssText = `
            background: ${isPositive ? '#16213e' : '#1a0000'};
            border: 1px solid ${isPositive ? '#4fc3f7' : '#ff5252'};
            color: ${isPositive ? '#4fc3f7' : '#ff5252'};
            font-family: 'Courier New', monospace;
            font-size: 13px;
            padding: 12px 20px;
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease, padding 0.3s ease, margin 0.3s ease;
            max-height: 60px;
            overflow: hidden;
            white-space: nowrap;
        `

        const sign = isPositive ? '+' : ''
        msg.textContent = sign + points + ' балів — ' + reason
        notifContainer.appendChild(msg)

        // Плавна поява — зліва направо
        setTimeout(function() {
            msg.style.opacity = '1'
            msg.style.transform = 'translateX(0)'
        }, 10)

        // Плавне зникнення — стискається і нижні їдуть вгору
        setTimeout(function() {
            msg.style.opacity = '0'
            msg.style.transform = 'translateX(20px)'
            msg.style.maxHeight = '0'
            msg.style.padding = '0 20px'
            msg.style.margin = '0'
            setTimeout(function() { msg.remove() }, 300)
        }, 3000)
    }

    // Нараховуємо бали і показуємо повідомлення
    window.addGlobalScore = function(points, reason) {
        const myName = localStorage.getItem('my_citizen_name')
        if (!myName) return

        let citizens = JSON.parse(localStorage.getItem('citizens') || '[]')
        const index = citizens.findIndex(function(c) { return c.name === myName })
        if (index === -1) return

        citizens[index].score = Math.max(0, citizens[index].score + points)
        localStorage.setItem('citizens', JSON.stringify(citizens))

        window.showNotif(points, reason)
    }

    // Перевіряємо дії при завантаженні сторінки
    const myName = localStorage.getItem('my_citizen_name')

    if (myName) {

        // За подану заяву — 500 балів (один раз)
        const zayava = localStorage.getItem('zayava_number')
        const zayavaScored = localStorage.getItem('zayava_scored')
        if (zayava && !zayavaScored) {
            window.addGlobalScore(500, 'подав заяву на воду')
            localStorage.setItem('zayava_scored', 'true')
        }

        // За відвідування сторінки — 5 балів (раз на годину)
        const lastVisit = parseInt(localStorage.getItem('last_visit_score') || '0')
        const now = Date.now()
        if (now - lastVisit > 3600000) {
            window.addGlobalScore(5, 'відвідав портал')
            localStorage.setItem('last_visit_score', now)
        }

    }

}) // кінець DOMContentLoaded