class Task:
    def __init__(self, id, title, completed=False):
        self.id = id
        self.title = title
        self.completed = completed

    def mark_complete(self):
        self.completed = True
