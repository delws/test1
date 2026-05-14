document.addEventListener('DOMContentLoaded', function() {

    const regBlock = document.querySelector('#register-block')
    const regName = document.querySelector('#reg-name')
    const regBtn = document.querySelector('#reg-btn')
    const ratingList = document.querySelector('#rating-list')
    const totalCitizens = document.querySelector('#total-citizens')
    const myPosition = document.querySelector('#my-position')
    const myNameDisplay = document.querySelector('#my-name-display')
    const myRankDisplay = document.querySelector('#my-rank-display')
    const myScoreDisplay = document.querySelector('#my-score-display')

    // Статуси громадян
    const badges = [
        { label: 'ЗРАЗКОВИЙ', class: 'badge--loyal' },
        { label: 'ЛОЯЛЬНИЙ', class: 'badge--loyal' },
        { label: 'ПІДОЗРІЛИЙ', class: 'badge--suspicious' },
        { label: 'НА ЗАМІТЦІ', class: 'badge--suspicious' },
        { label: 'НЕБЕЗПЕЧНИЙ', class: 'badge--danger' },
    ]

    // Заготовлені громадяни
    const defaultCitizens = [
        { name: 'Іваненко О.М.',   score: 9847 },
        { name: 'Петренко В.І.',   score: 8234 },
        { name: 'Коваленко Т.С.',  score: 7651 },
        { name: 'Мельник Р.О.',    score: 6432 },
        { name: 'Бондаренко Л.П.', score: 5891 },
        { name: 'Кравченко Д.В.',  score: 4320 },
        { name: 'Шевченко А.Ю.',   score: 3187 },
        { name: 'Лисенко С.М.',    score: 2043 },
        { name: 'Гриценко В.О.',   score: 1204 },
        { name: 'Тимченко Н.І.',   score: 847  },
    ]

    // Завантажуємо збережених громадян
    let citizens = JSON.parse(localStorage.getItem('citizens') || 'null')
    if (!citizens) {
        citizens = defaultCitizens
        localStorage.setItem('citizens', JSON.stringify(citizens))
    }

    // Мій запис
    let myName = localStorage.getItem('my_citizen_name')

    // Рендер таблиці
    function renderRating() {
        // Сортуємо за балами
        citizens.sort(function(a, b) { return b.score - a.score })

        ratingList.innerHTML = ''
        totalCitizens.textContent = citizens.length

        citizens.forEach(function(citizen, index) {
            const place = index + 1
            const isMe = citizen.name === myName

            // Визначаємо значок місця
            let placeClass = ''
            if (place === 1) placeClass = 'rating-place--gold'
            if (place === 2) placeClass = 'rating-place--silver'
            if (place === 3) placeClass = 'rating-place--bronze'

            // Визначаємо бейдж
            let badge
            if (isMe) {
                badge = { label: 'ЦЕ ВИ', class: 'badge--new' }
            } else if (citizen.score > 7000) {
                badge = badges[0]
            } else if (citizen.score > 4000) {
                badge = badges[1]
            } else if (citizen.score > 2000) {
                badge = badges[2]
            } else if (citizen.score > 1000) {
                badge = badges[3]
            } else {
                badge = badges[4]
            }

            const row = document.createElement('div')
            row.className = 'rating-row' + (isMe ? ' rating-row--me' : '')
            row.innerHTML = `
        <span class="rating-place ${placeClass}">${place}</span>
        <span>${citizen.name}</span>
        <span>${citizen.score.toLocaleString('uk-UA')} балів</span>
        <span class="rating-badge ${badge.class}">${badge.label}</span>
      `
            ratingList.appendChild(row)
        })

        // Показуємо мою позицію
        if (myName) {
            const myIndex = citizens.findIndex(c => c.name === myName)
            if (myIndex !== -1) {
                myPosition.style.display = 'block'
                regBlock.style.display = 'none'
                myNameDisplay.textContent = myName
                myRankDisplay.textContent = 'Місце в реєстрі: #' + (myIndex + 1) + ' з ' + citizens.length
                myScoreDisplay.textContent = 'Балів лояльності: ' + citizens[myIndex].score.toLocaleString('uk-UA')
            }
        }
    }

    // Реєстрація
    regBtn.addEventListener('click', function() {
        const name = regName.value.trim()

        if (!name) {
            alert('Введіть ім\'я, громадянине.')
            return
        }

        // Перевіряємо чи вже є
        const exists = citizens.find(c => c.name === name)
        if (exists) {
            alert('Громадянин з таким ім\'ям вже в реєстрі. Спроба дублювання зафіксована.')
            return
        }

        // Початковий рейтинг — випадковий але невисокий
        const score = Math.floor(Math.random() * 500 + 100)

        // Додаємо
        citizens.push({ name: name, score: score })
        myName = name

        // Зберігаємо
        localStorage.setItem('citizens', JSON.stringify(citizens))
        localStorage.setItem('my_citizen_name', name)

        alert(`✅ Вас внесено до реєстру!\nІм'я: ${name}\nПочатковий рейтинг: ${score} балів\n\nМіністерство вітає вашу лояльність.`)

        renderRating()
    })

    // Enter для реєстрації
    regName.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') regBtn.click()
    })

    // ==============================
// НАРАХУВАННЯ БАЛІВ
// Викликається з інших сторінок
// ==============================
    function addScore(reason, points) {
        if (!myName) return

        const myIndex = citizens.findIndex(c => c.name === myName)
        if (myIndex === -1) return

        citizens[myIndex].score += points
        localStorage.setItem('citizens', JSON.stringify(citizens))

        // Показуємо повідомлення
        const msg = document.createElement('div')
        msg.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--color-bg-dark);
    border: 1px solid var(--color-accent);
    color: var(--color-accent);
    font-family: 'Courier New', monospace;
    font-size: 13px;
    padding: 12px 20px;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  `
        msg.textContent = '+' + points + ' балів — ' + reason
        document.body.appendChild(msg)

        setTimeout(function() { msg.remove() }, 3000)

        renderRating()
    }

    // Щосекунди випадково змінюємо рейтинги
    setInterval(function() {
        citizens.forEach(function(citizen) {
            if (citizen.name !== myName) {
                const change = Math.floor(Math.random() * 20) - 5
                citizen.score = Math.max(0, citizen.score + change)
            }
        })
        localStorage.setItem('citizens', JSON.stringify(citizens))
        renderRating()
    }, 5000)

    // Ініціалізація
    renderRating()
// ==============================
    // НАРАХОВУЄМО БАЛИ ЗА ДІЇ
    // Перевіряємо що зробив користувач
    // ==============================

    // За кожну склянку води — 10 балів
    const waterCount = parseInt(localStorage.getItem('water_count') || '0')
    const lastWater = parseInt(localStorage.getItem('last_scored_water') || '0')
    if (waterCount > lastWater && myName) {
        const diff = waterCount - lastWater
        addScore('випив воду', diff * 10)
        localStorage.setItem('last_scored_water', waterCount)
    }

    // За подану заяву — 500 балів
    const zayava = localStorage.getItem('zayava_number')
    const zayavaScored = localStorage.getItem('zayava_scored')
    if (zayava && !zayavaScored && myName) {
        addScore('подав заяву на воду', 500)
        localStorage.setItem('zayava_scored', 'true')
    }
})