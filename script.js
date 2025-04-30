document.addEventListener('DOMContentLoaded', () => {
    // ====== МОК-ДАННЫЕ ======
    // В реальном приложении эти данные будут загружаться с вашего бэкенда,
    // который прочитает ваш JSON-файл на сервере.
    // Этот пример соответствует структуре JSON, которую мы утвердили.
    const mockData = [
        {
            "name": "International Women's Day",
            "date": "03-08",
            "countries": ["Russia", "Ukraine", "Belarus"],
            "languages": ["RUS", "UA", "ENG"],
            "categories": ["flowers", "gifts", "sweets"],
            "insights": [{ "description": "International Women's Day" }],
            "offers": [{ "type": "promocode", "code": "WOMEN20", "description": "20% off bouquets", "categories": ["flowers"], "valid_until": "2024-03-15" }],
            "service_advantages": [{ "description": "Wide selection of bouquets" }],
            "collections": [{ "name": "Spring collection", "categories": ["flowers"] }]
        },
        {
            "name": "Mother's Day",
            "date": "last Sunday of November", // Пример описательной даты
            "countries": ["Russia"],
            "languages": ["RUS", "ENG"],
            "categories": ["flowers", "gifts"],
             "insights": [{ "description": "Day of gratitude for mothers" }],
             "offers": [{ "type": "discount", "description": "15% off gifts for mothers", "categories": ["gifts"]}],
            "service_advantages": [{ "description": "Original gifts for loved ones" }],
            "collections": [{ "name": "Gifts for Mom collection", "categories": ["gifts"] }]
        },
        {
             "name": "Black Friday",
             "date": "last Friday of November",
             "countries": ["Russia", "Ukraine", "Belarus", "Germany", "Spain", "Poland"],
             "languages": ["RUS", "UA", "ENG", "DE", "ES", "PL"],
             "categories": ["flowers", "gifts", "sweets", "all"],
              "insights": [{ "description": "Huge discounts and promotions" }],
              "offers": [{ "type": "discount", "description": "Up to 70% off all categories", "code": "BLACKFRIDAY"}],
             "service_advantages": [{ "description": "Huge assortment of products" }],
             "collections": [] // Нет подборок
        },
         {
            "name": "Eid al-Fitr",
            "date": "floating",
            "countries": ["UAE"],
            "languages": ["ENG", "RUS", "AZ"], // Пример: для ОАЭ могут быть актуальны ENG, RUS, AZ
            "categories": ["gifts", "sweets"],
            "insights": [
              { "description": "Celebration marking the end of Ramadan" },
              { "description": "Time to give gifts to loved ones" }
            ],
            "offers": [
              {
                "type": "promocode",
                "code": "EID20",
                "description": "20% off all categories",
                "categories": ["flowers", "gifts", "sweets"],
                "countries": ["UAE"],
                "valid_until": "2024-04-30"
              }
            ],
            "service_advantages": [
              { "description": "Large selection of holiday gifts" },
              { "description": "Fast delivery in UAE" }
            ],
            "collections": [
              {
                "name": "Eid collection of gifts",
                "categories": ["gifts", "sweets"]
              }
            ]
         }
        // ... добавьте остальные инфоповоды по необходимости
    ];

    const allLanguages = ["RUS", "ENG", "UA", "DE", "ES", "PT", "FR", "TR", "IT", "HU", "AZ", "PL", "KZ"];
    const textStyles = ["Friendly", "Premium", "Official", "Salesy", "Creative"]; // Названия на английском для промпта

    // ====== ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ ФОРМЫ ======
    const form = document.getElementById('push-form');
    const countrySelect = document.getElementById('country');
    const languageSelect = document.getElementById('language');
    const eventSelect = document.getElementById('event');
    const categorySelect = document.getElementById('category');
    const styleSelect = document.getElementById('style');
    const useEmojisCheckbox = document.getElementById('use-emojis');

    const resultsDiv = document.getElementById('results');
    const generatedTitleTextarea = document.getElementById('generated-title');
    const generatedTextTextarea = document.getElementById('generated-text');
    const titleCountSpan = document.getElementById('title-count');
    const textCountSpan = document.getElementById('text-count');


    // ====== ФУНКЦИИ ЗАПОЛНЕНИЯ СЕЛЕКТОВ ======

    function populateSelect(selectElement, options, placeholder) {
        selectElement.innerHTML = `<option value="">-- ${placeholder} --</option>`;
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
        selectElement.disabled = options.length === 0; // Деактивировать, если нет опций (кроме плейсхолдера)
    }

    function populateCountries() {
        const countries = [...new Set(mockData.flatMap(item => item.countries))].sort();
        populateSelect(countrySelect, countries, 'Выберите страну');
         // При загрузке страницы, остальные селекты будут пустыми
        populateSelect(eventSelect, [], 'Выберите событие');
        populateSelect(categorySelect, [], 'Выберите категорию');
    }

     function populateLanguages() {
         // Здесь можно было бы фильтровать по выбранной стране/событию,
         // но в ТЗ указано, что языки из фиксированного списка.
         // В MVP пока просто заполним всеми доступными.
         // В будущем: возможно, бэкенд будет возвращать только актуальные для связки Страна-Событие языки.
         populateSelect(languageSelect, allLanguages.sort(), 'Выберите язык');
     }

     function populateTextStyles() {
         populateSelect(styleSelect, textStyles, 'Выберите стиль');
     }

    // ====== ОБРАБОТЧИКИ ИЗМЕНЕНИЙ СЕЛЕКТОВ ======

    countrySelect.addEventListener('change', () => {
        const selectedCountry = countrySelect.value;
        eventSelect.value = ""; // Сбросить выбор события
        categorySelect.value = ""; // Сбросить выбор категории

        if (selectedCountry) {
            // Фильтруем события по выбранной стране
            const relevantEvents = mockData.filter(item =>
                 item.countries.includes(selectedCountry)
            );
             const eventNames = relevantEvents.map(item => item.name).sort();
            populateSelect(eventSelect, eventNames, 'Выберите событие');
             // Очищаем и деактивируем селектор категорий до выбора события
             populateSelect(categorySelect, [], 'Выберите категорию');
        } else {
            // Если страна не выбрана, очищаем и деактивируем селектор событий и категорий
            populateSelect(eventSelect, [], 'Выберите событие');
            populateSelect(categorySelect, [], 'Выберите категорию');
        }
    });

    eventSelect.addEventListener('change', () => {
        const selectedCountry = countrySelect.value;
        const selectedEventName = eventSelect.value;
         categorySelect.value = ""; // Сбросить выбор категории

        if (selectedCountry && selectedEventName) {
             // Находим выбранное событие по имени и стране
            const selectedEvent = mockData.find(item =>
                item.name === selectedEventName && item.countries.includes(selectedCountry)
            );

            if (selectedEvent) {
                // Получаем уникальные категории для этого события
                const categories = [...new Set(selectedEvent.categories)].sort();
                populateSelect(categorySelect, categories, 'Выберите категорию');
            } else {
                 // Если событие не найдено (чего в мок-данных быть не должно), очищаем категории
                 populateSelect(categorySelect, [], 'Выберите категорию');
            }
        } else {
             // Если страна или событие не выбраны, очищаем и деактивируем категории
            populateSelect(categorySelect, [], 'Выберите категорию');
        }
    });


    // ====== ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ ======

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        // Собираем данные из формы
        const selectedCountry = countrySelect.value;
        const selectedLanguage = languageSelect.value;
        const selectedEventName = eventSelect.value;
        const selectedCategory = categorySelect.value;
        const selectedStyle = styleSelect.value;
        const useEmojis = useEmojisCheckbox.checked;

        // Находим выбранное событие в мок-данных (нужно для инсайтов, офферов и т.д.)
        // В реальном приложении это будет делать бэкенд после получения имени события от фронтенда
        const selectedEventData = mockData.find(item =>
             item.name === selectedEventName && item.countries.includes(selectedCountry)
        );

        if (!selectedEventData) {
             console.error("Selected event data not found!");
             // Возможно, стоит вывести ошибку пользователю
             return;
        }


        // В этом месте происходит *имитация* отправки данных на бэкенд.
        // В реальном приложении вы бы отправили эти данные через fetch или XMLHttpRequest
        // на ваш серверный обработчик.
        // Пример отправки:
        try {
            const response = await fetch('http://localhost:5001/generate-push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    country: selectedCountry,
                    language: selectedLanguage,
                    eventName: selectedEventName, // Отправляем только имя, бэкенд найдет полные данные
                    category: selectedCategory,
                    style: selectedStyle,
                    useEmojis: useEmojis
                    // !!! Не отправляйте полные данные инфоповода с фронтенда, это должен делать бэкенд !!!
                })
            });

            if (response.ok) {
                const generatedData = await response.json();
                // Обновляем UI с полученными данными
                generatedTitleTextarea.value = generatedData.title;
                generatedTextTextarea.value = generatedData.text;
                titleCountSpan.textContent = generatedData.title.length;
                textCountSpan.textContent = generatedData.text.length;
                
                // Показываем результаты и скрываем заглушку
                document.getElementById('empty-state').style.display = 'none';
                document.getElementById('result-content').style.display = 'block';
            } else {
                console.error('Ошибка при генерации push-уведомления:', await response.text());
                alert('Произошла ошибка при генерации push-уведомления. Проверьте консоль для деталей.');
            }
        } catch (error) {
            console.error('Ошибка соединения с сервером:', error);
            alert('Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен.');
            
            // === РЕЗЕРВНЫЙ ВАРИАНТ: Отображение сгенерированного текста (заглушка) ===
            // В случае если сервер недоступен, показываем заглушку
            const mockTitle = `Push for ${selectedEventName} in ${selectedCountry} (${selectedLanguage})`;
            const mockText = `Generated text for ${selectedCategory} with ${selectedStyle} style. Emojis: ${useEmojis}. (This is a mock result)`;

            generatedTitleTextarea.value = mockTitle.substring(0, 30);
            generatedTextTextarea.value = mockText.substring(0, 100);

            titleCountSpan.textContent = generatedTitleTextarea.value.length;
            textCountSpan.textContent = generatedTextTextarea.value.length;

            // Показываем результаты и скрываем заглушку
            document.getElementById('empty-state').style.display = 'none';
            document.getElementById('result-content').style.display = 'block';
        }
    });

    // ====== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ======
    populateCountries();
    populateLanguages();
    populateTextStyles();
});