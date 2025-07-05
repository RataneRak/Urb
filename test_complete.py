#!/usr/bin/env python3
"""
Script de test complet pour vérifier toutes les fonctionnalités
"""

import requests
import json
import random
import time

BASE_URL = "http://localhost:5000"

def test_complete_workflow():
    """Test complet du workflow"""
    print("🧪 Test complet du workflow")
    print("=" * 50)
    
    # 1. Inscription
    random_num = random.randint(1000, 9999)
    email = f"user{random_num}@example.com"
    
    print(f"1. Inscription avec {email}")
    register_data = {"email": email, "password": "password123"}
    response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
    
    if response.status_code != 201:
        print(f"❌ Échec inscription: {response.status_code}")
        return False
    print("✅ Inscription réussie")
    
    # 2. Connexion
    print(f"\n2. Connexion avec {email}")
    login_data = {"email": email, "password": "password123"}
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    
    if response.status_code != 200:
        print(f"❌ Échec connexion: {response.status_code}")
        return False
    
    token_data = response.json()
    if "access_token" not in token_data:
        print("❌ Token manquant")
        return False
    
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Connexion réussie")
    
    # 3. Vérifier l'endpoint /api/me
    print("\n3. Test endpoint /api/me")
    response = requests.get(f"{BASE_URL}/api/me", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Échec /api/me: {response.status_code}")
        return False
    
    me_data = response.json()
    if me_data.get("email") != email:
        print(f"❌ Email incorrect: {me_data.get('email')} != {email}")
        return False
    print("✅ /api/me fonctionne")
    
    # 4. Vérifier la liste des tâches (vide au début)
    print("\n4. Vérifier liste des tâches (vide)")
    response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Échec récupération tâches: {response.status_code}")
        return False
    
    tasks = response.json()
    if not isinstance(tasks, list):
        print(f"❌ Format incorrect: {type(tasks)}")
        return False
    
    print(f"✅ Liste des tâches: {len(tasks)} tâche(s)")
    
    # 5. Ajouter une tâche
    print("\n5. Ajouter une tâche")
    task_data = {
        "title": "Tâche de test",
        "description": "Description de test",
        "priority": "haute"
    }
    response = requests.post(f"{BASE_URL}/api/tasks", json=task_data, headers=headers)
    
    if response.status_code != 201:
        print(f"❌ Échec ajout tâche: {response.status_code}")
        return False
    
    new_task = response.json()
    print(f"✅ Tâche ajoutée: {new_task['title']}")
    
    # 6. Vérifier que la tâche apparaît dans la liste
    print("\n6. Vérifier que la tâche apparaît dans la liste")
    response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Échec récupération tâches: {response.status_code}")
        return False
    
    tasks = response.json()
    if len(tasks) != 1:
        print(f"❌ Nombre de tâches incorrect: {len(tasks)}")
        return False
    
    task = tasks[0]
    if task["title"] != "Tâche de test":
        print(f"❌ Titre incorrect: {task['title']}")
        return False
    
    print("✅ Tâche bien présente dans la liste")
    
    # 7. Marquer la tâche comme terminée
    print("\n7. Marquer la tâche comme terminée")
    task_id = task["id"]
    response = requests.post(f"{BASE_URL}/api/tasks/{task_id}/complete", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Échec finalisation: {response.status_code}")
        return False
    
    print("✅ Tâche marquée comme terminée")
    
    # 8. Supprimer la tâche
    print("\n8. Supprimer la tâche")
    response = requests.delete(f"{BASE_URL}/api/tasks/{task_id}", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Échec suppression: {response.status_code}")
        return False
    
    print("✅ Tâche supprimée")
    
    # 9. Vérifier que la liste est vide
    print("\n9. Vérifier que la liste est vide")
    response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Échec récupération tâches: {response.status_code}")
        return False
    
    tasks = response.json()
    if len(tasks) != 0:
        print(f"❌ Liste non vide: {len(tasks)} tâche(s)")
        return False
    
    print("✅ Liste vide après suppression")
    
    print("\n🎉 Tous les tests sont passés avec succès !")
    return True

if __name__ == "__main__":
    try:
        success = test_complete_workflow()
        if not success:
            print("\n❌ Certains tests ont échoué")
            exit(1)
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur")
        print("Assurez-vous que le serveur Flask est démarré avec: python run.py")
        exit(1)
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        exit(1) 