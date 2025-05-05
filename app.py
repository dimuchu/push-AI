from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
import openai
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()

# Инициализация Flask приложения
app = Flask(__name__)
CORS(app)  # Включаем CORS для возможности делать запросы с другого домена

# Создаем клиент OpenAI с минимальными параметрами
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY in your .env file")

# Initialize OpenAI client
openai.api_key = api_key

# Загружаем данные из JSON файла
def load_events_data():
    with open('events_data.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# Добавляем маршрут для проверки работы сервера
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        event_id = data.get('event_id')
        
        if not event_id:
            return jsonify({'error': 'No event ID provided'}), 400
            
        # Find the event in our data
        events_data = load_events_data()
        event = next((e for e in events_data if e['id'] == event_id), None)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
            
        # Prepare the prompt for GPT
        prompt = f"""
        Проанализируй следующее событие и дай рекомендации по улучшению:
        
        Название: {event['title']}
        Описание: {event['description']}
        Дата: {event['date']}
        Место: {event['location']}
        
        Пожалуйста, дай:
        1. Краткий анализ сильных и слабых сторон мероприятия
        2. Конкретные рекомендации по улучшению
        3. Предложения по привлечению большего количества участников
        """
        
        # Get response from GPT
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a creative AI copywriter specialized in push notifications for e-commerce. Your job is to craft catchy, concise, and locally relevant push messages that drive clicks and prompt action. You always consider the context: country, language, event, product category, user behavior (if provided). Your message must align with the core focus — whether it's a holiday, a promotional offer, or a functional benefit of the service. You adapt your tone based on the target audience (female/male, new/returning, active/inactive) and stick to a lively, human, emotionally engaging writing style — unless told otherwise.\n\nFollow this strict format: the **title** must be no longer than 30 characters (including emoji), and the **body text** must not exceed 100 characters (also including emoji). Emojis are allowed in both blocks, but only when they strengthen the message — don't overuse them. Mention promo codes or offers briefly if they are provided. If the message is tied to a holiday, highlight the emotion or celebration. If the focus is on a functional benefit (e.g. fast delivery), emphasize why it's valuable for the customer. Avoid clichés like \"best quality at the best price\" and don't start messages with formal openings like \"Dear customer\" — this is not email.\n\nUse short, sharp, emotional hooks in the title, and deliver quick value or action in the body text. Your writing must be clear, personal, and never robotic. Do not invent details beyond the input data. Think like a smart marketer with a sense of humor, empathy, and urgency."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract the analysis from the response
        analysis = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 