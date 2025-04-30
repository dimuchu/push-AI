from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()

# Инициализация Flask приложения
app = Flask(__name__)
CORS(app)  # Включаем CORS для возможности делать запросы с другого домена

# Создаем клиент OpenAI с минимальными параметрами
api_key = os.getenv("OPENAI_API_KEY")
if not api_key or api_key == "your_openai_api_key_here":
    print("ВНИМАНИЕ: API ключ OpenAI не найден или имеет значение по умолчанию.")
    print("Установите правильный API ключ в файле .env")
    # Не прерываем работу, чтобы можно было проверить другие ошибки
    client = None
else:
    client = OpenAI(api_key=api_key)

# Загружаем данные из JSON файла
def load_events_data():
    with open('events_data.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# Добавляем маршрут для проверки работы сервера
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "ok",
        "message": "Flask API для генерации push-уведомлений работает",
        "openai_api_status": "настроен" if client else "не настроен"
    })

@app.route('/generate-push', methods=['POST'])
def generate_push():
    try:
        # Проверяем, инициализирован ли клиент OpenAI
        if client is None:
            return jsonify({
                "error": "OpenAI API ключ не настроен. Необходимо указать действительный API ключ в файле .env"
            }), 500
        
        # Получаем данные из запроса
        data = request.json
        
        country = data.get('country')
        language = data.get('language')
        event_name = data.get('eventName')
        category = data.get('category')
        style = data.get('style')
        use_emojis = data.get('useEmojis', False)
        
        # Проверяем наличие всех необходимых данных
        if not all([country, language, event_name, category, style]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Загружаем данные о событиях
        events_data = load_events_data()
        
        # Находим выбранное событие
        selected_event = None
        for event in events_data:
            if event["name"] == event_name and country in event["countries"]:
                selected_event = event
                break
        
        if not selected_event:
            return jsonify({"error": f"Event '{event_name}' not found for country '{country}'"}), 404
        
        # Собираем данные для промпта
        insights = [insight["description"] for insight in selected_event.get("insights", [])]
        
        # Фильтруем предложения, относящиеся к выбранной категории
        offers = []
        for offer in selected_event.get("offers", []):
            offer_categories = offer.get("categories", [])
            if not offer_categories or category in offer_categories or "all" in offer_categories:
                offers.append(offer["description"])
        
        # Собираем преимущества сервиса
        advantages = [adv["description"] for adv in selected_event.get("service_advantages", [])]
        
        # Находим релевантные коллекции
        collections = []
        for collection in selected_event.get("collections", []):
            collection_categories = collection.get("categories", [])
            if not collection_categories or category in collection_categories or "all" in collection_categories:
                collections.append(collection["name"])
        
        # Формируем промпт для OpenAI
        emoji_instruction = "Use appropriate emojis in both title and text." if use_emojis else "Do not use emojis."
        
        prompt = f"""Generate a push notification in {language} language for {event_name} in {country} about {category}.
Style should be {style}. {emoji_instruction}
The push notification should have:
1. A title (max 30 characters)
2. A text body (max 100 characters)

Event insights: {', '.join(insights) if insights else 'N/A'}
Special offers: {', '.join(offers) if offers else 'N/A'}
Service advantages: {', '.join(advantages) if advantages else 'N/A'}
Related collections: {', '.join(collections) if collections else 'N/A'}

Format the response as:
Title: [your generated title]
Text: [your generated text]
"""
        
        # Вызываем OpenAI API для генерации текста
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a marketing specialist creating push notifications."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        # Парсим ответ от OpenAI
        generated_text = response.choices[0].message.content.strip()
        
        # Извлекаем заголовок и текст
        title = ""
        text = ""
        
        for line in generated_text.split("\n"):
            if line.startswith("Title:"):
                title = line[6:].strip()
            elif line.startswith("Text:"):
                text = line[5:].strip()
        
        # Обрезаем до нужной длины
        title = title[:30]
        text = text[:100]
        
        return jsonify({
            "title": title,
            "text": text
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 