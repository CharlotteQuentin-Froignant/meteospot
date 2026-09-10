# MétéoSpot ![icone soleil](assets/icons/static/sunny.svg)

Application météo mobile-first, développée en HTML/CSS/JS vanilla.

## Contexte

Point de départ : un exercice de ma formation CDA (Concepteur Développeur d'Applications, démarrée le 8 juin 2026) pour pratiquer la manipulation du DOM et les appels API fetch. Le scope initial étant limité, j'ai choisi de le transformer en un vrai projet personnel complet avec un design, une structure de backlog priorisée, afin de développer une petite application complète plutôt que de coder une fonctionnalité isolée.

Ce travail est réalisé en dehors des heures de formation, avec un temps disponible qui varie d'un jour à l'autre selon la charge de cours.

## Méthode

Vu que je travaille seule et avec une disponibilité réduite, je n'ai pas retenu la notion de sprint mais j'ai plutôt adapté deux outils agiles à mon contexte :

- **Priorisation MoSCoW** pour trancher ce qui est indispensable de ce qui est un bonus (voir plus bas)
- **Backlog priorisé sur GitHub Projects** [https://github.com/users/CharlotteQuentin-Froignant/projects/1], avec un rétroplanning par ticket (date de début/fin propre à chaque tâche)

## MoSCoW

**Must have**
- [ ] Barre de recherche
- [ ] Météo actuelle
- [ ] Prévisions de la journée
- [ ] Design mobile-first

**Should have**
- [ ] Arc lever/coucher du soleil
- [ ] Icônes météo cohérentes et distinctes selon la météo
- [ ] Géolocalisation
- [ ] Gestion des différents états (erreur API, bienvenue, localisation désactivée)
- [ ] Prévisions sur 5 jours
- [ ] Palette dynamique selon la température
- [ ] Responsive tablette

**Could have**
- [ ] Historique des recherches / favoris
- [ ] Météo des extrêmes (sélection de villes emblématiques)
- [ ] Responsive desktop
- [ ] Dark mode
- [ ] Accessibilité (contraste, alt text, navigation clavier — en continu)

**Won't have (pour l'instant)**
- Carte interactive
- Notifications
- Alertes météo (vigilance, etc.)

## Stack technique

- HTML5 / CSS3 vanilla / JavaScript vanilla
- API météo : [OpenWeatherMap](https://openweathermap.org/)
- Pas de framework JS ni de librairie CSS — choix volontaire pour comprendre le DOM et le CSS en profondeur avant de m'appuyer sur des outils plus automatisés

## Design

Maquette conçue par itérations successives avec l'aide de l'IA (échanges de prompts et retours, sans passer par Figma). Point de départ : une direction type dashboard bleu/glassmorphism, jugée trop générique, puis retravaillée vers une identité plus sobre et distinctive (fond pastel, typographie
Newsreader + Manrope, palette évolutive).

Détail complet du processus (points de bascule, versions intermédiaires) :
[docs/design/process.md](docs/design/process.md)

Référence technique d'implémentation (palette, typographie, icônes, ...):
[docs/design/design-system](docs/design/design-system.md)

**Particularité visuelle du projet :** le fond du bloc météo actuelle, le dégradé du chiffre de température et la couleur des icônes changent selon la température de la ville affichée (7 paliers, de "très froid" à "canicule"), pour donner une indication visuelle immédiate du ressenti climatique.

## Assistance IA

J'utilise l'IA de façon ciblée, avec trois cas d'usage principaux :

- **Points techniques que je ne maîtrise pas encore** (ex : calcul de position sur l'arc lever/coucher du soleil) : je demande une explication du fonctionnement, pas juste le code. Je relis ligne par ligne et je dois être capable de l'expliquer moi-même avant de l'intégrer.

- **Aide à la conception** (choix d'architecture, de disposition, structure d'une fonction, organisation des fichiers) : je demande un avis ou plusieurs options à l'IA pour orienter ma décision tout en vérifiant les informations fournies; le code est en grande partie écrit par moi-même.

- **Résolution d'erreurs et de bugs** (CSS qui ne s'affiche pas comme prévu, erreur JS, réponse API inattendue) : j'essaie d'abord de comprendre et corriger seule. Si je bloque après un vrai essai, je demande à l'IA d'expliquer la cause du problème plutôt qu'une correction toute faite, puis je reteste moi-même en modifiant un paramètre pour vérifier que j'ai bien compris

Dans les trois cas, la règle est la même : comprendre avant d'intégrer, et vérifier plutôt que de faire confiance par défaut.

## Avancement

Suivi détaillé sur le GitHub Project [https://github.com/users/CharlotteQuentin-Froignant/projects/1]

- [x] Initialisation du projet (GitHub Project #1)
- [x] HTML sémantique + variables CSS de base (GitHub Project #2)
    - vérification : pas d'erreur de console ni de requêtes [voir la capture](docs/progress/1_app-T2-console-sans-erreur.png)
- [x] HTML et CSS : header, barre de recherche et onglets villes recherchées (GitHub Project #3)
    - vérifications intermédiaires effectuées via les DevTools du navigateur
    - suivi visuel sur simulateur iPhone SE 2016 avec l'extension chrome MOBILEFIRST et test sur appareil réel (Galaxy S23) [voir la capture](docs/progress/2_app-T3-visuel-entete_barre-recherche_onglets.png)

## Installation

```bash
git clone https://github.com/CharlotteQuentin-Froignant/meteospot.git
cd meteospot
# ouvrir index.html, ou utiliser une extension type Live Server
```

Une clé API OpenWeatherMap est nécessaire pour faire fonctionner l'app :
1. Créer un compte sur [openweathermap.org](https://openweathermap.org/)
2. Copier `.env.example` en `.env` et y renseigner sa propre clé
