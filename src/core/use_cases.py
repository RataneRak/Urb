from abc import ABC, abstractmethod
from typing import List
from .entities import Task
from .interfaces import TaskRepositoryInterface

class UseCase(ABC):
    @abstractmethod
    def execute(self, *args, **kwargs):
        pass

class ExampleUseCase(UseCase):
    def __init__(self, repository):
        self.repository = repository

    def execute(self, data):
        # Business logic goes here
        result = self.repository.get_data(data)
        # Additional processing can be done here
        return result

# Add more use case implementations as needed

class TaskUseCases:
    def __init__(self, repository: TaskRepositoryInterface):
        self.repository = repository

    def add_task(self, title: str, description: str) -> None:
        task = Task(id=0, title=title, description=description)
        self.repository.add_task(task)

    def list_tasks(self) -> List[Task]:
        return self.repository.list_tasks()

    def mark_task_completed(self, task_id: int) -> None:
        self.repository.mark_task_completed(task_id)

    def delete_task(self, task_id: int) -> None:
        self.repository.delete_task(task_id)
