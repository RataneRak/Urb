import sys
import os

# Ajouter le dossier racine au chemin de recherche
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Ajouter le dossier 'src' au chemin de recherche
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from src.infrastructure.repositories import InMemoryTaskRepository
from src.core.use_cases import TaskUseCases
from src.presentation.controllers import TaskController

def main():
    repository = InMemoryTaskRepository()
    use_cases = TaskUseCases(repository)
    controller = TaskController(use_cases)

    while True:
        print("\n1. Ajouter une tâche")
        print("2. Lister les tâches")
        print("3. Marquer une tâche comme terminée")
        print("4. Supprimer une tâche")
        print("5. Quitter")

        choice = input("Choisissez une option : ")
        if choice == "1":
            title = input("Titre de la tâche : ")
            description = input("Description de la tâche : ")
            controller.add_task(title, description)
            print("Tâche ajoutée avec succès.")
        elif choice == "2":
            tasks = controller.list_tasks()
            for task in tasks:
                print(f"{task.id}. {task.title} - {'Terminé' if task.completed else 'En cours'}")
        elif choice == "3":
            task_id = int(input("ID de la tâche à marquer comme terminée : "))
            controller.mark_task_completed(task_id)
            print("Tâche marquée comme terminée.")
        elif choice == "4":
            task_id = int(input("ID de la tâche à supprimer : "))
            controller.delete_task(task_id)
            print("Tâche supprimée.")
        elif choice == "5":
            break
        else:
            print("Option invalide.")

if __name__ == "__main__":
    main()