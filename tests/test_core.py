import unittest
from src.core.entities import Task
from src.core.use_cases import TaskUseCases
from src.infrastructure.repositories import InMemoryTaskRepository

class TestTaskUseCases(unittest.TestCase):
    def setUp(self):
        self.repository = InMemoryTaskRepository()
        self.use_cases = TaskUseCases(self.repository)

    def test_add_task(self):
        self.use_cases.add_task("Test Task", "Description")
        tasks = self.use_cases.list_tasks()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].title, "Test Task")

    def test_mark_task_completed(self):
        self.use_cases.add_task("Test Task", "Description")
        task = self.use_cases.list_tasks()[0]
        self.use_cases.mark_task_completed(task.id)
        self.assertTrue(task.completed)

class TestTaskEntity(unittest.TestCase):
    def test_task_creation(self):
        task = Task(id=1, title="Test Task", description="Description")
        self.assertEqual(task.title, "Test Task")
        self.assertFalse(task.completed)

    def test_mark_task_completed(self):
        task = Task(id=1, title="Test Task")
        task.mark_completed()
        self.assertTrue(task.completed)

if __name__ == "__main__":
    unittest.main()