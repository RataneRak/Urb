from fastapi import APIRouter, Depends
from use_cases.create_task import CreateTaskUseCase
from infrastructure.task_repository import InMemoryTaskRepository
from pydantic import BaseModel

router = APIRouter()

class TaskCreateRequest(BaseModel):
    title: str

repo = InMemoryTaskRepository()
use_case = CreateTaskUseCase(repo)

@router.post("/tasks")
def create_task(request: TaskCreateRequest):
    task = use_case.execute(request.title)
    return {"id": task.id, "title": task.title, "completed": task.completed}

@router.get("/tasks")
def list_tasks():
    return [vars(task) for task in repo.list()]

from fastapi import HTTPException

@router.put("/tasks/{task_id}")
def update_task(task_id: int, request: TaskCreateRequest):
    task = repo.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Met à jour les champs (ajuste selon ton modèle)
    task.title = request.title
    task.completed = request.completed if hasattr(request, "completed") else task.completed
    repo.update(task)  # Tu dois implémenter cette méthode dans ton repo

    return vars(task)

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    task = repo.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    repo.delete(task_id)  # Tu dois implémenter cette méthode dans ton repo
    return {"message": "Task deleted"}

