document.addEventListener('DOMContentLoaded', function() {

    const chatMessages = document.querySelector('#chat-messages')
    const chatInput = document.querySelector('#chat-input')
    const chatSend = document.querySelector('#chat-send')
    const hintBtns = document.querySelectorAll('.hint-btn')

    // Відповіді оператора Василя
    // Він завжди каже одне й те саме але трохи по-різному
    const responses = [
        'Дякуємо за звернення. Ваше питання зареєстровано під номером {NUM}. Очікуйте відповіді протягом 80-90 років.',
        'Шановний громадянине. Ваше звернення прийнято. Номер вашої справи: {NUM}. Рекомендуємо утриматись від водоспоживання до отримання відповіді.',
        'Зрозумів вас. Питання передано до відповідного відділу. Реєстраційний номер: {NUM}. Термін розгляду стандартний — 80-90 років.',
        'Прийнято до відома. Номер звернення {NUM}. Василь зобов\'язаний повідомити що не може надавати конкретні відповіді згідно наказу №ВС-00/2031.',
        'Ваше повідомлення отримано і вже знаходиться на розгляді. Номер: {NUM}. Будь ласка не надсилайте повторних звернень — це сповільнює процес.',
        'Фіксую. Номер справи {NUM}. Хочу додати що Василь особисто не несе відповідальності за терміни розгляду. Це системне питання.',
        'Звернення №{NUM} прийнято. Між нами кажучи — я б радив більше не питати. Але це суто моя думка. Офіційно — чекайте 80-90 років.',
        'Зареєстровано. {NUM}. Василь хотів би сказати більше але не може. Просто... будьте обережні з водою. Це все що я можу.',
    ]

    let messageCount = 0
    let isTyping = false

    // Функція додавання повідомлення
    function addMessage(text, isUser) {
        const now = new Date()
        const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')

        const msg = document.createElement('div')
        msg.className = 'chat-message ' + (isUser ? 'chat-message--user' : 'chat-message--operator')
        msg.innerHTML = `
      <div class="chat-bubble">${text}</div>
      <span class="chat-time">${time}</span>
    `
        chatMessages.appendChild(msg)

        // Автоскрол вниз
        chatMessages.scrollTop = chatMessages.scrollHeight
    }

    // Функція відповіді оператора
    function operatorReply(userText) {
        if (isTyping) return
        isTyping = true

        // Показуємо що оператор друкує
        const typingMsg = document.createElement('div')
        typingMsg.className = 'chat-message chat-message--operator'
        typingMsg.id = 'typing-indicator'
        typingMsg.innerHTML = '<div class="chat-bubble">Василь друкує...</div>'
        chatMessages.appendChild(typingMsg)
        chatMessages.scrollTop = chatMessages.scrollHeight

        // Затримка 1-3 секунди перед відповіддю
        const delay = 1000 + Math.random() * 2000

        setTimeout(function() {
            // Видаляємо індикатор
            const indicator = document.querySelector('#typing-indicator')
            if (indicator) indicator.remove()

            // Вибираємо відповідь
            const index = messageCount % responses.length
            const num = Math.floor(Math.random() * 900000 + 100000)
            const response = responses[index].replace('{NUM}', 'ГЛ-' + num)

            addMessage(response, false)
            messageCount++
            isTyping = false

            // Іноді Василь додає підозріле повідомлення
            if (messageCount === 4) {
                setTimeout(function() {
                    addMessage('...Вибачте. Це не я. Ігноруйте попереднє повідомлення.', false)
                }, 2000)
            }

            if (messageCount === 7) {
                setTimeout(function() {
                    addMessage('Будь ласка не питайте про кімнату 404. Її не існує.', false)
                }, 1500)
            }

        }, delay)
    }

    // Відправка повідомлення
    function sendMessage() {
        const text = chatInput.value.trim()
        if (!text) return

        addMessage(text, true)
        chatInput.value = ''
        operatorReply(text)
    }

    // Кнопка відправити
    chatSend.addEventListener('click', sendMessage)

    // Enter для відправки
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendMessage()
    })

    // Кнопки підказок
    hintBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            chatInput.value = btn.textContent
            sendMessage()
        })
    })

})