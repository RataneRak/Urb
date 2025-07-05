from src.app_config import create_app
from src.routes import register_routes

app = create_app()
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 