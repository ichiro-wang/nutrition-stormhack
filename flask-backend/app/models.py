from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()
JSON = db.JSON

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)    # Profile information
    name = db.Column(db.String(150), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=True)
    weight = db.Column(db.Float, nullable=True) # in kg
    height = db.Column(db.Float, nullable=True) # in cm
    gender = db.Column(db.String(1), nullable=True) # 'M' or 'F'
    activity_level = db.Column(db.String(50), nullable=True) # e.g., 'Sedentary'

    # Calculated values
    rec_Calories = db.Column(db.Float, nullable=True) # Total Daily Energy Expenditure
    rec

    def to_dict(self):
        """Serializes the user object to a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'weight': self.weight,
            'height': self.height,
            'gender': self.gender,
            'activity_level': self.activity_level,
            'Recommend Calories': self.rec_Calories
        }
    
    def get_id(self):
        return self.name

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def __repr__(self):
        return f'<Post {self.title}>'

class NutritionLabel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    food_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    nutrition_data = db.Column(JSON, nullable=False) # Stores calculated totals
    date_logged = db.Column(db.DateTime, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)

    user = db.relationship('User', backref=db.backref('nutrition_labels', lazy=True, cascade="all, delete-orphan"))

    def __repr__(self):
        return f'<NutritionLabel {self.food_name} for user {self.user_id}>'

    def to_dict(self):
        """Serializes the nutrition label object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'food_name': self.food_name,
            'quantity': self.quantity,
            'nutrition_data': self.nutrition_data,
            'date_logged': self.date_logged.isoformat(),
            'image_url': self.image_url
        }