
/*
 * Sai Nakshatra — Astrology Engine
 * Version 1.0
 *
 * This module validates birth details and interprets
 * a supplied sidereal Moon longitude.
 *
 * IMPORTANT:
 * The longitude must come from a reliable astronomical
 * calculation source. This file does not calculate it yet.
 */

const SaiNakshatraEngine = (() => {
  "use strict";

  const SIGNS = [
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
    "Ashwini", "Bharani", "Krittika",
    "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada",
    "Revati"
  ];

  const NAKSHATRA_SPAN = 360 / 27;
  const PADA_SPAN = NAKSHATRA_SPAN / 4;

  function validateBirthDetails(details) {
    if (!details || typeof details !== "object") {
      throw new Error("Birth details are required.");
    }

    const { birthDate, birthTime, birthPlace } = details;

    if (
      typeof birthDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)
    ) {
      throw new Error("Enter a valid birth date.");
    }

    const date = new Date(`${birthDate}T00:00:00Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== birthDate
    ) {
      throw new Error("The birth date is not valid.");
    }

    if (
      typeof birthTime !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(birthTime)
    ) {
      throw new Error("Enter birth time in HH:MM format.");
    }

    if (
      typeof birthPlace !== "string" ||
      birthPlace.trim().length < 2
    ) {
      throw new Error("Enter your birth city or place.");
    }

    return {
      birthDate,
      birthTime,
      birthPlace: birthPlace.trim()
    };
  }

  function calculateFromMoonLongitude(longitude) {
    if (
      typeof longitude !== "number" ||
      !Number.isFinite(longitude) ||
      longitude < 0 ||
      longitude >= 360
    ) {
      throw new Error(
        "Moon longitude must be a number from 0 up to, but not including, 360."
      );
    }

    const signIndex = Math.floor(longitude / 30);
    const nakshatraIndex = Math.floor(
      longitude / NAKSHATRA_SPAN
    );

    const positionInNakshatra =
      longitude - nakshatraIndex * NAKSHATRA_SPAN;

    const pada = Math.floor(
      positionInNakshatra / PADA_SPAN
    ) + 1;

    return {
      rashi: SIGNS[signIndex],
      nakshatra: NAKSHATRAS[nakshatraIndex],
      pada,
      siderealMoonLongitude: longitude,
      status: "Calculated from supplied longitude"
    };
  }

  return Object.freeze({
    validateBirthDetails,
    calculateFromMoonLongitude
  });
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = SaiNakshatraEngine;
  }
      
