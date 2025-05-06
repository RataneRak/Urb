from typing import List
from src.core.entities import Task, User
from src.core.interfaces import TaskRepositoryInterface

class Repository:
    def __init__(self, database):
        self.database = database

    def add(self, entity):
        raise NotImplementedError("This method should be overridden by subclasses.")

    def get(self, entity_id):
        raise NotImplementedError("This method should be overridden by subclasses.")

    def update(self, entity):
        raise NotImplementedError("This method should be overridden by subclasses.")

    def delete(self, entity_id):
        raise NotImplementedError("This method should be overridden by subclasses.")


class UserRepository:
    def __init__(self, database):
        self.database = database
        self.users = []
        self.current_id = 1

    def create(self, user_data):
        user = User(id=self.current_id, **user_data)
        self.current_id += 1
        self.users.append(user)
        return user


class InMemoryTaskRepository(TaskRepositoryInterface):
    def __init__(self):
        self.tasks = []
        self.current_id = 1

    def add_task(self, task: Task) -> None:
        task.id = self.current_id
        self.current_id += 1
        self.tasks.append(task)

    def list_tasks(self) -> List[Task]:
        return self.tasks

    def mark_task_completed(self, task_id: int) -> None:
        for task in self.tasks:
            if task.id == task_id:
                task.mark_completed()
                return
        raise ValueError(f"Task with ID {task_id} not found.")

    def delete_task(self, task_id: int) -> None:
        self.tasks = [task for task in self.tasks if task.id != task_id]