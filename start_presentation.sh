#!/bin/bash

set -e

echo "🚀 Démarrage du Gestionnaire de Tâches Pro pour la présentation"
echo "================================================================"

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "❌ Environnement virtuel non trouvé"
    echo "Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
echo "📦 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances si nécessaire
pip install -r requirements.txt

# Démarrer le serveur Flask en arrière-plan
echo "🌐 Démarrage du serveur Flask..."
python run.py &
SERVER_PID=$!

# Attendre que le serveur soit prêt
for i in {1..10}; do
    sleep 1
    if curl -s http://localhost:5000 > /dev/null; then
        echo "✅ Serveur Flask prêt !"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Le serveur Flask ne démarre pas."
        kill $SERVER_PID
        exit 1
    fi
done

# Lancer les tests de workflow
python test_complete.py
if [ $? -eq 0 ]; then
    echo "✅ Tests de workflow réussis !"
else
    echo "❌ Tests échoués. Vérifiez la configuration."
    kill $SERVER_PID
    exit 1
fi

# Ouvrir le navigateur
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5000
elif command -v open &> /dev/null; then
    open http://localhost:5000
elif command -v start &> /dev/null; then
    start http://localhost:5000
else
    echo "🌐 Ouvrez manuellement : http://localhost:5000"
fi

echo "🎉 Serveur démarré ! Prêt pour la présentation."
echo ""
echo "🎯 Pour la présentation :"
echo "1. Ouvrez http://localhost:5000 dans votre navigateur"
echo "2. Créez un compte avec un email et mot de passe"
echo "3. Connectez-vous et ajoutez des tâches"
echo "4. Testez toutes les fonctionnalités"
echo ""
echo "⏹️  Pour arrêter le serveur : Ctrl+C"
echo ""

# Attendre que l'utilisateur arrête le serveur
trap "echo ''; echo '🛑 Arrêt du serveur...'; kill $SERVER_PID; exit" INT
wait $SERVER_PID 