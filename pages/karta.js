document.addEventListener('DOMContentLoaded', function() {

    // ==============================
    // ІНІЦІАЛІЗАЦІЯ КАРТИ
    // Leaflet — безкоштовна бібліотека карт
    // ==============================

    // Центруємо на Україні
    const map = L.map('map').setView([48.3794, 31.1656], 6)

    // Додаємо тайли (картинки карти) від OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map)

    // ==============================
    // ЗАГОТОВЛЕНІ КАЛЮЖІ
    // ==============================
    const puddles = [
        {
            lat: 50.4501, lng: 30.5234,
            name: 'Калюжа біля Верховної Ради',
            status: 'danger',
            desc: 'Підозріло велика. Походження невідоме. Справа №КЛ-001.'
        },
        {
            lat: 49.9935, lng: 36.2304,
            name: 'Харківська аномальна калюжа',
            status: 'watch',
            desc: 'Існує з 1987 року. Не висихає. Під постійним наглядом.'
        },
        {
            lat: 46.4825, lng: 30.7233,
            name: 'Одеська підозріла пляма',
            status: 'grey',
            desc: 'Класифікація не визначена. Комісія збирається з 2019 року.'
        },
        {
            lat: 48.4647, lng: 35.0462,
            name: 'Дніпровська офіційна калюжа №1',
            status: 'allowed',
            desc: 'Єдина дозволена калюжа в Україні. Дозвіл №ДЗВ-0001 від 1423 року.'
        },
        {
            lat: 49.2328, lng: 28.4682,
            name: 'Вінницька таємна волога',
            status: 'danger',
            desc: 'Виявлена інспектором Ковальчуком. Справа засекречена.'
        },
        {
            lat: 50.6199, lng: 26.2516,
            name: 'Рівненська підозрілість',
            status: 'watch',
            desc: 'Схожа на воду але офіційно водою не визнана.'
        },
        {
            lat: 47.8388, lng: 35.1396,
            name: 'Запорізька аномалія',
            status: 'grey',
            desc: 'З\'явилась після дощу. Дощ був несанкціонований.'
        },
    ]

    // Кольори для маркерів
    const colors = {
        danger:  '#ff5252',
        watch:   '#4fc3f7',
        grey:    '#ffd740',
        allowed: '#69f0ae'
    }

    const statusNames = {
        danger:  'Небезпечна',
        watch:   'Під наглядом',
        grey:    'Сіра зона',
        allowed: 'Дозволена'
    }

    let totalCount = puddles.length
    let dangerCount = puddles.filter(p => p.status === 'danger').length

    // Додаємо маркери на карту
    puddles.forEach(function(puddle) {
        const color = colors[puddle.status]

        // Створюємо кастомний маркер
        const icon = L.divIcon({
            html: `<div style="
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid #fff;
        box-shadow: 0 0 8px ${color};
      "></div>`,
            iconSize: [14, 14],
            className: ''
        })

        // Додаємо на карту з попапом
        L.marker([puddle.lat, puddle.lng], { icon })
            .addTo(map)
            .bindPopup(`
        <strong>${puddle.name}</strong><br>
        <em style="color:${color}">${statusNames[puddle.status]}</em><br>
        <small>${puddle.desc}</small>
      `)
    })

    // ==============================
    // ДОДАВАННЯ НОВИХ КАЛЮЖ КЛІКОМ
    // ==============================
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(4)
        const lng = e.latlng.lng.toFixed(4)

        // Випадковий статус
        const statuses = ['danger', 'watch', 'grey']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
        const color = colors[randomStatus]

        const icon = L.divIcon({
            html: `<div style="
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid #fff;
        box-shadow: 0 0 8px ${color};
        animation: blink 1s infinite;
      "></div>`,
            iconSize: [14, 14],
            className: ''
        })

        L.marker([lat, lng], { icon })
            .addTo(map)
            .bindPopup(`
        <strong>Нова підозріла калюжа</strong><br>
        <em style="color:${color}">${statusNames[randomStatus]}</em><br>
        <small>Координати: ${lat}, ${lng}<br>
        Повідомлено громадянином. Справу відкрито.</small>
      `)
            .openPopup()

        // Оновлюємо лічильники
        totalCount++
        if (randomStatus === 'danger') dangerCount++
        document.querySelector('#map-total').textContent = totalCount
        document.querySelector('#map-dangerous').textContent = dangerCount

        // Додаємо в список
        addPuddleEntry(lat, lng, randomStatus)

        alert(`✅ Калюжу зафіксовано!\nСтатус: ${statusNames[randomStatus]}\nСправу передано до міністерства.`)
    })

    // ==============================
    // СПИСОК КАЛЮЖ
    // ==============================
    const puddleEntries = document.querySelector('#puddle-entries')

    function addPuddleEntry(lat, lng, status) {
        const entry = document.createElement('div')
        entry.className = 'puddle-entry'
        const statusClass = status === 'danger' ? 'puddle-status--danger' :
            status === 'watch'  ? 'puddle-status--watch' :
                'puddle-status--grey'
        entry.innerHTML = `
      <span>Координати: ${lat}, ${lng}</span>
      <span>Повідомлено щойно</span>
      <span class="puddle-status ${statusClass}">${statusNames[status]}</span>
    `
        puddleEntries.prepend(entry)
    }

    // Показуємо заготовлені калюжі в списку
    puddles.slice().reverse().forEach(function(p) {
        addPuddleEntry(p.lat.toFixed(4), p.lng.toFixed(4), p.status)
    })

    // Оновлюємо лічильники
    document.querySelector('#map-total').textContent = totalCount
    document.querySelector('#map-dangerous').textContent = dangerCount

})