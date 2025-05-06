# Clean Code Python Project

This project is structured to follow the principles of Clean Code and is organized into distinct layers: Core, Infrastructure, and Presentation. Each layer has its own responsibilities, promoting separation of concerns and maintainability.

## Project Structure

```
clean-code-python-project
├── src
│   ├── __init__.py
│   ├── main.py
│   ├── core
│   │   ├── __init__.py
│   │   ├── entities.py
│   │   ├── interfaces.py
│   │   └── use_cases.py
│   ├── infrastructure
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── repositories.py
│   └── presentation
│       ├── __init__.py
│       ├── controllers.py
│       └── views.py
├── tests
│   ├── __init__.py
│   ├── test_core.py
│   ├── test_infrastructure.py
│   └── test_presentation.py
├── requirements.txt
├── .gitignore
└── README.md
```

## Getting Started

To set up the project, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd clean-code-python-project
   ```

2. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```
   python src/main.py
   ```

## Testing

To run the tests, use the following command:

```
pytest tests/
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.