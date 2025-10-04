from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # Profile information
    age = db.Column(db.Integer, nullable=True)
    weight = db.Column(db.Float, nullable=True) # in kg
    height = db.Column(db.Float, nullable=True) # in cm
    gender = db.Column(db.String(1), nullable=True) # 'M' or 'F'
    activity_level = db.Column(db.String(50), nullable=True) # e.g., 'Sedentary'

    # Calculated values
    tdee = db.Column(db.Float, nullable=True) # Total Daily Energy Expenditure

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        """Serializes the user object to a dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'age': self.age,
            'weight': self.weight,
            'height': self.height,
            'gender': self.gender,
            'activity_level': self.activity_level,
            'tdee': self.tdee
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def __repr__(self):
        return f'<Post {self.title}>'