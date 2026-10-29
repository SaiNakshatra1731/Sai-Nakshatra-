
"use strict";

const RASHIS = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)"
];

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati"
];

const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

function calculateFromMoonLongitude(longitude) {
  if (
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    longitude < 0 ||
    longitude >= 360
  ) {
    throw new Error(
      "Moon longitude must be from 0° up to, but not including, 360°."
    );
  }

  const rashiIndex = Math.floor(longitude / 30);
  const nakshatraIndex = Math.floor(
    longitude / NAKSHATRA_SPAN
  );

  const positionInNakshatra =
    longitude - nakshatraIndex * NAKSHATRA_SPAN;

  const pada =
    Math.floor(positionInNakshatra / PADA_SPAN) + 1;

  return {
    rashi: RASHIS[rashiIndex],
    nakshatra: NAKSHATRAS[nakshatraIndex],
    pada,
    siderealMoonLongitude: longitude
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateFromMoonLongitude };
    }
