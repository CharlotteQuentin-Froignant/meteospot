# MétéoSpot — Système de design

Document de référence pour l'implémentation concrète du mockup mobile. Contient la palette couleur liée à la température, la typographie, les icônes SVG, et les tokens de mise en page.

---

## 1. Palette de couleur — liée à la température

Le bloc "ville actuelle" (fond, dégradé du chiffre, icône) change de teinte selon 7 tranches de température. Chaque tranche a : une couleur d'accent (icônes, texte), un dégradé de texte pour le gros chiffre, et un fond très légèrement teinté.

| Tranche | Seuil | Accent | Dégradé texte (chiffre) | Fond du bloc (dégradé subtil) |
|---|---|---|---|---|
| **Très froid** | `< 0°C` | `#4FD1E8` | `linear-gradient(120deg, #0E5C66 0%, #4FD1E8 70%)` | `linear-gradient(160deg, #FFFFFF, #E3F7FA)` |
| **Froid** | `0 – 10°C` | `#185FA5` | `linear-gradient(120deg, #042C53 0%, #185FA5 70%)` | `linear-gradient(160deg, #FFFFFF, #E6F1FB)` |
| **Frais** | `10 – 18°C` | `#4CAF7D` | `linear-gradient(120deg, #0F6E56 0%, #4CAF7D 70%)` | `linear-gradient(160deg, #FFFFFF, #E1F5EE)` |
| **Doux** | `18 – 24°C` | `#D9A62E` | `linear-gradient(120deg, #8A6508 0%, #FFC94D 70%)` | `linear-gradient(160deg, #FFFFFF, #FDF6E0)` |
| **Chaud** | `24 – 35°C` | `#FF9A44` | `linear-gradient(120deg, #C43A2E 0%, #FFA83D 70%)` | `linear-gradient(160deg, #FFFFFF, #FCF0E7)` |
| **Très chaud** | `35 – 40°C` | `#E63946` | `linear-gradient(120deg, #9B1C1C 0%, #E63946 70%)` | `linear-gradient(160deg, #FFFFFF, #FCEBEB)` |
| **Canicule** | `> 40°C` | `#7A1D4D` | `linear-gradient(120deg, #24081A 0%, #7A1D4D 70%)` | `linear-gradient(160deg, #FFFFFF, #F1DFE4)` |

> Convention : la borne basse de chaque tranche est incluse, la borne haute est exclue (ex. "Froid" couvre de 0°C inclus à 10°C exclu — 10°C pile appartient à "Frais").
> ⚠️ Les 4 tranches chaudes ("Doux" à "Canicule") ont été retravaillées après un premier passage jugé trop peu contrasté entre tranches voisines — "Doux" a été déplacé vers le jaune doré, "Chaud" accentué vers l'orange, et "Canicule" accentué vers le violet-bordeaux (loin du rouge vif de "Très chaud"). Les 3 tranches froides/fraîches n'ont pas eu ce problème et restent inchangées depuis la première version.

### Couleurs fixes (Météo des extrêmes)
Indépendantes de la température de l'utilisateur — toujours les mêmes 3 couleurs :

| Carte | Couleur (barre d'accent + texte) |
|---|---|
| Plus froide | `#185FA5` |
| Plus chaude | `#E24B4A` |
| Plus pluvieuse | `#0F6E56` |

### Couleurs neutres (UI générale)
Ces valeurs sont des équivalents approchés des tokens utilisés dans le mockup — à recalibrer si besoin selon le rendu réel.

```css
--surface-1: #FFFFFF;      /* fond des cartes (prévisions horaires) */
--surface-2: #F7F6F3;      /* fond de la page / conteneur global */
--text-primary: #1A1A18;   /* texte principal (villes, titres) */
--text-secondary: #5F5E5A; /* texte secondaire */
--text-muted: #9B9A92;     /* labels, heures, texte tertiaire */
--border: #E5E3DC;         /* séparateurs fins */
```
---


| Élément | Valeur actuelle | Historique | Ticket |
|---|---|---|---|
| Fond de page | `#FFFFFF` | ~~#F7F6F3~~| (changé ticket #3) |
| Fond barre de recherche | `#f3f3f758` |     N/A     | (ajouté ticket #3) |
| Border | `#f5f5f4` | ~~#E5E3DC~~|  (changé ticket #4) |


## 2. Typographie

Choix définitifs, à charger via Google Fonts :

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;500;600&family=Manrope:wght@400;500&display=swap">
```

- **Newsreader** (serif éditoriale) — réservée aux éléments "vedettes" :
  - Nom de l'application
  - Nom de la ville
  - Température principale
  - Titres de section
  - Éventuellement les températures de la Météo des extrêmes

- **Manrope** (sans-serif neutre) — tout le reste :
  - Barre de recherche
  - Onglets de villes
  - Données météo (humidité, vent, min/max, etc.)
  - Horaires
  - Labels
  - Boutons / éléments d'interaction
  - Informations secondaires

| Élément | Police | Taille | Poids |
|---|---|---|---|
| Nom d'app (header) | Newsreader | 22px | 500-600 (SemiBold) |
| Nom de ville (bloc principal) | Newsreader | 15-20px | 500-600 |
| Chiffre de température (bloc principal) | Newsreader | 76-80px | 600 (SemiBold) — validé visuellement, le 400 manquait de présence |
| Titres de section | Newsreader | 16px | 500-600 |
| Température (carte horaire / extrêmes) | Newsreader | 17-24px | 500-600 |
| Recherche, onglets, labels, stats, boutons | Manrope | 11-14px | 400-500 |
| Slogan | Manrope | 0.7 rem | 500 |



> ⚠️ Newsreader a des chiffres "old-style" par défaut (hauteurs irrégulières) — forcer les chiffres "lining" (hauteur uniforme) via les réglages OpenType (`font-feature-settings: "lnum"`) pour que le gros chiffre de température reste bien aligné visuellement.

> Les plages ci-dessus couvrent mobile à desktop. En CSS, seule la valeur basse de chaque plage est utilisée comme variable de base (mobile-first). Les valeurs hautes seront appliquées via les media queries tablette/desktop.

- **Note Technique - unités de taille de police**
Les tailles de police ont finalement été converties en `rem` (plutôt que `px`) pour :
  * faciliter le responsive desgin
  * améliorer l'accessibilité (les valeurs en `rem` respectent la préférence de taille de police définie par l'utilisateur dans son navigateur, contrairement au `px` qui reste figé).


| Élément | Valeur actuelle | Historique | Ticket |
|---|---|---|---|
| Nom de ville (bloc principal) | `1.6rem` | ~~0.9rem~~ | (modifié ticket #4) |
| Chiffre de température (bloc principal) | `3.5rem` | ~~4.7rem~~ | (modifié ticket #4) |
| Titres de section | `1.4rem` | ~~1rem~~ | (changé ticket #5) |
| Arc solaire | `0.5rem` | ~~0.7rem~~ | (modifié ticket 9 |)
---

## 3. Icônes météo (SVG, style trait fin)

Toutes en `viewBox="0 0 32 32"`, `fill="none"` sauf mention contraire, `stroke-linecap="round"` / `stroke-linejoin="round"`. Couleur du trait = couleur d'accent de la condition. Correspondance approximative avec les catégories OpenWeatherMap indiquée entre parenthèses.

Pour le bloc ville actuelle, les icones sont plus grandes (88x88) et sont animées.

### 1. Ensoleillé — jour (Clear, jour)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="7" fill="none" stroke="#FF9A44" stroke-width="1.8"/>
  <g stroke="#FF9A44" stroke-width="1.8" stroke-linecap="round">
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="16" y1="26" x2="16" y2="30"/>
    <line x1="2" y1="16" x2="6" y2="16"/><line x1="26" y1="16" x2="30" y2="16"/>
    <line x1="6.3" y1="6.3" x2="9" y2="9"/><line x1="23" y1="23" x2="25.7" y2="25.7"/>
    <line x1="25.7" y1="6.3" x2="23" y2="9"/><line x1="9" y1="23" x2="6.3" y2="25.7"/>
  </g>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <circle cx="44" cy="44" r="20" fill="none" stroke="#FF9A44" stroke-width="2.5"/>
  <g class="sun-rays" stroke="#FF9A44" stroke-width="2.5" stroke-linecap="round">
    <line x1="44" y1="6" x2="44" y2="14"/><line x1="44" y1="74" x2="44" y2="82"/>
    <line x1="6" y1="44" x2="14" y2="44"/><line x1="74" y1="44" x2="82" y2="44"/>
    <line x1="16.5" y1="16.5" x2="22" y2="22"/><line x1="66" y1="66" x2="71.5" y2="71.5"/>
    <line x1="71.5" y1="16.5" x2="66" y2="22"/><line x1="16.5" y1="71.5" x2="22" y2="66"/>
  </g>
</svg>
```

### 2. Nuit claire (Clear, nuit)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M20 6 A11 11 0 1 0 20 26 A8 8 0 0 1 20 6" fill="none" stroke="#7F77DD" stroke-width="1.8" stroke-linejoin="round"/>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes moonDrift { 0%, 100% { transform: translateX(-1px); } 50% { transform: translateX(1px); } }
    .moon-shape { animation: moonDrift 5s ease-in-out infinite; }
  </style>
  <path class="moon-shape" d="M55 16.5 A30.25 30.25 0 1 0 55 71.5 A22 22 0 0 1 55 16.5" fill="none" stroke="#7F77DD" stroke-width="2.5" stroke-linejoin="round"/>
</svg>
```

### 3. Peu nuageux — jour (Clouds : few)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <circle cx="11" cy="10" r="5" fill="none" stroke="#FF9A44" stroke-width="1.6"/>
  <path d="M6 22 Q4 22 4 19 Q4 16 7 16 Q7 11 13 11 Q18 11 19 16 Q23 16 23 20 Q23 22 20 22 Z"
        fill="none" stroke="#9B9A92" stroke-width="1.6" stroke-linejoin="round"/>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes sunRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes cloudDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1.5px); } }
    .sun-rays { transform-origin: 30.25px 27.5px; animation: sunRotate 14s linear infinite; }
    .cloud-shape { animation: cloudDrift 6s ease-in-out infinite; }
  </style>
  <circle cx="30.25" cy="27.5" r="13.75" fill="none" stroke="#FF9A44" stroke-width="2.22"/>
  <path class="cloud-shape" d="M16.5 60.5 Q11 60.5 11 52.25 Q11 44 19.25 44 Q19.25 30.25 35.75 30.25 Q49.5 30.25 52.25 44 Q63.25 44 63.25 55 Q63.25 60.5 55 60.5 Z"
        fill="none" stroke="#9B9A92" stroke-width="2.22" stroke-linejoin="round"/>
</svg>
```

### 4. Peu nuageux — nuit (Clouds : few, nuit)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M8 20 A6 6 0 0 1 8 8 A7 7 0 0 1 21 6" fill="none" stroke="#7F77DD" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M6 22 Q4 22 4 19 Q4 16 7 16 Q7 11 13 11 Q18 11 19 16 Q23 16 23 20 Q23 22 20 22 Z"
        fill="none" stroke="#9B9A92" stroke-width="1.6" stroke-linejoin="round"/>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes cloudDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1.5px); } }
    .cloud-shape { animation: cloudDrift 6s ease-in-out infinite; }
  </style>
  <path d="M22 55 A16.5 16.5 0 0 1 22 22 A19.25 19.25 0 0 1 57.75 16.5" fill="none" stroke="#7F77DD" stroke-width="2.08" stroke-linejoin="round"/>
  <path class="cloud-shape" d="M16.5 60.5 Q11 60.5 11 52.25 Q11 44 19.25 44 Q19.25 30.25 35.75 30.25 Q49.5 30.25 52.25 44 Q63.25 44 63.25 55 Q63.25 60.5 55 60.5 Z"
        fill="none" stroke="#9B9A92" stroke-width="2.22" stroke-linejoin="round"/>
</svg>
```

### 5. Nuageux (Clouds : scattered)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M7 24 Q5 24 5 21 Q5 18 8 18 Q8 12 15 12 Q21 12 22 18 Q27 18 27 22 Q27 24 24 24 Z"
        fill="none" stroke="#9B9A92" stroke-width="1.6" stroke-linejoin="round"/>
</svg>
```

**Version Animée** (taille 88x88, dérive subtile)
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes cloudDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1.5px); } }
    .cloud-shape { animation: cloudDrift 6s ease-in-out infinite; }
  </style>
  <path class="cloud-shape" d="M19.25 66 Q13.75 66 13.75 57.75 Q13.75 49.5 22 49.5 Q22 33 41.25 33 Q57.75 33 60.5 49.5 Q74.25 49.5 74.25 60.5 Q74.25 66 66 66 Z"
        fill="none" stroke="#9B9A92" stroke-width="2.22" stroke-linejoin="round"/>
</svg>
```

### 6. Couvert (Clouds : broken/overcast)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M6 23 Q4 23 4 20 Q4 17 7 17 Q7 10 14 10 Q21 10 22 17 Q28 17 28 21 Q28 23 25 23 Z"
        fill="none" stroke="#5F5E5A" stroke-width="1.7" stroke-linejoin="round"/>
  <path d="M10 17 Q10 13 15 13" fill="none" stroke="#5F5E5A" stroke-width="1.3" opacity="0.6"/>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes cloudDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1.2px); } }
    .cloud-shape { animation: cloudDrift 7s ease-in-out infinite; }
  </style>
  <g class="cloud-shape">
    <path d="M16.5 63.25 Q11 63.25 11 55 Q11 46.75 19.25 46.75 Q19.25 27.5 38.5 27.5 Q57.75 27.5 60.5 46.75 Q77 46.75 77 57.75 Q77 63.25 68.75 63.25 Z"
          fill="none" stroke="#5F5E5A" stroke-width="2.36" stroke-linejoin="round"/>
    <path d="M27.5 46.75 Q27.5 35.75 41.25 35.75" fill="none" stroke="#5F5E5A" stroke-width="1.81" opacity="0.6"/>
  </g>
</svg>
```

### 7. Bruine (Drizzle)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M8 20 Q6 20 6 17 Q6 14 9 14 Q9 9 15 9 Q21 9 22 14 Q26 14 26 18 Q26 20 23 20 Z"
        fill="none" stroke="#8B8A82" stroke-width="1.6" stroke-linejoin="round"/>
  <circle cx="11" cy="27" r="0.9" fill="#378ADD"/><circle cx="16" cy="27" r="0.9" fill="#378ADD"/><circle cx="21" cy="27" r="0.9" fill="#378ADD"/>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes drizzleFall { 0% { transform: translateY(-1px); opacity: 0.3; } 50% { opacity: 1; } 100% { transform: translateY(1.5px); opacity: 0.3; } }
    .drizzle-dot { animation: drizzleFall 1.3s ease-in-out infinite; }
  </style>
  <path d="M22 55 Q16.5 55 16.5 46.75 Q16.5 38.5 24.75 38.5 Q24.75 24.75 41.25 24.75 Q57.75 24.75 60.5 38.5 Q71.5 38.5 71.5 49.5 Q71.5 55 63.25 55 Z"
        fill="none" stroke="#8B8A82" stroke-width="2.22" stroke-linejoin="round"/>
  <circle class="drizzle-dot" cx="30.25" cy="71.5" r="2.48" fill="#378ADD" style="animation-delay: 0s;"/>
  <circle class="drizzle-dot" cx="44" cy="71.5" r="2.48" fill="#378ADD" style="animation-delay: 0.3s;"/>
  <circle class="drizzle-dot" cx="57.75" cy="71.5" r="2.48" fill="#378ADD" style="animation-delay: 0.6s;"/>
</svg>
```

### 8. Pluie (Rain)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M8 20 Q6 20 6 17 Q6 14 9 14 Q9 9 15 9 Q21 9 22 14 Q26 14 26 18 Q26 20 23 20 Z"
        fill="none" stroke="#5F5E5A" stroke-width="1.6" stroke-linejoin="round"/>
  <g stroke="#378ADD" stroke-width="1.8" stroke-linecap="round">
    <line x1="12" y1="24" x2="10" y2="29"/><line x1="17" y1="24" x2="15" y2="29"/><line x1="22" y1="24" x2="20" y2="29"/>
  </g>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes rainFall { 0% { transform: translateY(-3px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(3px); opacity: 0; } }
    .rain-drop { animation: rainFall 1s linear infinite; }
  </style>
  <path d="M22 55 Q16.5 55 16.5 46.75 Q16.5 38.5 24.75 38.5 Q24.75 24.75 41.25 24.75 Q57.75 24.75 60.5 38.5 Q71.5 38.5 71.5 49.5 Q71.5 55 63.25 55 Z"
        fill="none" stroke="#5F5E5A" stroke-width="2.22" stroke-linejoin="round"/>
  <line class="rain-drop" x1="33" y1="66" x2="27.5" y2="79.75" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round" style="animation-delay: 0s;"/>
  <line class="rain-drop" x1="46.75" y1="66" x2="41.25" y2="79.75" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round" style="animation-delay: 0.25s;"/>
  <line class="rain-drop" x1="60.5" y1="66" x2="55" y2="79.75" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round" style="animation-delay: 0.5s;"/>
</svg>
```

### 9. Pluie forte (Rain : heavy)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M7 18 Q5 18 5 15 Q5 12 8 12 Q8 7 14 7 Q20 7 21 12 Q27 12 27 16 Q27 18 24 18 Z"
        fill="none" stroke="#3E3D39" stroke-width="1.7" stroke-linejoin="round"/>
  <g stroke="#185FA5" stroke-width="1.8" stroke-linecap="round">
    <line x1="9" y1="21" x2="7" y2="27"/><line x1="14" y1="21" x2="12" y2="27"/><line x1="19" y1="21" x2="17" y2="27"/><line x1="24" y1="21" x2="22" y2="27"/>
  </g>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes rainFall { 0% { transform: translateY(-3px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(3px); opacity: 0; } }
    .rain-drop { animation: rainFall 0.65s linear infinite; }
  </style>
  <path d="M19.25 49.5 Q13.75 49.5 13.75 41.25 Q13.75 33 22 33 Q22 19.25 38.5 19.25 Q55 19.25 57.75 33 Q74.25 33 74.25 44 Q74.25 49.5 66 49.5 Z"
        fill="none" stroke="#3E3D39" stroke-width="2.36" stroke-linejoin="round"/>
  <line class="rain-drop" x1="24.75" y1="57.75" x2="19.25" y2="74.25" stroke="#185FA5" stroke-width="2.5" stroke-linecap="round" style="animation-delay: 0s;"/>
  <line class="rain-drop" x1="38.5" y1="57.75" x2="33" y2="74.25" stroke="#185FA5" stroke-width="2.5" stroke-linecap="round" style="animation-delay: 0.15s;"/>
  <line class="rain-drop" x1="52.25" y1="57.75" x2="46.75" y2="74.25" stroke="#185FA5" stroke-width="2.5" stroke-linecap="round" style="animation-delay: 0.3s;"/>
  <line class="rain-drop" x1="66" y1="57.75" x2="60.5" y2="74.25" stroke="#185FA5" stroke-width="2.5" stroke-linecap="round" style="animation-delay: 0.45s;"/>
</svg>
```

### 10. Orage (Thunderstorm)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M8 18 Q6 18 6 15 Q6 12 9 12 Q9 7 15 7 Q21 7 22 12 Q27 12 27 16 Q27 18 24 18 Z"
        fill="none" stroke="#5F5E5A" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M17 19 L13 25 L17 25 L14 30 L22 22 L18 22 Z" fill="#F2A93B" stroke="#F2A93B" stroke-width="1" stroke-linejoin="round"/>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes boltFlash { 0%, 88%, 100% { opacity: 1; } 91%, 95% { opacity: 0.25; } }
    .bolt { animation: boltFlash 3s ease-in-out infinite; }
  </style>
  <path d="M22 49.5 Q16.5 49.5 16.5 41.25 Q16.5 33 24.75 33 Q24.75 19.25 41.25 19.25 Q57.75 19.25 60.5 33 Q74.25 33 74.25 44 Q74.25 49.5 66 49.5 Z"
        fill="none" stroke="#5F5E5A" stroke-width="2.22" stroke-linejoin="round"/>
  <path class="bolt" d="M46.75 52.25 L35.75 68.75 L46.75 68.75 L38.5 82.5 L60.5 60.5 L49.5 60.5 Z" fill="#F2A93B" stroke="#F2A93B" stroke-width="1.39" stroke-linejoin="round"/>
</svg>
```

### 11. Neige (Snow)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M8 20 Q6 20 6 17 Q6 14 9 14 Q9 9 15 9 Q21 9 22 14 Q26 14 26 18 Q26 20 23 20 Z"
        fill="none" stroke="#9B9A92" stroke-width="1.6" stroke-linejoin="round"/>
  <g stroke="#378ADD" stroke-width="1.1" stroke-linecap="round">
    <line x1="9" y1="24" x2="9" y2="29"/><line x1="11.16" y1="25.25" x2="6.84" y2="27.75"/><line x1="6.84" y1="25.25" x2="11.16" y2="27.75"/>
    <line x1="16" y1="24" x2="16" y2="29"/><line x1="18.16" y1="25.25" x2="13.84" y2="27.75"/><line x1="13.84" y1="25.25" x2="18.16" y2="27.75"/>
    <line x1="23" y1="24" x2="23" y2="29"/><line x1="25.16" y1="25.25" x2="20.84" y2="27.75"/><line x1="20.84" y1="25.25" x2="25.16" y2="27.75"/>
  </g>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes snowVertical { 0% { transform: translateY(-3px); opacity: 0.4; } 50% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(3px); opacity: 0.4; } }
    .snow-vertical { animation: snowVertical 1.8s ease-in-out infinite; }
  </style>
  <path d="M22 55 Q16.5 55 16.5 46.75 Q16.5 38.5 24.75 38.5 Q24.75 24.75 41.25 24.75 Q57.75 24.75 60.5 38.5 Q71.5 38.5 71.5 49.5 Q71.5 55 63.25 55 Z"
        fill="none" stroke="#9B9A92" stroke-width="2.22" stroke-linejoin="round"/>
  <g class="snow-vertical" stroke="#378ADD" stroke-width="1.53" stroke-linecap="round" style="animation-delay: 0s;">
    <line x1="24.75" y1="66" x2="24.75" y2="77"/><line x1="30.7" y1="68.44" x2="18.81" y2="74.56"/><line x1="18.81" y1="68.44" x2="30.7" y2="74.56"/>
  </g>
  <g class="snow-vertical" stroke="#378ADD" stroke-width="1.53" stroke-linecap="round" style="animation-delay: 0.6s;">
    <line x1="44" y1="66" x2="44" y2="77"/><line x1="49.95" y1="68.44" x2="38.06" y2="74.56"/><line x1="38.06" y1="68.44" x2="49.95" y2="74.56"/>
  </g>
  <g class="snow-vertical" stroke="#378ADD" stroke-width="1.53" stroke-linecap="round" style="animation-delay: 1.2s;">
    <line x1="63.25" y1="66" x2="63.25" y2="77"/><line x1="69.2" y1="68.44" x2="57.31" y2="74.56"/><line x1="57.31" y1="68.44" x2="69.2" y2="74.56"/>
  </g>
</svg>
```

### 12. Brouillard (Mist/Fog/Haze)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <g stroke="#9B9A92" stroke-width="1.6" stroke-linecap="round">
    <line x1="5" y1="12" x2="27" y2="12"/><line x1="5" y1="17" x2="23" y2="17"/><line x1="9" y1="22" x2="27" y2="22"/>
  </g>
</svg>
```
**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes fogDrift { 0%, 100% { transform: translateX(-2px); } 50% { transform: translateX(2px); } }
    .fog-line { animation: fogDrift 4s ease-in-out infinite; }
  </style>
  <g stroke="#9B9A92" stroke-width="2.22" stroke-linecap="round">
    <line class="fog-line" x1="13.75" y1="33" x2="74.25" y2="33" style="animation-duration: 3.5s; animation-delay: 0s;"/>
    <line class="fog-line" x1="13.75" y1="46.75" x2="63.25" y2="46.75" style="animation-duration: 4.5s; animation-delay: 0.5s;"/>
    <line class="fog-line" x1="24.75" y1="60.5" x2="74.25" y2="60.5" style="animation-duration: 4s; animation-delay: 1s;"/>
  </g>
</svg>
```

### 13. Grêle (Hail)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <path d="M8 20 Q6 20 6 17 Q6 14 9 14 Q9 9 15 9 Q21 9 22 14 Q26 14 26 18 Q26 20 23 20 Z"
        fill="none" stroke="#7A7972" stroke-width="1.6" stroke-linejoin="round"/>
  <circle cx="11" cy="25" r="1.3" fill="#BFD9E8" stroke="#5B8AA6" stroke-width="0.8"/>
  <circle cx="16" cy="27" r="1.3" fill="#BFD9E8" stroke="#5B8AA6" stroke-width="0.8"/>
  <circle cx="21" cy="25" r="1.3" fill="#BFD9E8" stroke="#5B8AA6" stroke-width="0.8"/>
</svg>
```
**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes hailFall { 0% { transform: translateY(-2px); opacity: 0.4; } 50% { opacity: 1; } 100% { transform: translateY(3px); opacity: 0.4; } }
    .hail-pellet { animation: hailFall 0.8s ease-in-out infinite; }
  </style>
  <path d="M22 55 Q16.5 55 16.5 46.75 Q16.5 38.5 24.75 38.5 Q24.75 24.75 41.25 24.75 Q57.75 24.75 60.5 38.5 Q71.5 38.5 71.5 49.5 Q71.5 55 63.25 55 Z"
        fill="none" stroke="#7A7972" stroke-width="2.22" stroke-linejoin="round"/>
  <circle class="hail-pellet" cx="30.25" cy="68.75" r="3.58" fill="#BFD9E8" stroke="#5B8AA6" stroke-width="1.11" style="animation-delay: 0s;"/>
  <circle class="hail-pellet" cx="44" cy="74.25" r="3.58" fill="#BFD9E8" stroke="#5B8AA6" stroke-width="1.11" style="animation-delay: 0.2s;"/>
  <circle class="hail-pellet" cx="57.75" cy="68.75" r="3.58" fill="#BFD9E8" stroke="#5B8AA6" stroke-width="1.11" style="animation-delay: 0.4s;"/>
</svg>
```

### 14. Vent fort (Windy)
```svg
<svg width="26" height="26" viewBox="0 0 32 32">
  <g fill="none" stroke="#8B8A82" stroke-width="1.6" stroke-linecap="round">
    <path d="M3 10 L21 10 Q26 10 26 6.5 Q26 3 22 3.5"/>
    <path d="M3 16 L25 16 Q30 16 30 20.5 Q30 25 25 24"/>
    <path d="M3 22 L17 22 Q21 22 21 25.5 Q21 28 18 27.5"/>
  </g>
</svg>
```

**Version Animée**
```svg
<svg width="88" height="88" viewBox="0 0 88 88">
  <style>
    @keyframes windDrift { 0%, 100% { transform: translateX(-1.5px); opacity: 0.75; } 50% { transform: translateX(1.5px); opacity: 1; } }
    .wind-line { animation: windDrift 1.6s ease-in-out infinite; }
  </style>
  <g fill="none" stroke="#8B8A82" stroke-width="2.22" stroke-linecap="round">
    <path class="wind-line" d="M8.25 27.5 L57.75 27.5 Q71.5 27.5 71.5 17.88 Q71.5 8.25 60.5 9.62" style="animation-duration: 1.6s; animation-delay: 0s;"/>
    <path class="wind-line" d="M8.25 44 L68.75 44 Q82.5 44 82.5 56.38 Q82.5 68.75 68.75 66" style="animation-duration: 1.9s; animation-delay: 0.25s;"/>
    <path class="wind-line" d="M8.25 60.5 L46.75 60.5 Q57.75 60.5 57.75 70.12 Q57.75 77 49.5 75.62" style="animation-duration: 1.4s; animation-delay: 0.5s;"/>
  </g>
</svg>
```

> **Set complet livré** (28 fichiers dans `meteospot-icons.zip`) : 14 conditions météo, chacune en deux versions — `nom.svg` (statique, pour les prévisions horaires et 7 jours) et `nom-animated.svg` (animée, réservée au bloc "Ville actuelle").

> ⚠️ **Exception dans le bloc "ville actuelle" uniquement** : l'icône qui y est affichée (soleil, nuage, etc.) doit être recolorée dynamiquement pour reprendre l'accent de la tranche de température en cours (voir section 1), plutôt que sa couleur fixe habituelle. Testé et validé sur le soleil (orange → rouge en "Très chaud" → violet en "Canicule"). Partout ailleurs dans l'app (prévisions horaires, Météo des extrêmes), les icônes gardent leur couleur fixe liée à la condition, comme documenté ci-dessus et dans les fichiers `.svg` du zip — ceux-ci ne sont donc PAS directement réutilisables tels quels pour l'icône du bloc principal, il faudra soit dupliquer le SVG avec une couleur variable (`currentColor` + `color: var(--accent-temp)` par exemple), soit générer le trait dynamiquement en JS/CSS selon la tranche active.
---

## 4. Mise en page

```css
--radius-card: 12px;       /* cartes prévisions horaires */
--radius-block: 16px;      /* bloc ville actuelle */
--radius-app: 14-20px;     /* conteneur global */
--spacing-block: 22-26px;  /* entre les 4 sections principales */
--spacing-card-gap: 8px;   /* entre cartes horaires en scroll */
--border-width-accent: 3px;/* barre de couleur, liste extrêmes */
```

**Arc solaire (SVG, viewBox `0 0 340 90`)** — trajet en pointillés + position du soleil :
```svg
<path d="M 10 78 Q 170 -20 330 78" fill="none" stroke="[couleur accent]" stroke-width="1.5" stroke-dasharray="2 4" opacity="0.5"/>
<circle cx="[position x selon heure]" cy="[position y sur la courbe]" r="9" fill="[couleur accent]"/>
<circle cx="[même x/y]" r="16" fill="[couleur accent]" opacity="0.25"/>
```
La position du soleil sur l'arc doit être calculée dynamiquement selon l'heure actuelle entre le lever et le coucher (0% = lever à gauche, 100% = coucher à droite).

> **Cas nocturne** : entre le coucher et le lever du soleil, aucune position n'est calculée sur l'arc (l'heure actuelle est hors de la plage [lever, coucher]). L'arc reste affiché en trait neutre/discret, sans point, accompagné d'une indication textuelle du prochain lever ("Prochain lever : 06:52") à la place de la donnée habituellement associée au point.

**Update ticket 9**: le rayon du soleil est de 10 et le halo de 15. Pour l'arc de nuit, une icone de soleil endormie aux tons violets a été ajoutée afin d'améliorer l'esthétique.
---

## 5. Conventions d'interface — écrans d'état

Ces règles s'appliquent aux 4 templates d'état (nominal, localisation désactivée avec/sans historique, échec réseau) :

- **Le header (nom d'app "MétéoSpot" + slogan) est centré** sur tous les écrans, y compris l'écran d'échec réseau.
- **Bouton d'action principal** : la couleur porte une information de gravité, pas juste une harmonie visuelle.
  - `#FF9A44` (orange) pour "Activer ma position" (localisation désactivée, premier lancement) — une action bienvenue mais non bloquante, l'app reste utilisable sans (Météo des extrêmes toujours visible).
  - `#E24B4A` (rouge) pour "Réessayer" (échec réseau uniquement) — signale un vrai problème bloquant, rien n'est consultable tant que ce n'est pas résolu, contrairement au cas localisation désactivée.
  - Dans les deux cas : texte blanc, `border-radius: 999px` (pilule).
- **Barre de recherche absente sur l'écran d'échec réseau** : contrairement aux autres écrans d'état, où elle reste visible, elle est totalement retirée ici puisqu'une panne réseau/API empêche probablement aussi la recherche de fonctionner.
- **Barres de scroll horizontales** (prévisions de la journée, historique) : masquées visuellement via `scrollbar-width: none` (Firefox) et `::-webkit-scrollbar { display: none }` (Chrome/Safari) — le scroll reste fonctionnel au doigt/à la molette, seule la barre visuelle disparaît, pour un rendu plus épuré.
- **Chiffre de température principal** : prévoir une marge positive entre le nom de ville et le chiffre (pas de marge négative qui les rapproche) — un chevauchement visuel a été identifié et corrigé, le chiffre a besoin d'air au-dessus pour ne pas paraître écrasé contre le nom de ville.

---

## 6. Ce qui reste à faire avant l'implémentation

- Vérifier le contraste texte/fond sur les tranche de température.
- Prévoir la troncature du nom de ville (CSS `text-overflow: ellipsis` + `white-space: nowrap` a minima, testé sur "Saint-Jean-de-la-Ruelle").

