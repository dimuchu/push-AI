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

@app.route('/generate-push', methods=['POST'])
def generate_push():
    try:
        data = request.json
        country = data.get('country')
        language = data.get('language')
        message_focus = data.get('message_focus')
        event = data.get('event')
        functional_advantage = data.get('functional_advantage')
        category = data.get('category')
        style = data.get('style')
        use_emojis = data.get('use_emojis', False)

        # Validate required fields
        if not all([country, language, message_focus, style]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Load events data if needed
        events_data = load_events_data()
        
        # Prepare context based on message focus
        context = {
            'country': country,
            'language': language,
            'category': category,
            'style': style,
            'use_emojis': use_emojis
        }

        if message_focus == "Holiday" and event != "No holiday":
            event_data = next((e for e in events_data if e['name'] == event), None)
            if event_data:
                context.update({
                    'event_name': event_data['name'],
                    'event_date': event_data['date'],
                    'offers': event_data.get('offers', []),
                    'insights': event_data.get('insights', [])
                })
        elif message_focus == "Functional Advantage" and functional_advantage:
            context['functional_advantage'] = functional_advantage

        # Prepare the prompt for GPT
        prompt = f"""
Generate a push notification with the following context:

Country: {context['country']}
Language: {context['language']}
Style: {context['style']}
Message Focus: {message_focus}
{"Event: " + context.get('event_name', '') if message_focus == "Holiday" and event != "No holiday" else ""}
{"Functional Advantage: " + context['functional_advantage'] if message_focus == "Functional Advantage" else ""}
Category: {context.get('category', 'all')}
Use Emojis: {'Yes' if context['use_emojis'] else 'No'}

Additional context:
{json.dumps(context, indent=2)}

Please generate a push notification that follows the style guidelines and includes both a title and body text.
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
        
        # Extract the generated push notification
        generated_text = response.choices[0].message.content
        
        # Parse the response to extract title and body
        # This is a simple implementation - you might want to make it more robust
        lines = generated_text.strip().split('\n')
        title = body = ""
        for line in lines:
            if line.lower().startswith('title:'):
                title = line.split(':', 1)[1].strip()
            elif line.lower().startswith('body:'):
                body = line.split(':', 1)[1].strip()

        return jsonify({
            'success': True,
            'title': title,
            'text': body
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 