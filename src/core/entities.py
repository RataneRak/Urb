from dataclasses import dataclass
from typing import Optional

class Entity:
    def __init__(self, id: int):
        self.id = id

class User(Entity):
    def __init__(self, id: int, username: str, email: str):
        super().__init__(id)
        self.username = username
        self.email = email

class Product(Entity):
    def __init__(self, id: int, name: str, price: float):
        super().__init__(id)
        self.name = name
        self.price = price

class Order(Entity):
    def __init__(self, id: int, user: User, products: list):
        super().__init__(id)
        self.user = user
        self.products = products

    def total_price(self):
        return sum(product.price for product in self.products)

class YourEntity:
    def __init__(self, name: str, value: int):
        self.name = name
        self.value = value

    def __repr__(self):
        return f"YourEntity(name={self.name}, value={self.value})"

@dataclass
class Task:
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False

    def mark_completed(self):
        self.completed = True