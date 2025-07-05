#!/usr/bin/env python3
"""
Script de vérification complète du système
Vérifie que tous les composants fonctionnent correctement
"""

import os
import sys
import importlib
import requests
import json
from pathlib import Path

def check_python_version():
    """Vérifier la version de Python"""
    print("🐍 Vérification de Python...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python {version.major}.{version.minor} détecté")
        print("   Python 3.8+ requis")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_dependencies():
    """Vérifier les dépendances"""
    print("\n📦 Vérification des dépendances...")
    
    required_packages = [
        'flask',
        'flask-sqlalchemy', 
        'flask-jwt-extended',
        'bcrypt',
        'requests'
    ]
    
    missing = []
    for package in required_packages:
        try:
            importlib.import_module(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - MANQUANT")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Packages manquants: {', '.join(missing)}")
        print("   Exécutez: pip install -r requirements.txt")
        return False
    
    return True

def check_files():
    """Vérifier la présence des fichiers essentiels"""
    print("\n📁 Vérification des fichiers...")
    
    required_files = [
        'run.py',
        'requirements.txt',
        'src/__init__.py',
        'src/app_config.py',
        'src/models.py',
        'src/routes.py',
        'templates/index.html',
        'static/style.css',
        'static/app.js',
        'static/auth.js'
    ]
    
    missing = []
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MANQUANT")
            missing.append(file_path)
    
    if missing:
        print(f"\n⚠️  Fichiers manquants: {len(missing)}")
        return False
    
    return True

def check_database():
    """Vérifier la base de données"""
    print("\n🗄️  Vérification de la base de données...")
    
    db_path = 'tasks.db'
    if os.path.exists(db_path):
        print(f"✅ Base de données trouvée: {db_path}")
        size = os.path.getsize(db_path)
        print(f"   Taille: {size} octets")
        return True
    else:
        print(f"⚠️  Base de données non trouvée: {db_path}")
        print("   Elle sera créée au premier démarrage")
        return True

def check_server():
    """Vérifier que le serveur peut démarrer"""
    print("\n🌐 Test du serveur...")
    
    try:
        # Importer et configurer l'app
        from src.app_config import create_app
        app = create_app()
        
        # Tester la configuration
        with app.app_context():
            from src.models import db
            db.create_all()
            print("✅ Base de données initialisée")
        
        print("✅ Serveur Flask configuré correctement")
        return True
        
    except Exception as e:
        print(f"❌ Erreur serveur: {e}")
        return False

def run_tests():
    """Exécuter les tests"""
    print("\n🧪 Exécution des tests...")
    
    try:
        import subprocess
        result = subprocess.run([sys.executable, 'test_complete.py'], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Tests automatisés réussis")
            return True
        else:
            print("❌ Tests échoués:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors des tests: {e}")
        return False

def check_web_interface():
    """Vérifier l'interface web"""
    print("\n🌐 Test de l'interface web...")
    
    try:
        # Démarrer le serveur en arrière-plan
        import subprocess
        import time
        
        process = subprocess.Popen([sys.executable, 'run.py'], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE)
        
        # Attendre que le serveur démarre
        time.sleep(3)
        
        # Tester l'endpoint principal
        response = requests.get('http://localhost:5000', timeout=5)
        
        if response.status_code == 200:
            print("✅ Interface web accessible")
            
            # Tester l'API
            api_response = requests.get('http://localhost:5000/api/tasks')
            if api_response.status_code in [200, 401]:  # 401 = non authentifié (normal)
                print("✅ API accessible")
            else:
                print(f"⚠️  API: {api_response.status_code}")
                
        else:
            print(f"❌ Interface web: {response.status_code}")
        
        # Arrêter le serveur
        process.terminate()
        process.wait()
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur")
        return False
    except Exception as e:
        print(f"❌ Erreur interface web: {e}")
        return False

def main():
    """Vérification complète du système"""
    print("🔍 Vérification complète du système")
    print("=" * 50)
    
    checks = [
        ("Python", check_python_version),
        ("Dépendances", check_dependencies),
        ("Fichiers", check_files),
        ("Base de données", check_database),
        ("Serveur", check_server),
        ("Tests", run_tests),
        ("Interface web", check_web_interface)
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Erreur lors de la vérification {name}: {e}")
            results.append((name, False))
    
    # Résumé
    print("\n" + "=" * 50)
    print("📊 RÉSUMÉ DES VÉRIFICATIONS")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name:15} {status}")
        if result:
            passed += 1
    
    print(f"\nRésultat: {passed}/{total} vérifications réussies")
    
    if passed == total:
        print("\n🎉 SYSTÈME PRÊT POUR LA PRÉSENTATION !")
        print("\n📋 Instructions pour la présentation:")
        print("1. Exécutez: ./start_presentation.sh")
        print("2. Ouvrez http://localhost:5000")
        print("3. Créez un compte et testez les fonctionnalités")
        return True
    else:
        print(f"\n⚠️  {total - passed} problème(s) détecté(s)")
        print("Corrigez les problèmes avant la présentation")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 