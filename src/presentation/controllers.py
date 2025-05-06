from flask import Flask, request, jsonify
from src.core.use_cases import TaskUseCases

class TaskController:
    def __init__(self, use_cases: TaskUseCases):
        self.use_cases = use_cases

    def add_task(self, title: str, description: str):
        self.use_cases.add_task(title, description)

    def list_tasks(self):
        return self.use_cases.list_tasks()

    def mark_task_completed(self, task_id: int):
        self.use_cases.mark_task_completed(task_id)

    def delete_task(self, task_id: int):
        self.use_cases.delete_task(task_id)

app = Flask(__name__)

@app.route('/some-endpoint', methods=['POST'])
def some_endpoint():
    controller = Controller()
    return controller.handle_request()

if __name__ == '__main__':
    app.run(debug=True)