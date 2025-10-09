# 🥗 Nutrition Tracker

**Nutrition Tracker** is a full-stack web application that helps users analyze meal nutrition by scanning food labels.  
It uses **Tesseract OCR** to extract data from nutrition labels and a **Flask** backend to process and analyze the information.  
The frontend is built with **React**, providing a clean and interactive interface for users to upload, view, and explore nutritional insights.

---

## 🚀 Features

- 📸 **OCR Scanning** – Upload a photo of a nutrition label and extract text automatically using Tesseract.
- 🧠 **Smart Analysis** – Parse calories,  and claculates macronutrients, and micronutrients from text for structured display.
- 💾 **Backend API** – Flask backend processes OCR data and handles business logic.
- 🌐 **Interactive Frontend** – React UI for uploading images, displaying results, and managing analysis history.
- ⚡ **Real-time Feedback** – See nutritional summaries instantly after label upload.

---

## 🧩 Tech Stack

### Frontend
- **React (TypeScript)**
  - **React Router**
  - **Tanstack Query**
  - **Recharts**

### Backend
- **Flask (Python)**
- **Tesseract OCR (pytesseract)** for text recognition
- **Flask-SQLAlchemy**
- **PostgreSQL**
- **Google Gemini** to provide users with feedback about their intake

## ⚙️ Installation & Setup

### Backend Setup (Flask)
```bash
cd flask-backend
python -m venv venv
source venv/bin/activate      # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt
flask run
```

> The backend will start at **http://localhost:5000**

---

### Frontend Setup (React)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

---

### Connect Frontend ↔ Backend

The frontend sends API requests to:
```
http://localhost:5000/api/
```

---

## 🧠 How It Works

1. User uploads an image of a food label.  
2. The image is sent to the Flask API.  
3. Flask uses **pytesseract** to extract text from the image.  
4. Extracted data is parsed into structured nutritional info (calories, fat, protein, etc.).  
5. The frontend displays an easy-to-read summary.


