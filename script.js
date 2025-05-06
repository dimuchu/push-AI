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

        if (selectedFocus === "Holiday") {
            // Show event select, hide functional advantage select
            document.getElementById('event-group').style.display = 'block';
            document.getElementById('functional-advantage-group').style.display = 'none';
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
            document.getElementById('event-group').style.display = 'none';
            document.getElementById('functional-advantage-group').style.display = 'block';
            populateFunctionalAdvantages();
        } else {
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


    // ====== ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ ======

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');

        // Собираем данные из формы
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
        console.log('Form data:', formData);

        try {
            console.log('Sending request to server...');
            const response = await fetch('http://localhost:5001/generate-push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            console.log('Got response:', response);

            if (response.ok) {
                const result = await response.json();
                console.log('Response data:', result);
                if (result.success) {
                    console.log('Updating UI with result');
                    // Обновляем UI с полученными данными
                    generatedTitleTextarea.value = result.title;
                    generatedTextTextarea.value = result.text;
                    titleCountSpan.textContent = result.title.length;
                    textCountSpan.textContent = result.text.length;
                    
                    // Показываем результаты и скрываем заглушку
                    document.getElementById('empty-state').style.display = 'none';
                    document.getElementById('result-content').style.display = 'block';
                    console.log('UI updated successfully');
                } else {
                    console.error('Error in generation:', result.error);
                    alert('Error generating push notification. Check console for details.');
                }
            } else {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                alert('Server error occurred. Check console for details.');
            }
        } catch (error) {
            console.error('Connection error:', error);
            alert('Could not connect to server. Make sure the backend is running.');
        }
    });

    // ====== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ======
    populateCountries();
    populateLanguages();
    populateMessageFocus();
    populateTextStyles();
});