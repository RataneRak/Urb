class TaskRepository:
    def __init__(self, orm):
        self.orm = orm

    def create(self, title):
        task = self.orm.create_task(title)
        return task