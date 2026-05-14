document.addEventListener('DOMContentLoaded', function() {

    const counterValue = document.querySelector('#counter-value')
    const counterMl = document.querySelector('#counter-ml')
    const counterStatus = document.querySelector('#counter-status')
    const btnPlus = document.querySelector('#btn-plus')
    const btnMinus = document.querySelector('#btn-minus')
    const btnReset = document.querySelector('#btn-reset')
    const normFill = document.querySelector('#norm-fill')
    const normPercent = document.querySelector('#norm-percent')
    const historyList = document.querySelector('#history-list')
    const statToday = document.querySelector('#stat-today')
    const statTotal = document.querySelector('#stat-total')
    const statDays = document.querySelector('#stat-days')

    const statuses = {
        0:  'Починайте день з склянки води, громадянине.',
        1:  'Зафіксовано одну склянку. Продовжуйте.',
        2:  'Два. Непогано. Міністерство спостерігає.',
        3:  'Три склянки. Ви на правильному шляху.',
        4:  'Половина норми. Не зупиняйтесь.',
        5:  'П\'ять склянок. Підозріло ретельно.',
        6:  'Шість. Ви занадто старанні. Чому?',
        7:  'Сім склянок. Ще одна і буде рівно вісім.',
        8:  'Рівно вісім. Занадто точно. Відкрито перевірку.',
        9:  '⚠️ Дев\'ять склянок — перевищення норми. Дані передано.',
        10: '⚠️ Десять склянок. Направлено інспекційну бригаду.',
    }

    let count = parseInt(localStorage.getItem('water_count') || '0')
    let total = parseInt(localStorage.getItem('water_total') || '0')
    let days  = parseInt(localStorage.getItem('water_days')  || '1')
    let history = JSON.parse(localStorage.getItem('water_history') || '[]')

    function updateUI() {
        counterValue.textContent = count
        counterMl.textContent = count * 250

        const statusKey = Math.min(count, 10)
        counterStatus.textContent = statuses[statusKey] || '⚠️ Критичне споживання. Справу передано до суду.'

        const percent = Math.min(Math.round((count / 8) * 100), 100)
        normFill.style.width = percent + '%'
        normPercent.textContent = percent + '%'
        normFill.style.background = count > 8 ? 'var(--color-danger)' : 'var(--color-accent)'

        statToday.textContent = count
        statTotal.textContent = total
        statDays.textContent  = days

        localStorage.setItem('water_count',   count)
        localStorage.setItem('water_total',   total)
        localStorage.setItem('water_days',    days)
        localStorage.setItem('water_history', JSON.stringify(history))

        renderHistory()
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<p class="history-empty">Журнал порожній. Почніть пити воду, громадянине.</p>'
            return
        }
        const recent = history.slice(-10).reverse()
        historyList.innerHTML = recent.map(function(entry) {
            return `<div class="history-entry">
                <span>${entry.time}</span>
                <span>Склянка №${entry.num} — ${entry.ml} мл</span>
                <span style="color: var(--color-accent)">зафіксовано ✓</span>
            </div>`
        }).join('')
    }

    // Кнопка + (випив склянку)
    btnPlus.addEventListener('click', function() {
        count++
        total++

        const now = new Date()
        const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
        history.push({ time: time, num: total, ml: 250 })

        // Нараховуємо бали через глобальну функцію з script.js
        window.addGlobalScore(10, 'випив склянку води')

        // Анімація числа
        counterValue.style.transform = 'scale(1.3)'
        counterValue.style.color = '#fff'
        setTimeout(function() {
            counterValue.style.transform = 'scale(1)'
            counterValue.style.color = 'var(--color-accent)'
        }, 200)

        updateUI()

        if (count === 9) {
            setTimeout(function() {
                alert('⚠️ УВАГА: Зафіксовано перевищення денної норми водоспоживання. Матеріали передано до відповідних органів.')
            }, 300)
        }
    })

    // Кнопка − (скасувати)
    btnMinus.addEventListener('click', function() {
        if (count <= 0) {
            alert('Неможливо випити від\'ємну кількість води. Хоча... справу передано на розгляд комісії.')
            return
        }
        count--
        history.pop()

        // Віднімаємо бали через глобальну функцію
        window.addGlobalScore(-10, 'скасував склянку')

        updateUI()
    })

    // Скидання дня
    btnReset.addEventListener('click', function() {
        const confirm1 = confirm('Ви впевнені що хочете скинути показники?\nЦя дія буде зафіксована міністерством.')
        if (!confirm1) return
        count = 0
        history = []
        days++
        updateUI()
    })

    updateUI()

})