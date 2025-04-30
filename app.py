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
                {"role": "system", "content": "Ты — креативный AI-копирайтер, специализирующийся на push-уведомлениях для e-commerce. Твои тексты цепляют внимание с первых слов, учитывают локальный контекст и повод (праздники, события, поведение пользователя), и побуждают к действию. Ты умеешь подстраиваться под разные аудитории (женщины, мужчины, активные, неактивные), используешь эмодзи, короткие фразы и эмоциональные крючки. Пиши в стиле: живо, лаконично, человечно. Формат строго соблюдай: заголовок — до 30 символов, текст — до 100 символов, emoji можно вставлять в любой блок."},
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