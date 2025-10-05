import google.generativeai as genai
from flask import current_app

def get_gemini_response(prompt):
    api_key = current_app.config["GEMINI_API_KEY"]
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text