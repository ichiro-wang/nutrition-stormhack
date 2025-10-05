import os

class Config:
    SECRET_KEY = 'your_secret_key_here'
    SQLALCHEMY_DATABASE_URI = 'postgresql://neondb_owner:npg_kvKnxM7DN6ie@ep-floral-scene-adyw3pzr-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300
    }
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBK_Dp5PQXojAbO5ktW9JgzWNgyQ5-Yt6M")
    DEBUG = True

    @staticmethod
    def init_app(app):
        pass