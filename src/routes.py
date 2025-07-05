from flask import request, jsonify, render_template
from .app_config import db
from .models import User, Task
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

def register_routes(app):
    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Cet email est déjà utilisé.'}), 409
        new_user = User(email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Utilisateur créé avec succès.'}), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=str(user.id))
            return jsonify(access_token=access_token)
        return jsonify({'error': 'Email ou mot de passe incorrect.'}), 401

    @app.route('/api/tasks', methods=['GET'])
    @jwt_required()
    def get_tasks():
        current_user_id = int(get_jwt_identity())
        tasks = Task.query.filter_by(user_id=current_user_id).all()
        return jsonify([task.serialize() for task in tasks])

    @app.route('/api/tasks', methods=['POST'])
    @jwt_required()
    def add_task():
        current_user_id = int(get_jwt_identity())
        data = request.json
        new_task = Task(
            title=data['title'],
            description=data.get('description'),
            priority=data.get('priority', 'normale'),
            category=data.get('category'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
            user_id=current_user_id
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.serialize()), 201

    @app.route('/api/tasks/<int:task_id>', methods=['PUT'])
    @jwt_required()
    def update_task(task_id):
        current_user_id = int(get_jwt_identity())
        task = Task.query.filter_by(id=task_id, user_id=current_user_id).first_or_404()
        data = request.json
        
        # Mettre à jour les champs fournis
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'priority' in data:
            task.priority = data['priority']
        if 'category' in data:
            task.category = data['category']
        if 'due_date' in data and data['due_date']:
            task.due_date = datetime.fromisoformat(data['due_date'])
        
        db.session.commit()
        return jsonify(task.serialize())

    @app.route('/api/tasks/<int:task_id>/complete', methods=['POST'])
    @jwt_required()
    def complete_task(task_id):
        current_user_id = int(get_jwt_identity())
        task = Task.query.filter_by(id=task_id, user_id=current_user_id).first_or_404()
        task.completed = True
        task.completed_at = datetime.utcnow()
        db.session.commit()
        return jsonify(task.serialize())

    @app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
    @jwt_required()
    def delete_task(task_id):
        current_user_id = int(get_jwt_identity())
        task = Task.query.filter_by(id=task_id, user_id=current_user_id).first_or_404()
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Tâche supprimée.'}) 

    @app.route('/api/me', methods=['GET'])
    @jwt_required()
    def get_me():
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        return jsonify({'email': user.email}) 