from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()

# Инициализация Flask приложения
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Включаем CORS для возможности делать запросы с любого домена

# Создаем клиент OpenAI с минимальными параметрами
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY in your .env file")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Загружаем данные из JSON файла
def load_events_data():
    with open('events_data.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# Добавляем маршрут для проверки работы сервера
@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')

# Маршруты для статических файлов
@app.route('/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)

@app.route('/generate-push', methods=['POST'])
def generate_push():
    try:
        print("Received request data:", request.json)  # Debug print
        data = request.json
        country = data.get('country')
        language = data.get('language')
        message_focus = data.get('message_focus')
        event = data.get('event')
        functional_advantage = data.get('functional_advantage')
        category = data.get('category')
        style = data.get('style')
        use_emojis = data.get('use_emojis', False)

        print(f"Parsed parameters: country={country}, language={language}, message_focus={message_focus}, style={style}")  # Debug print

        # Validate required fields
        if not all([country, language, message_focus, style]):
            print("Missing required fields")  # Debug print
            return jsonify({'error': 'Missing required fields'}), 400

        # Load events data if needed
        events_data = load_events_data()
        print("Loaded events data")  # Debug print
        
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
Your response MUST follow this exact format:

Title: [your title here]
Body: [your body text here]

Example response:
Title: Fast Delivery Today! 🚚
Body: Get your order within 2 hours in any city. Order now and enjoy express shipping!

Remember:
- Title must be no longer than 30 characters
- Body text must not exceed 100 characters
- Use the specified language ({context['language']})
- Match the specified style ({context['style']})
"""

        # Get response from GPT
        print("\n=== Sending request to OpenAI ===")
        print("Prompt:", prompt)
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": """You are a creative AI copywriter specialized in push notifications for e-commerce. Your task is to generate push notifications in the exact format specified:

Title: [title text]
Body: [body text]

Rules:
1. ALWAYS use this exact format with "Title:" and "Body:" prefixes
2. Title must be no longer than 30 characters (including emoji)
3. Body text must not exceed 100 characters (including emoji)
4. Write in the requested language
5. Match the requested style
6. Be concise and action-oriented
7. Do not use generic phrases like "best quality" or "Dear customer"
8. Make the message personal and emotionally engaging
9. Include emojis only when requested and when they add value
10. Focus on the main benefit or occasion specified in the request"""},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        print("\n=== Received OpenAI Response ===")
        print("Response object:", response)
        print("Response type:", type(response))
        print("Response attributes:", dir(response))
        
        # Extract the generated push notification
        generated_text = response.choices[0].message.content
        print("\n=== Processing Generated Text ===")
        print("Raw text:", repr(generated_text))
        
        # Parse the response to extract title and body
        lines = generated_text.strip().split('\n')
        print("\nSplit lines:", lines)
        title = body = ""
        for line in lines:
            print("\nProcessing line:", repr(line))
            if line.lower().startswith('title:'):
                title = line.split(':', 1)[1].strip()
                print("Found title:", repr(title))
            elif line.lower().startswith('body:'):
                body = line.split(':', 1)[1].strip()
                print("Found body:", repr(body))
            else:
                print("Line doesn't match title or body pattern")

        print("\n=== Final Result ===")
        print(f"Title: {repr(title)}")
        print(f"Body: {repr(body)}")

        return jsonify({
            'success': True,
            'title': title,
            'text': body
        })
        
    except Exception as e:
        print("Error occurred:", str(e))  # Debug print
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port) 