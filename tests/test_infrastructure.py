import unittest
from src.infrastructure.repositories import UserRepository
from src.infrastructure.database import Database
from src.core.entities import User

class TestUserRepository(unittest.TestCase):
    def setUp(self):
        self.database = Database()
        self.user_repository = UserRepository(self.database)

    def test_create_user(self):
        user_data = {'username': 'John Doe', 'email': 'john@example.com'}
        user = self.user_repository.create(user_data)
        self.assertIsNotNone(user.id)
        self.assertEqual(user.username, user_data['username'])
        self.assertEqual(user.email, user_data['email'])

if __name__ == "__main__":
    unittest.main()