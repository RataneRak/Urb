from fastapi import FastAPI
from interface.routes.task_routes import router as task_router

app = FastAPI(title="Gestionnaire de Tâches")

app.include_router(task_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

