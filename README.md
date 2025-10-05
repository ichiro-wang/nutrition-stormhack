# 🥗 Nutrition StormHack

**Nutrition StormHack** is a full-stack web application that helps users analyze meal nutrition by scanning food labels.  
It uses **Tesseract OCR** to extract data from nutrition labels and a **Flask-based backend** to process and analyze the information.  
The frontend is built with **React**, providing a clean and interactive interface for users to upload, view, and explore nutritional insights.

---

## 🚀 Features

- 📸 **OCR Scanning** – Upload a photo of a nutrition label and extract text automatically using Tesseract.
- 🧠 **Smart Analysis** – Parse calories, macronutrients, and micronutrients from text for structured display.
- 💾 **Backend API** – Flask backend processes OCR data and handles business logic.
- 🌐 **Interactive Frontend** – React UI for uploading images, displaying results, and managing analysis history.
- ⚡ **Real-time Feedback** – See nutritional summaries instantly after label upload.

---

## 🧩 Tech Stack

### Frontend
- **React** (via Vite or Create React App)
- **HTML5 / CSS3 / JavaScript (ES6)**
- **Axios** for API requests
- **TailwindCSS** or custom CSS (if included)

### Backend
- **Flask (Python)**
- **Flask-CORS**, **Flask-SQLAlchemy**, **Flask-Migrate**
- **Tesseract OCR (pytesseract)** for text recognition
- **SQLite / PostgreSQL** for data persistence
- **Google Generative AI (optional integration)** for analysis enhancement

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
npm start
```

> The frontend will start at **http://localhost:3000**

---

### Connect Frontend ↔ Backend

The frontend sends API requests to:
```
http://localhost:5000/api/
```
Make sure CORS is enabled in the Flask backend (`Flask-CORS` should be configured).

---

## 🧠 How It Works

1. User uploads an image of a food label via the web interface.  
2. The image is sent to the Flask API.  
3. Flask uses **pytesseract** to extract text from the image.  
4. Extracted data is parsed into structured nutritional info (calories, fat, protein, etc.).  
5. The frontend displays an easy-to-read summary.

---

## 🧪 Example API Endpoint

```http
POST /api/analyze
Content-Type: multipart/form-data

image: <uploaded label image>
```

**Response:**
```json
{
  "calories": 230,
  "fat": 8,
  "protein": 5,
  "carbs": 32
}
