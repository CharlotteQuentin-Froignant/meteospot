import { test } from "node:test";
import assert from "node:assert/strict";
import { getTempPalette } from "../js/utils.js";

// Chaque cas est une paire : [température, tranche attendue].
// Les valeurs attendues viennent du tableau du design system
// (seuils 0, 10, 18, 24, 35, 40 ; borne basse incluse, borne haute exclue).
// La température est arrondie à l'entier avant le classement, comme l'affichage.
let cases = [
    // une valeur au milieu de chaque tranche
    [-18, "tres-froid"],
    [5, "froid"],
    [14, "frais"],
    [21, "doux"],
    [30, "chaud"],
    [37, "tres-chaud"],
    [43, "extreme"],

    // juste en dessous de chaque seuil, puis pile sur le seuil
    [-1, "tres-froid"],
    [0, "froid"],
    [9, "froid"],
    [10, "frais"],
    [17, "frais"],
    [18, "doux"],
    [23, "doux"],
    [24, "chaud"],
    [34, "chaud"],
    [35, "tres-chaud"],
    [39, "tres-chaud"],
    [40, "extreme"],

    // pas de limite aux extrémités
    [-80, "tres-froid"],
    [70, "extreme"],
];

for (const [temp, expected] of cases) {
    test(temp + " °C donne la tranche " + expected, function () {
        assert.equal(getTempPalette(temp), expected);
    });
}

test("une valeur absente ou invalide donne null", function () {
    assert.equal(getTempPalette(undefined), null);
    assert.equal(getTempPalette(null), null);
    assert.equal(getTempPalette(NaN), null);
    assert.equal(getTempPalette("12"), null);
    assert.equal(getTempPalette("abc"), null);
});