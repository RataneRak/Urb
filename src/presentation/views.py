import sys
import os

# Ajouter le dossier racine au chemin de recherche
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from flask import Flask, request, jsonify, render_template, redirect
from src.infrastructure.repositories import InMemoryTaskRepository
from src.core.use_cases import TaskUseCases
from src.presentation.controllers import TaskController

app = Flask(__name__)

# Initialisation des couches
repository = InMemoryTaskRepository()
use_cases = TaskUseCases(repository)
controller = TaskController(use_cases)

@app.route('/tasks', methods=['GET'])
def list_tasks():
    tasks = controller.list_tasks()
    return jsonify([task.__dict__ for task in tasks])

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    controller.add_task(data['title'], data.get('description', ''))
    return jsonify({"message": "Task added successfully"}), 201

@app.route('/tasks/<int:task_id>/complete', methods=['PATCH'])
def mark_task_completed(task_id):
    try:
        controller.mark_task_completed(task_id)
        return jsonify({"message": "Task marked as completed"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    controller.delete_task(task_id)
    return jsonify({"message": "Task deleted successfully"}), 200

@app.route('/some_view', methods=['GET'])
def some_view_function():
    data = SomeController.get_data()
    return render_template('template.html', data=data)

@app.route('/another_view', methods=['GET', 'POST'])
def another_view_function():
    if request.method == 'POST':
        form_data = request.form
        SomeController.process_form(form_data)
        return redirect('/success')
    return render_template('form_template.html')

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Réponse vide avec un code HTTP 204 (No Content)

if __name__ == '__main__':
    app.run(debug=True)