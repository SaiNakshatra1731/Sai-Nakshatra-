// Sai Nakshatra transition-data lookup (not an astronomical calculator).
// Load the JSON dataset and pass the user's birth time converted to UTC.
// Example: const result = lookupMoonSigns(dataset, "2024-06-01T12:30:00Z");

function lookupMoonSigns(dataset, birthDateTimeUtc) {
  const target = Date.parse(birthDateTimeUtc);
  if (!Number.isFinite(target)) {
    throw new Error("Birth time must be a valid ISO timestamp in UTC.");
  }

  const records = dataset.records;
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("The astrology dataset has no records.");
  }

  let low = 0;
  let high = records.length - 1;

  if (target < Date.parse(records[0].effective_from_utc)) {
    throw new Error("Birth time is earlier than the dataset coverage.");
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const time = Date.parse(records[mid].effective_from_utc);
    if (time <= target) low = mid + 1;
    else high = mid - 1;
  }

  if (high < 0) {
    throw new Error("No matching astrology record was found.");
  }

  const record = records[high];
  return {
    rashi: record.rashi,
    nakshatra: record.nakshatra,
    pada: record.pada,
    moonSiderealLongitudeDeg: record.moon_sidereal_longitude_deg,
    effectiveFromUtc: record.effective_from_utc
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { lookupMoonSigns };
}
