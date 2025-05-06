from abc import ABC, abstractmethod
from typing import List
from .entities import Task

class RepositoryInterface(ABC):
    @abstractmethod
    def add(self, entity):
        pass

    @abstractmethod
    def get(self, entity_id):
        pass

    @abstractmethod
    def update(self, entity):
        pass

    @abstractmethod
    def delete(self, entity_id):
        pass

class UseCaseInterface(ABC):
    @abstractmethod
    def execute(self, *args, **kwargs):
        pass

class TaskRepositoryInterface(ABC):
    @abstractmethod
    def add_task(self, task: Task) -> None:
        pass

    @abstractmethod
    def list_tasks(self) -> List[Task]:
        pass

    @abstractmethod
    def mark_task_completed(self, task_id: int) -> None:
        pass

    @abstractmethod
    def delete_task(self, task_id: int) -> None:
        pass