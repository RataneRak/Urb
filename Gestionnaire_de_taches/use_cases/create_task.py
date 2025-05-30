
from domain.task import Task

class CreateTaskUseCase:
    def __init__(self, repository):
        self.repository = repository

    def execute(self, title: str):
        task = Task(title=title)
        self.repository.save(task)
        return task