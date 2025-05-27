class CreateTask:
    def __init__(self, task_repository):
        self.task_repository = task_repository

    def execute(self, title):
        new_task = self.task_repository.create(title)
        return new_task