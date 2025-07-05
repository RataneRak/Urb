#!/usr/bin/env python3
"""
Script de test pour vérifier les endpoints d'authentification
"""

import requests
import json
import random

BASE_URL = "http://localhost:5000"

def test_register():
    """Test de l'inscription"""
    print("🔐 Test d'inscription...")
    
    # Générer un email unique
    random_num = random.randint(1000, 9999)
    email = f"test{random_num}@example.com"
    
    data = {
        "email": email,
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Inscription réussie")
            return email
        else:
            print("❌ Échec de l'inscription")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur")
        return None

def test_login(email):
    """Test de la connexion"""
    print(f"\n🔑 Test de connexion avec {email}...")
    
    data = {
        "email": email,
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            if "access_token" in token_data:
                print("✅ Connexion réussie")
                return token_data["access_token"]
            else:
                print("❌ Token manquant dans la réponse")
                return None
        else:
            print("❌ Échec de la connexion")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur")
        return None

def test_tasks(token):
    """Test de récupération des tâches"""
    print("\n📋 Test de récupération des tâches...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Récupération des tâches réussie")
            return True
        else:
            print("❌ Échec de la récupération des tâches")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur")
        return False

def test_add_task(token):
    """Test d'ajout de tâche"""
    print("\n➕ Test d'ajout de tâche...")
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Tâche de test",
        "description": "Description de test"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/tasks", json=data, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Ajout de tâche réussi")
            return True
        else:
            print("❌ Échec de l'ajout de tâche")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur")
        return False

def main():
    """Fonction principale de test"""
    print("🧪 Tests d'authentification")
    print("=" * 40)
    
    # Test d'inscription
    email = test_register()
    if not email:
        print("\n❌ Test d'inscription échoué")
        return
    
    # Test de connexion
    token = test_login(email)
    if not token:
        print("\n❌ Test de connexion échoué")
        return
    
    # Test de récupération des tâches
    if not test_tasks(token):
        print("\n❌ Test de récupération des tâches échoué")
        return
    
    # Test d'ajout de tâche
    if not test_add_task(token):
        print("\n❌ Test d'ajout de tâche échoué")
        return
    
    print("\n🎉 Tous les tests sont passés avec succès !")

if __name__ == "__main__":
    main() 