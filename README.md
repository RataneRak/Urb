# 📋 Gestionnaire de Tâches - Clean Code Python

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](tests/)

Un gestionnaire de tâches moderne et professionnel développé avec Python et Flask, suivant les principes du Clean Code et de l'architecture hexagonale.

## ✨ Fonctionnalités

### 🎯 Gestion des Tâches

- ✅ **Ajouter** de nouvelles tâches avec titre et description
- 📝 **Modifier** les tâches existantes
- ✅ **Marquer comme terminées** les tâches complétées
- 🗑️ **Supprimer** les tâches
- 🔍 **Rechercher** dans vos tâches
- 🏷️ **Filtrer** par priorité (Basse, Normale, Haute)

### 🔐 Authentification

- 👤 **Inscription** et **connexion** sécurisées
- 🔒 **JWT** pour l'authentification
- 👤 **Gestion des sessions** utilisateur

### 🎨 Interface Utilisateur

- 📱 **Design responsive** pour mobile et desktop
- 🌙 **Mode sombre** / Mode clair
- ⚡ **Interface moderne** avec Bootstrap 5
- 🎭 **Animations** et transitions fluides
- ♿ **Accessible** (WCAG 2.1)

### 🏗️ Architecture

- 🏛️ **Clean Architecture** (Hexagonale)
- 📦 **Séparation des couches** (Présentation, Métier, Infrastructure)
- 🧪 **Tests automatisés**
- 📚 **Documentation complète**

## 🚀 Installation

### Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Étapes d'installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/votre-username/gestionnaire-taches.git
   cd gestionnaire-taches
   ```

2. **Créer un environnement virtuel :**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Installer les dépendances :**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configurer la base de données :**

   ```bash
   python -c "from src.app_config import create_app; app = create_app(); app.app_context().push(); from src.app_config import db; db.create_all()"
   ```

5. **Lancer l'application :**

   ```bash
   python run.py
   ```

6. **Accéder à l'application :**
   Ouvrez votre navigateur à l'adresse [http://localhost:5000](http://localhost:5000)

## 🧪 Tests

### Exécuter tous les tests :

```bash
pytest tests/
```

### Exécuter avec couverture :

```bash
pytest --cov=src tests/
```

### Tests spécifiques :

```bash
pytest tests/test_models.py
pytest tests/test_routes.py
```

## 📁 Structure du Projet

```
gestionnaire-taches/
├── src/                    # Code source principal
│   ├── core/              # Logique métier
│   ├── infrastructure/    # Couche infrastructure
│   ├── presentation/      # Contrôleurs et vues
│   ├── app_config.py      # Configuration Flask
│   ├── models.py          # Modèles de données
│   └── routes.py          # Routes API
├── templates/             # Templates HTML
├── static/               # Assets statiques (CSS, JS, images)
├── tests/                # Tests automatisés
├── requirements.txt       # Dépendances Python
├── requirements-dev.txt   # Dépendances de développement
├── pyproject.toml        # Configuration du projet
└── README.md            # Documentation
```

## 🛠️ Technologies Utilisées

### Backend

- **Python 3.8+** - Langage principal
- **Flask** - Framework web
- **SQLAlchemy** - ORM pour la base de données
- **Flask-JWT-Extended** - Authentification JWT
- **Pytest** - Framework de tests

### Frontend

- **HTML5** - Structure
- **CSS3** - Styles et animations
- **JavaScript (ES6+)** - Interactivité
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Icônes

### Outils de Développement

- **Flake8** - Linting Python
- **Black** - Formatage de code
- **Pytest** - Tests automatisés

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
FLASK_ENV=development
SECRET_KEY=votre-clé-secrète-ici
DATABASE_URL=sqlite:///instance/tasks.db
```

### Configuration de développement

```bash
# Installer les dépendances de développement
pip install -r requirements-dev.txt

# Lancer avec le mode debug
FLASK_ENV=development python run.py
```

## 📊 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur

### Tâches

- `GET /api/tasks` - Lister toutes les tâches
- `POST /api/tasks` - Créer une nouvelle tâche
- `PUT /api/tasks/<id>` - Modifier une tâche
- `POST /api/tasks/<id>/complete` - Marquer comme terminée
- `DELETE /api/tasks/<id>` - Supprimer une tâche

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Guide de contribution

- Suivez les conventions de code Python (PEP 8)
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire
- Vérifiez que tous les tests passent

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - _Développement initial_ - [VotreGitHub](https://github.com/votre-username)

## 🙏 Remerciements

- [Flask](https://flask.palletsprojects.com/) - Framework web
- [Bootstrap](https://getbootstrap.com/) - Framework CSS
- [Font Awesome](https://fontawesome.com/) - Icônes
- [Clean Code](https://clean-code-developer.com/) - Principes de développement

## 📞 Support

Si vous rencontrez des problèmes ou avez des questions :

- 📧 **Email** : votre-email@example.com
- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-username/gestionnaire-taches/issues)
- 📖 **Documentation** : [Wiki](https://github.com/votre-username/gestionnaire-taches/wiki)

---

⭐ **N'oubliez pas de donner une étoile au projet si vous l'aimez !**
