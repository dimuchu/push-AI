document.addEventListener('DOMContentLoaded', () => {
    // ====== МОК-ДАННЫЕ ======
    // В реальном приложении эти данные будут загружаться с вашего бэкенда,
    // который прочитает ваш JSON-файл на сервере.
    // Этот пример соответствует структуре JSON, которую мы утвердили.
    const mockData = [
        {
            "name": "International Women's Day",
            "date": "03-08",
            "countries": ["UAE", "Spain", "Turkey", "United Kingdom", "USA"],
            "languages": ["ENG", "RUS"],
            "categories": ["flowers", "gifts", "sweets"],
            "insights": [{ "description": "International Women's Day" }],
            "offers": [{ "type": "promocode", "code": "WOMEN20", "description": "20% off bouquets", "categories": ["flowers"], "valid_until": "2024-03-15" }],
            "service_advantages": [{ "description": "Wide selection of bouquets" }],
            "collections": [{ "name": "Spring collection", "categories": ["flowers"] }]
        },
        {
            "name": "Mother's Day",
            "date": "last Sunday of November",
            "countries": ["UAE", "Spain", "Turkey", "United Kingdom", "USA"],
            "languages": ["ENG", "RUS"],
            "categories": ["flowers", "gifts"],
            "insights": [{ "description": "Day of gratitude for mothers" }],
            "offers": [{ "type": "discount", "description": "15% off gifts for mothers", "categories": ["gifts"]}],
            "service_advantages": [{ "description": "Original gifts for loved ones" }],
            "collections": [{ "name": "Gifts for Mom collection", "categories": ["gifts"] }]
        },
        {
            "name": "Black Friday",
            "date": "last Friday of November",
            "countries": ["UAE", "Spain", "Turkey", "United Kingdom", "USA"],
            "languages": ["ENG", "RUS"],
            "categories": ["flowers", "gifts", "sweets", "all"],
            "insights": [{ "description": "Huge discounts and promotions" }],
            "offers": [{ "type": "discount", "description": "Up to 70% off all categories", "code": "BLACKFRIDAY"}],
            "service_advantages": [{ "description": "Huge assortment of products" }],
            "collections": []
        },
        {
            "name": "Eid al-Fitr",
            "date": "floating",
            "countries": ["UAE"],
            "languages": ["ENG", "RUS"],
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
    ];

    const allLanguages = ["ENG", "RUS"];
    
    // Detailed text styles with their characteristics
    const textStyles = {
        "Friendly": {
            name: "Friendly",
            description: "Warm and conversational tone",
            characteristics: [
                "Personal and warm approach",
                "Casual language",
                "Relatable expressions",
                "Emotionally engaging"
            ]
        },
        "Premium": {
            name: "Premium",
            description: "Elegant and sophisticated style",
            characteristics: [
                "Refined language",
                "Exclusive feel",
                "Emphasis on quality",
                "Subtle and tasteful"
            ]
        },
        "Official": {
            name: "Official",
            description: "Professional and formal approach",
            characteristics: [
                "Clear and direct",
                "Business-appropriate",
                "Trustworthy tone",
                "Factual information"
            ]
        },
        "Salesy": {
            name: "Salesy",
            description: "Action-oriented promotional style",
            characteristics: [
                "Strong call-to-action",
                "Emphasis on benefits",
                "Urgency creation",
                "Value highlighting"
            ]
        },
        "Creative": {
            name: "Creative",
            description: "Playful and unconventional approach",
            characteristics: [
                "Witty expressions",
                "Unexpected angles",
                "Wordplay",
                "Memorable phrases"
            ]
        }
    };

    // New data structure for functional advantages
    const functionalAdvantages = {
        "Delivery": [
            "Prompt delivery on the requested date or even same-day options",
            "Delivery in 1200+ cities across 30+ countries",
            "No address needed – just leave the phone number and we'll reconcile issues"
        ],
        "Coverage": [
            "Send gifts to your loved ones anywhere in the world"
        ],
        "Payment": [
            "Flexible payment options with all major cards accepted"
        ],
        "Transparent Ratings": [
            "Benefit from over 5 million genuine customer reviews and ratings",
            "Swipe through real photos uploaded by customers"
        ],
        "Benefits and Bonuses": [
            "Enjoy rewards with our WowPass loyalty program",
            "Earn bonuses on every purchase",
            "Refer friends for additional benefits",
            "Get a special welcome 10% promo on your first order",
            "Celebrate your birthday with a special bonus"
        ],
        "Convenient Search": [
            "Effortlessly find your perfect gift with our categories and filters"
        ],
        "Thematic Collections": [
            "Simplify your gift-giving with our curated collections for any occasion"
        ],
        "Photo Before Delivery": [
            "Ensure your gift matches your expectations with pre-delivery photos"
        ],
        "Direct Chat with the Shop": [
            "Easily communicate with the shop to personalise your order"
        ],
        "Assortment": [
            "Support local businesses with our curated selection of eco-friendly products"
        ],
        "Order Tracking": [
            "Stay informed with real-time order updates from placement to delivery"
        ],
        "Postcard": [
            "Add a personal touch with our complementary postcard"
        ],
        "User Collections": [
            "Create personalised wishlists from diverse shops",
            "Check out what other people have saved to their collections"
        ]
    };

    // ====== ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ ФОРМЫ ======
    const form = document.getElementById('push-form');
    const countrySelect = document.getElementById('country');
    const languageSelect = document.getElementById('language');
    const messageFocusSelect = document.getElementById('message-focus');
    const eventSelect = document.getElementById('event');
    const functionalAdvantageSelect = document.getElementById('functional-advantage');
    const categorySelect = document.getElementById('category');
    const styleSelect = document.getElementById('style');
    const useEmojisCheckbox = document.getElementById('use-emojis');

    const resultsDiv = document.getElementById('results');
    // const generatedTitleTextarea = document.getElementById('generated-title'); // Old textarea
    // const generatedTextTextarea = document.getElementById('generated-text'); // Old textarea
    // const titleCountSpan = document.getElementById('title-count'); // Old count span
    // const textCountSpan = document.getElementById('text-count'); // Old count span

    // Preview elements for iOS 
    const lockscreenTimeElem = document.getElementById('lockscreen-time');
    const lockscreenDateElem = document.getElementById('lockscreen-date');
    const iosTitleElem = document.getElementById('ios-title');
    const iosBodyElem = document.getElementById('ios-body');

    // Character counts
    const titleCountDisplay = document.getElementById('title-count-display');
    const textCountDisplay = document.getElementById('text-count-display');

    // Additional UI elements for state management
    const submitButton = form.querySelector('button[type="submit"]');
    const emptyStateDiv = document.getElementById('empty-state');
    const resultContentDiv = document.getElementById('result-content');

    // Development mode flag
    const isDevelopment = true; // Переключите в false для production режима

    // Sample notification for development
    const sampleNotification = {
        title: "Seamless Shopping Experience",
        text: "Discover our convenient search feature. Find exactly what you want in less time. Try it now!"
    };

    // Initially disable and remove required from hidden selects
    eventSelect.required = false;
    eventSelect.disabled = true;
    functionalAdvantageSelect.required = false;
    functionalAdvantageSelect.disabled = true;

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
        populateSelect(countrySelect, ["All geo", ...countries], 'Select a country');
        // При загрузке страницы, остальные селекты будут пустыми
        populateSelect(eventSelect, [], 'Select an event');
        populateSelect(categorySelect, [], 'Select a category');
    }

     function populateLanguages() {
         // Здесь можно было бы фильтровать по выбранной стране/событию,
         // но в ТЗ указано, что языки из фиксированного списка.
         // В MVP пока просто заполним всеми доступными.
         // В будущем: возможно, бэкенд будет возвращать только актуальные для связки Страна-Событие языки.
         populateSelect(languageSelect, allLanguages.sort(), 'Select a language');
     }

    // Function to populate text styles
    function populateTextStyles() {
        const styles = Object.keys(textStyles);
        populateSelect(styleSelect, styles, 'Select a style');
    }

    // New function to populate message focus options
    function populateMessageFocus() {
        populateSelect(messageFocusSelect, ["Holiday", "Functional Advantage"], 'Select message focus');
    }

    // New function to populate functional advantages
    function populateFunctionalAdvantages() {
        const advantages = Object.keys(functionalAdvantages).sort();
        populateSelect(functionalAdvantageSelect, advantages, 'Select functional advantage');
    }

    // ====== ОБРАБОТЧИКИ ИЗМЕНЕНИЙ СЕЛЕКТОВ ======

    messageFocusSelect.addEventListener('change', () => {
        const selectedFocus = messageFocusSelect.value;
        eventSelect.value = "";
        functionalAdvantageSelect.value = "";
        categorySelect.value = "";

        // Get groups
        const eventGroup = document.getElementById('event-group');
        const advantageGroup = document.getElementById('functional-advantage-group');

        if (selectedFocus === "Holiday") {
            // Show event select, hide functional advantage select
            eventGroup.style.display = 'block';
            advantageGroup.style.display = 'none';
            // Enable and require eventSelect
            eventSelect.required = true;
            eventSelect.disabled = false;
            // Disable functionalAdvantageSelect
            functionalAdvantageSelect.required = false;
            functionalAdvantageSelect.disabled = true;
            // If country is selected, populate events
            if (countrySelect.value) {
                const relevantEvents = countrySelect.value === "All geo" 
                    ? mockData 
                    : mockData.filter(item => item.countries.includes(countrySelect.value));
                const eventNames = ["No holiday", ...relevantEvents.map(item => item.name)].sort();
                populateSelect(eventSelect, eventNames, 'Select an event');
            }
        } else if (selectedFocus === "Functional Advantage") {
            // Hide event select, show functional advantage select
            eventGroup.style.display = 'none';
            advantageGroup.style.display = 'block';
            // Disable eventSelect
            eventSelect.required = false;
            eventSelect.disabled = true;
            // Enable and require functionalAdvantageSelect
            functionalAdvantageSelect.required = true;
            functionalAdvantageSelect.disabled = false;
            populateFunctionalAdvantages();
        } else {
            // Hide both and disable
            eventGroup.style.display = 'none';
            advantageGroup.style.display = 'none';
            eventSelect.required = false;
            eventSelect.disabled = true;
            // Hide both if nothing selected
            document.getElementById('event-group').style.display = 'none';
            document.getElementById('functional-advantage-group').style.display = 'none';
        }
    });

    countrySelect.addEventListener('change', () => {
        const selectedCountry = countrySelect.value;
        const selectedFocus = messageFocusSelect.value;
        
        eventSelect.value = "";
        categorySelect.value = "";

        if (selectedCountry && selectedFocus === "Holiday") {
            const relevantEvents = selectedCountry === "All geo" 
                ? mockData 
                : mockData.filter(item => item.countries.includes(selectedCountry));
            const eventNames = ["No holiday", ...relevantEvents.map(item => item.name)].sort();
            populateSelect(eventSelect, eventNames, 'Select an event');
            populateSelect(categorySelect, [], 'Select a category');
        } else {
            populateSelect(eventSelect, [], 'Select an event');
            populateSelect(categorySelect, [], 'Select a category');
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
                populateSelect(categorySelect, categories, 'Select a category');
            } else {
                // Если событие не найдено (чего в мок-данных быть не должно), очищаем категории
                populateSelect(categorySelect, [], 'Select a category');
            }
        } else {
            // Если страна или событие не выбраны, очищаем и деактивируем категории
            populateSelect(categorySelect, [], 'Select a category');
        }
    });

    // ====== ФУНКЦИЯ ОБНОВЛЕНИЯ ВРЕМЕНИ И ДАТЫ ======
    function updateLockScreenDateTime() {
        const now = new Date();
        // Форматируем время для iOS (ЧЧ:ММ)
        const hours = now.getHours().toString().padStart(2, '0');  
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = hours + ':' + minutes;

        // Форматируем дату для iOS (День недели, Число Месяц)
        const locale = navigator.language || 'en-US';
        const iosDateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        const dateString = now.toLocaleDateString(locale, iosDateOptions);

        // Обновляем дату и время iPhone
        lockscreenTimeElem.textContent = timeString;
        lockscreenDateElem.textContent = dateString;
    }

    // Initial call and setup sample notification if in development mode
    updateLockScreenDateTime();
    if (isDevelopment) {
        // Show sample notification immediately
        iosTitleElem.textContent = sampleNotification.title;
        iosBodyElem.textContent = sampleNotification.text;
        titleCountDisplay.textContent = sampleNotification.title.length;
        textCountDisplay.textContent = sampleNotification.text.length;
        emptyStateDiv.style.display = 'none';
        resultContentDiv.classList.add('show');
    }

    // ====== ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ ======
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (isDevelopment) {
            // В режиме разработки просто показываем тестовое уведомление
            updateLockScreenDateTime();
            iosTitleElem.textContent = sampleNotification.title;
            iosBodyElem.textContent = sampleNotification.text;
            titleCountDisplay.textContent = sampleNotification.title.length;
            textCountDisplay.textContent = sampleNotification.text.length;
            emptyStateDiv.style.display = 'none';
            resultContentDiv.classList.add('show');
            return;
        }

        // Production code continues here...
        updateLockScreenDateTime();
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        resultsDiv.classList.remove('error');
        emptyStateDiv.style.display = 'none';
        resultContentDiv.classList.remove('show');

        const formData = {
            country: countrySelect.value,
            language: languageSelect.value,
            message_focus: messageFocusSelect.value,
            event: eventSelect.value,
            functional_advantage: functionalAdvantageSelect.value,
            category: categorySelect.value,
            style: styleSelect.value,
            use_emojis: useEmojisCheckbox.checked
        };

        try {
            const response = await fetch('http://localhost:5001/generate-push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    iosTitleElem.textContent = result.title;
                    iosBodyElem.textContent = result.text;
                    titleCountDisplay.textContent = result.title.length;
                    textCountDisplay.textContent = result.text.length;
                    emptyStateDiv.style.display = 'none';
                    resultContentDiv.classList.add('show');
                } else {
                    resultsDiv.classList.add('error');
                    emptyStateDiv.style.display = 'block';
                    resultContentDiv.classList.remove('show');
                    alert('Error generating push notification. Check console for details.');
                }
            } else {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                resultsDiv.classList.add('error');
                emptyStateDiv.style.display = 'block';
                resultContentDiv.classList.remove('show');
                alert('Server error occurred. Check console for details.');
            }
        } catch (error) {
            console.error('Connection error:', error);
            resultsDiv.classList.add('error');
            emptyStateDiv.style.display = 'block';
            resultContentDiv.classList.remove('show');
            alert('Could not connect to server. Make sure the backend is running.');
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });

    // ====== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ======
    populateCountries();
    populateLanguages();
    populateMessageFocus();
    populateTextStyles();
});