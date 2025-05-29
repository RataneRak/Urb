from typing import List
from domain.task_entity import Task

class InMemoryTaskRepository:
    def __init__(self):
        self.tasks: List[Task] = []

    def save(self, task: Task):
        self.tasks.append(task)

    def list(self):
        return self.tasks