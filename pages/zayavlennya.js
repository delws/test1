document.addEventListener('DOMContentLoaded', function() {

    // Всі поля форми
    const inputs = document.querySelectorAll('.form-input, input[type="radio"], input[type="checkbox"]')
    const progressFill = document.querySelector('#progress-fill')
    const progressText = document.querySelector('#progress-text')
    const submitBtn = document.querySelector('#submit-btn')
    const formContainer = document.querySelector('#form-container')
    const formResult = document.querySelector('#form-result')
    const resultNumber = document.querySelector('#result-number')
    const agreement = document.querySelector('#agreement')
    const totalFields = 12

    // Оновлення прогрес-бару
    function updateProgress() {
        let filled = 0
        document.querySelectorAll('.form-input').forEach(function(input) {
            if (input.value.trim() !== '') filled++
        })
        const percent = Math.round((filled / totalFields) * 100)
        progressFill.style.width = percent + '%'
        progressText.textContent = 'Заповнено: ' + filled + ' з ' + totalFields + ' полів'
    }

    // Слухаємо зміни в полях
    inputs.forEach(function(input) {
        input.addEventListener('input', updateProgress)
        input.addEventListener('change', updateProgress)
    })

    // Відправка форми
    submitBtn.addEventListener('click', function() {

        // Перевіряємо чи є згода
        if (!agreement.checked) {
            alert('⚠️ Необхідно погодитись з умовами передачі водних даних')
            return
        }

        // Генеруємо номер заяви
        const number = 'ВД-' + Math.floor(Math.random() * 9000000 + 1000000)
        resultNumber.textContent = number

        // Ховаємо форму показуємо результат
        formContainer.style.display = 'none'
        formResult.style.display = 'block'

        // Зберігаємо в localStorage
        localStorage.setItem('zayava_number', number)
        localStorage.setItem('zayava_date', new Date().toLocaleDateString('uk-UA'))
    })

})