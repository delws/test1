document.addEventListener('DOMContentLoaded', function() {

    const phase1 = document.querySelector('#phase-1')
    const phase2 = document.querySelector('#phase-2')
    const secretName = document.querySelector('#secret-name')

    // Рядки терміналу
    const lines = [
        '> ІНІЦІАЛІЗАЦІЯ ЗАХИЩЕНОГО З\'ЄДНАННЯ...',
        '> ПЕРЕВІРКА РІВНЯ ДОСТУПУ... ПІДТВЕРДЖЕНО',
        '> ЗАВАНТАЖЕННЯ ФАЙЛІВ КАТЕГОРІЇ OMEGA...',
        '> РОЗШИФРУВАННЯ ДАНИХ...',
        '> УВАГА: ЦЕЙ СЕАНС ЗАПИСУЄТЬСЯ',
        '> ЗАВАНТАЖЕННЯ ЗАВЕРШЕНО. ВІДКРИВАЮ ФАЙЛ.',
    ]

    const lineEls = [
        document.querySelector('#t1'),
        document.querySelector('#t2'),
        document.querySelector('#t3'),
        document.querySelector('#t4'),
        document.querySelector('#t5'),
        document.querySelector('#t6'),
    ]

    // Друкуємо рядки терміналу по черзі
    function typeLine(lineIndex, charIndex) {

        // Якщо всі рядки надруковані — переходимо до фази 2
        if (lineIndex >= lines.length) {
            setTimeout(showPhase2, 800)
            return
        }

        const line = lines[lineIndex]
        const el = lineEls[lineIndex]

        // Якщо рядок надрукований — переходимо до наступного
        if (charIndex >= line.length) {
            setTimeout(function() {
                typeLine(lineIndex + 1, 0)
            }, 300)
            return
        }

        // Друкуємо наступну букву
        el.textContent = line.substring(0, charIndex + 1)

        // Затримка між буквами — швидша ніж на головній
        setTimeout(function() {
            typeLine(lineIndex, charIndex + 1)
        }, 30)
    }

    // Показуємо фазу 2 — правда про воду
    function showPhase2() {
        phase1.style.display = 'none'
        phase2.style.display = 'block'

        // Вставляємо ім'я якщо є
        const myName = localStorage.getItem('my_citizen_name')
        if (myName && secretName) {
            secretName.textContent = myName
        } else if (secretName) {
            secretName.textContent = 'НЕВІДОМИЙ'
        }

        // Нараховуємо бали за знаходження секрету
        if (window.addGlobalScore) {
            const alreadyFound = localStorage.getItem('secret_found')
            if (!alreadyFound) {
                window.addGlobalScore(1000, 'знайшов секретний розділ')
                localStorage.setItem('secret_found', 'true')
            }
        }
    }

    // Запускаємо термінал
    typeLine(0, 0)

})