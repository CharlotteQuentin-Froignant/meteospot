/* =====================================================================
  COURBE MÉTÉO "PROCHAINES HEURES"

/* =====================================================================
  ÉTAPE 1 — CONSTANTES DE DESSIN (coordonnées SVG, pas des pixels écran ;
  le SVG se redimensionne tout seul ensuite. Sur l'axe y, 0 est en haut.)

  La hauteur de la courbe elle-même (TOTAL_HEIGHT, Y_CURVE_CENTER, etc.) n'est PAS fixe : elle est recalculée à chaque appel de renderCurve(),
  selon l'écart réel entre le min et le max du jour (voir computeLayout
  plus bas). Ici ne restent que les constantes vraiment fixes.
   ===================================================================== */

const WIDTH = 350;

const X_FIRST = 20;           // x du premier point
const X_LAST  = 330;          // x du dernier point

const PX_PER_DEGREE = 6;      // 1 °C = 6 px verticaux, TOUJOURS (jamais compressé ni étiré)
const MIN_AMPLITUDE = 10;     // écart mini pris en compte pour la hauteur, pour qu'une
                              // journée très stable garde une courbe lisible (pas écrasée)

const NIGHT_LABEL_Y      = 14;  // position verticale du mot "Nuit"
const MARKER_OFFSET_FIRST = 17; // décalage du 1er point au-dessus de son point (a un anneau, donc plus haut)
const MARKER_OFFSET_OTHER = 12; // décalage des autres points au-dessus de leur point
const LABEL_ASCENT       = 12;  // hauteur visuelle approx. au-dessus de la ligne de base d'une étiquette de °
const LABEL_TO_NIGHT_GAP = 8;   // marge mini entre le haut d'une étiquette de température et "Nuit"

// place au-dessus du point le plus haut : assez pour son étiquette de température (le pire cas
// étant le 1er point, avec son plus grand décalage) ET pour ne jamais chevaucher "Nuit" au-dessus
const TOP_MARGIN = NIGHT_LABEL_Y + LABEL_TO_NIGHT_GAP + MARKER_OFFSET_FIRST + LABEL_ASCENT;

const AREA_BOTTOM_PADDING = 15; // marge entre le point le plus bas et le bas de l'aire colorée
const BOTTOM_MARGIN      = 16;  // marge entre le bas de l'aire et la ligne des heures
const HOURS_TO_ICONS     = 10;  // distance heures -> icônes

const ICON_HEIGHT        = 28;  // hauteur des icônes météo (image carrée)
const MAX_RAIN_BAR_HEIGHT = 34; // hauteur max d'une barre de pluie (= drawRain, 100 % de pluie)
const RAIN_BAR_GAP       = 10;  // marge visuelle entre le bas d'une icône et le haut d'une barre max

// distance icônes -> base des barres de pluie : dérivée des hauteurs réelles ci-dessus,
// pour qu'une barre à 100 % ne touche jamais l'icône au-dessus (bug vu avec des barres hautes)
const ICONS_TO_RAIN      = ICON_HEIGHT + MAX_RAIN_BAR_HEIGHT + RAIN_BAR_GAP;
const RAIN_TEXT_SPACE    = 22;  // place sous la base de pluie pour le texte ("x %"/"pas de pluie")

const escapeHtml = s => String(s).replace(/[&<>"']/g,
c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const ICONE_PAR_DEFAUT = "assets/icons/static/cloudy.svg";
function urlIconeSure(src) {
  const s = String(src);
  // accepte : assets/soleil.svg, ./assets/soleil.svg, /assets/soleil.svg
  // refuse : http(s)://..., //site.com, javascript:, data:, "..", guillemets, espaces
  return /^(\.\/|\/)?assets\/([\w\-]+\/)*[\w\-]+\.(svg|png|webp)$/i.test(s) ? s : ICONE_PAR_DEFAUT;
}

/* =====================================================================
ÉTAPE 2 — CALCULS
===================================================================== */

/* --- 2a. Position horizontale : points répartis à égale distance --- */
function calculateX(index, nbPoints) {
  const step = (X_LAST - X_FIRST) / (nbPoints - 1);
  return X_FIRST + index * step;
}

/* --- 2b. Calcule la mise en page verticale du jour : à partir de l'écart réel min/max,
détermine la hauteur totale du SVG et la position de chaque ligne (heures, icônes, pluie...). Appelée une fois par rendu.

  Échelle fixe (PX_PER_DEGREE) + pas de plafond : un écart deux fois plus
  grand occupe toujours deux fois plus de pixels, quel que soit le jour.

  MIN_AMPLITUDE évite juste qu'un jour plat donne une courbe collée à une ligne :
  la carte garde un minimum d'air, sans jamais mentir sur l'écart réel au-delà de ce plancher. --- */

function computeLayout(points) {
  const temperatures = points.map(function (p) { return p.temp; });
  const tMax = Math.max(...temperatures);
  const tMin = Math.min(...temperatures);

  const realRange = tMax - tMin;
  const range = Math.max(MIN_AMPLITUDE, realRange);
  const halfAmplitude = (range / 2) * PX_PER_DEGREE;

  const yCurveCenter = TOP_MARGIN + halfAmplitude;
  const yAreaBottom  = yCurveCenter + halfAmplitude + AREA_BOTTOM_PADDING;
  const yHours       = yAreaBottom + BOTTOM_MARGIN;
  const yIcons       = yHours + HOURS_TO_ICONS;
  const yRainBase    = yIcons + ICONS_TO_RAIN;
  const totalHeight  = yRainBase + RAIN_TEXT_SPACE;

  return { yCurveCenter: yCurveCenter, yAreaBottom: yAreaBottom, yHours: yHours,
           yIcons: yIcons, yRainBase: yRainBase, totalHeight: totalHeight };
}

/* --- 2c. Température -> y (plus chaud = plus haut, donc y plus petit).
Échelle fixe (PX_PER_DEGREE) : renvoie une fonction, ex. tempToY(26) -> 60.5 --- */
function createYFunction(points, layout) {
  const temperatures = points.map(function (p) { return p.temp; });
  const tMax = Math.max(...temperatures);
  const tMin = Math.min(...temperatures);
  const middle = (tMax + tMin) / 2;

  return function (temp) {
    return layout.yCurveCenter + (middle - temp) * PX_PER_DEGREE;
  };
}

/* --- 2d. Courbe lissée : "C" trace une Bézier avec 2 points de contrôle,
placés à mi-chemin, aux hauteurs de départ et d'arrivée. --- */
function buildCurvePath(coordinates) {
  let d = 'M' + coordinates[0].x + ' ' + coordinates[0].y;   // M = "aller à"

  for (let i = 1; i < coordinates.length; i++) {
    const previous = coordinates[i - 1];
    const next = coordinates[i];
    const midX = (previous.x + next.x) / 2;

    d += ' C' + midX + ' ' + previous.y +
         ' ' + midX + ' ' + next.y +
         ' ' + next.x + ' ' + next.y;
  }
  return d;
}

/* --- 2e. Couleurs de la courbe : palette de température (--curve-... en CSS).
   `temp` = milieu de chaque tranche, aligné sur getTempPalette() : si tu
   changes les seuils là-bas, mets ces valeurs à jour. La valeur après la
   virgule dans var() est le secours si la variable CSS n'existe pas. --- */
const CURVE_PALETTE = [
  { temp: 42,   couleur: 'var(--curve-extreme, #7A1D4D)' },     // ≥ 40
  { temp: 37.5, couleur: 'var(--curve-tres-chaud, #E63946)' },  // 35 à 39
  { temp: 29.5, couleur: 'var(--curve-chaud, #F18432)' },       // 24 à 34
  { temp: 21,   couleur: 'var(--curve-doux, #D9A62E)' },        // 18 à 23
  { temp: 14,   couleur: 'var(--curve-frais, #3AA898)' },       // 10 à 17
  { temp: 5,    couleur: 'var(--curve-froid, #1387CC)' },       // 0 à 9
  { temp: -5,   couleur: 'var(--curve-tres-froid, #4FD1E8)' }   // < 0
];
const GRADIENT_TOP_TEMP    = 42;   // = température de la 1re couleur
const GRADIENT_BOTTOM_TEMP = -5;   // = température de la dernière couleur

/* --- 2f. Zones jour/nuit : regroupe les points consécutifs de même statut --- */
function findZones(points) {
  const zones = [];
  let start = 0;

  for (let i = 1; i <= points.length; i++) {
    const changed = i === points.length || points[i].nuit !== points[start].nuit;
    if (changed) {
      zones.push({ start: start, end: i - 1, nuit: points[start].nuit });
      start = i;
    }
  }
  return zones;
}


/* =====================================================================
ÉTAPE 3 — MORCEAUX DE SVG (chaque fonction renvoie du texte SVG ;
les `class="..."` renvoient vers style.css pour les couleurs)
   ===================================================================== */

function drawGradient(tempToY) {
  const yTop    = tempToY(GRADIENT_TOP_TEMP);
  const yBottom = tempToY(GRADIENT_BOTTOM_TEMP);

  const stops = CURVE_PALETTE.map(function (c) {
    // offset = position de la couleur dans le dégradé (0 = haut, 1 = bas)
    const offset = (GRADIENT_TOP_TEMP - c.temp) / (GRADIENT_TOP_TEMP - GRADIENT_BOTTOM_TEMP);
    return `<stop offset="${offset.toFixed(3)}" style="stop-color:${c.couleur}"/>`;
  }).join('');

  return `<defs>
    <linearGradient id="temp-gradient" gradientUnits="userSpaceOnUse"
                    x1="0" y1="${yTop}" x2="0" y2="${yBottom}">${stops}</linearGradient>
  </defs>`;
}

function drawNightZones(points, layout) {
  const step = (X_LAST - X_FIRST) / (points.length - 1);
  const nightZones = findZones(points).filter(function (zone) { return zone.nuit; });

  return nightZones.map(function (zone) {
    // on étend d'une demi-distance de chaque côté, sans sortir du dessin
    const x1 = Math.max(0, calculateX(zone.start, points.length) - step / 2);
    const x2 = Math.min(WIDTH, calculateX(zone.end, points.length) + step / 2);

    // la zone couvre tout le dessin en hauteur, pour laisser de l'air autour du texte
    return `<rect class="curve-night" x="${x1}" y="0" width="${x2 - x1}" height="${layout.totalHeight}" rx="10"/>
            <text class="curve-night-label" x="${(x1 + x2) / 2}" y="${NIGHT_LABEL_Y}"
                  text-anchor="middle" font-size="11">Nuit</text>`;
  }).join('');
}

function drawCurve(coordinates, layout) {
  const line  = buildCurvePath(coordinates);
  const first = coordinates[0];
  const last  = coordinates[coordinates.length - 1];

  // L'aire = la même courbe + on "ferme" la forme en descendant en bas (Z = fermer)
  const area = line + ` L${last.x} ${layout.yAreaBottom} L${first.x} ${layout.yAreaBottom} Z`;

  return `<path d="${area}" fill="url(#temp-gradient)" opacity="0.16"/>
          <path d="${line}" fill="none" stroke="url(#temp-gradient)"
                stroke-width="2" stroke-linecap="round"/>`;
}

/* Repères : point + température par créneau, texte toujours au-dessus.
   1er point = anneau ("maintenant"), max/min en valeur forte. */
function drawMarkers(points, coordinates) {
  const temperatures = points.map(function (p) { return p.temp; });
  const tMax = Math.max(...temperatures);
  const tMin = Math.min(...temperatures);

  return points.map(function (p, i) {
    const coord = coordinates[i];

    // Décalage vertical du texte, au-dessus du point (plus grand pour le 1er, à cause de l'anneau)
    const yOffset = i === 0 ? MARKER_OFFSET_FIRST : MARKER_OFFSET_OTHER;
    const textY = coord.y - yOffset;

    const important = (p.temp === tMax || p.temp === tMin);
    const textClass = important ? 'curve-temp curve-temp--strong' : 'curve-temp';
    const size = important ? 14 : 13;

    const ring = i === 0
      ? `<circle class="curve-ring" cx="${coord.x}" cy="${coord.y}" r="7.5"/>`
      : '';

    return `${ring}
            <circle class="curve-point" cx="${coord.x}" cy="${coord.y}" r="3.5"/>
            <text class="${textClass}" x="${coord.x}" y="${textY}"
                  text-anchor="middle" font-size="${size}">${p.temp}°</text>`;
  }).join('');
}

function drawHours(points, layout) {
  return '<g class="curve-hours" font-size="14" text-anchor="middle">' +
    points.map(function (p, i) {
      const x = calculateX(i, points.length);
      // Le 1er point s'appelle "Maint." et est mis en valeur
      return i === 0
    ? `<text class="curve-hour curve-hour--now" x="${x}" y="${layout.yHours}">Maint.</text>`
    : `<text class="curve-hour" x="${x}" y="${layout.yHours}">${escapeHtml(p.heure)}</text>`;
    }).join('') + '</g>';
}

function drawIcons(points, layout) {
  return points.map(function (p, i) {
    const x = calculateX(i, points.length);
    // <image> affiche TON icône. aria-hidden : l'info est déjà donnée par le texte.
    return `<image href="${escapeHtml(urlIconeSure(p.iconeSrc))}" x="${x - ICON_HEIGHT / 2}" y="${layout.yIcons}"
            width="${ICON_HEIGHT}" height="${ICON_HEIGHT}" aria-hidden="true"/>`;
  }).join('');
}

/* Le trait "pas de pluie" en segments jour/nuit, pour que la nuit soit plus fondue */
function drawNoRainLine(points, layout) {
  const step = (X_LAST - X_FIRST) / (points.length - 1);

  return findZones(points).map(function (zone) {
    const x1 = Math.max(X_FIRST, calculateX(zone.start, points.length) - step / 2);
    const x2 = Math.min(X_LAST, calculateX(zone.end, points.length) + step / 2);
    const nightClass = zone.nuit ? ' curve-rain-empty--night' : '';

    return `<rect class="curve-rain-empty${nightClass}" x="${x1}" y="${layout.yRainBase - 1}"
                  width="${x2 - x1}" height="1" rx="0.5"/>`;
  }).join('');
}

function drawRain(points, layout) {
  const percentages = points.map(function (p) { return Math.round(p.pluie * 100); });

  // Si personne ne dépasse 10 % sur toute la période : une phrase plutôt qu'une ligne de tirets
  const noRain = percentages.every(function (percent) { return percent < 10; });
  if (noRain) {
    return drawNoRainLine(points, layout) +
      `<text class="curve-rain-text" x="${WIDTH / 2}" y="${layout.yRainBase - 10}"
            text-anchor="middle" font-size="12">Pas de pluie prévue</text>`;
  }

  return points.map(function (p, i) {
    const x = calculateX(i, points.length);
    const percent = percentages[i];

    // Moins de 10 % : petite barre neutre de 2 px, sans texte (plus fondue la nuit)
    if (percent < 10) {
      const nightClass = p.nuit ? ' curve-rain-empty--night' : '';
      return `<rect class="curve-rain-empty${nightClass}" x="${x - 6}" y="${layout.yRainBase - 1}"
                    width="12" height="1" rx="0.5"/>`;
    }

    // Sinon : barre colorée, 10 % = 6 px, 20 % = 12 px... (maximum MAX_RAIN_BAR_HEIGHT)
    const barHeight = Math.min(MAX_RAIN_BAR_HEIGHT, Math.round(p.pluie * 60));
    return `<rect class="curve-rain-bar" x="${x - 6}" y="${layout.yRainBase - barHeight}"
                  width="12" height="${barHeight}" rx="2"/>
            <text class="curve-rain-text" x="${x}" y="${layout.yRainBase + 15}"
                  text-anchor="middle" font-size="12">${percent}%</text>`;
  }).join('');
}

/* Texte lu par les lecteurs d'écran (accessibilité) */
function buildDescription(points) {
  const summary = points.map(function (p, i) {
    return (i === 0 ? 'Maintenant' : escapeHtml(p.heure)) + ' : ' + p.temp + '°';
  }).join(', ');
  return 'Températures des prochaines heures. ' + summary;
}


/* =====================================================================
ÉTAPE 4 — renderCurve() : assemble tout dans un <svg> et l'injecte.
Rappelée avec de nouveaux points, elle remplace l'ancien dessin.
La mise en page (computeLayout) est recalculée à chaque appel, donc la
hauteur de la carte suit l'écart réel du jour affiché.
===================================================================== */

export function renderCurve(points, container) {
  if (!points || points.length < 2) {
    container.innerHTML = '';   // il faut au moins 2 points pour tracer une courbe
    return;
  }

  points = points.map(p => ({ ...p, temp: Number(p.temp), pluie: Number(p.pluie) }));

  const layout = computeLayout(points);
  const tempToY = createYFunction(points, layout);

  // Pour chaque point : sa position x et y dans le dessin
  const coordinates = points.map(function (p, i) {
    return { x: calculateX(i, points.length), y: tempToY(p.temp) };
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${WIDTH} ${layout.totalHeight}" role="img"
      aria-label="${buildDescription(points)}">
      ${drawGradient(tempToY)}
      ${drawNightZones(points, layout)}
      ${drawCurve(coordinates, layout)}
      ${drawMarkers(points, coordinates)}
      ${drawHours(points, layout)}
      ${drawIcons(points, layout)}
      ${drawRain(points, layout)}
    </svg>`;
}
