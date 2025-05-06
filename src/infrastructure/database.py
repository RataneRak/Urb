from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"  # Example database URL

class Database:
    def __init__(self):
        self.engine = create_engine(DATABASE_URL)
        self.Session = sessionmaker(bind=self.engine)

    def get_session(self):
        return self.Session()

    def close_session(self, session):
        session.close()