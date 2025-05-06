import unittest
from src.presentation.controllers import TaskController
from src.core.use_cases import TaskUseCases
from src.infrastructure.repositories import InMemoryTaskRepository

class TestTaskController(unittest.TestCase):
    def setUp(self):
        self.repository = InMemoryTaskRepository()
        self.use_cases = TaskUseCases(self.repository)
        self.controller = TaskController(self.use_cases)

    def test_add_task(self):
        self.controller.add_task("Test Task", "Description")
        tasks = self.controller.list_tasks()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].title, "Test Task")

    def test_mark_task_completed(self):
        self.controller.add_task("Test Task", "Description")
        task = self.controller.list_tasks()[0]
        self.controller.mark_task_completed(task.id)
        self.assertTrue(task.completed)

if __name__ == "__main__":
    unittest.main()