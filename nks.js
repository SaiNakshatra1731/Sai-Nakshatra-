
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
  "Ashwini", "Bharani", "Krittika", "Rohini",
  "Mrigashira", "Ardra", "Punarvasu", "Pushya",
  "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula",
  "Purva Ashadha", "Uttara Ashadha", "Shravana",
  "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

// Keep the existing longitude function available.
function calculateFromMoonLongitude(longitude) {
  if (
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    longitude < 0 ||
    longitude >= 360
  ) {
    throw new Error("Invalid Moon longitude.");
  }

  const rashiIndex = Math.floor(longitude / 30);
  const nakshatraIndex = Math.floor(
    longitude / NAKSHATRA_SPAN
  );

  const position =
    longitude - nakshatraIndex * NAKSHATRA_SPAN;

  return {
    rashi: RASHIS[rashiIndex],
    nakshatra: NAKSHATRAS[nakshatraIndex],
    pada: Math.floor(position / PADA_SPAN) + 1,
    siderealMoonLongitude: longitude
  };
}

// Load our stored astronomical data.
const astrologyData = require(
  "./sai_nakshatra_2016_2026_transitions.json"
);

// Find the stored result for a birth timestamp in UTC.
function lookupFromBirthDateTimeUtc(birthDateTimeUtc) {
  const target = Date.parse(birthDateTimeUtc);

  if (!Number.isFinite(target)) {
    throw new Error("Invalid birth date/time.");
  }

  const records = astrologyData.records;

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Astrology database is empty.");
  }

  let low = 0;
  let high = records.length - 1;

  if (
    target < Date.parse(records[0].effective_from_utc) ||
    target > Date.parse(
      records[records.length - 1].effective_from_utc
    )
  ) {
    throw new Error(
      "Birth date/time is outside the database coverage."
    );
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const recordTime = Date.parse(
      records[mid].effective_from_utc
    );

    if (recordTime <= target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const record = records[high];

  return {
    rashi: record.rashi,
    nakshatra: record.nakshatra,
    pada: record.pada,
    siderealMoonLongitude:
      record.moon_sidereal_longitude_deg
  };
}
if (typeof window !== "undefined") {
  window.SaiNakshatraLookup = { lookupFromBirthDateTimeUtc };
  }
module.exports = {
  calculateFromMoonLongitude,
  lookupFromBirthDateTimeUtc
};
