import quranData from 'quran-json/dist/quran.json';
import JUZ_BOUNDARIES from '../data/juzBoundaries';

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Returns verses from a surah that fall within a juz boundary
function getVersesInJuz(surah, boundary) {
  const { startSurah, startVerse, endSurah, endVerse } = boundary;

  return surah.verses.filter((v) => {
    const afterStart =
      surah.id > startSurah || (surah.id === startSurah && v.id >= startVerse);
    const beforeEnd =
      surah.id < endSurah || (surah.id === endSurah && v.id <= endVerse);
    return afterStart && beforeEnd;
  });
}

// Returns an array of { surah, verses } for all surahs that have verses in the given juz
export function getSurahsInJuz(juzNumber) {
  const boundary = JUZ_BOUNDARIES.find((b) => b.juz === juzNumber);
  if (!boundary) return [];

  const result = [];
  for (const surah of quranData) {
    if (surah.id > boundary.endSurah || surah.id < boundary.startSurah) continue;
    const verses = getVersesInJuz(surah, boundary);
    if (verses.length > 0) {
      result.push({ surah, verses });
    }
  }
  return result;
}

// Picks two non-consecutive verses (gap >= 2) from a verse list
function pickTwoNonConsecutiveVerses(verses) {
  // Need at least 3 verses so that two can have a gap of >= 2
  if (verses.length < 3) return null;

  const maxAttempts = 100;
  for (let i = 0; i < maxAttempts; i++) {
    const idx1 = Math.floor(Math.random() * (verses.length - 2));
    const idx2 = idx1 + 2 + Math.floor(Math.random() * (verses.length - idx1 - 2));
    if (idx2 >= verses.length) continue;
    const v1 = verses[idx1];
    const v2 = verses[idx2];
    if (v2.id - v1.id >= 2) return [v1, v2];
  }
  return null;
}

// Main function: generate a question from a list of selected juz numbers
export function generateQuestion(selectedJuzNumbers) {
  if (!selectedJuzNumbers.length) return null;

  const juzNumber = pickRandom(selectedJuzNumbers);
  const surahsInJuz = getSurahsInJuz(juzNumber);

  // Filter to surahs that have enough verses for a valid pair
  const eligible = surahsInJuz.filter((s) => s.verses.length >= 3);
  if (!eligible.length) return null;

  // Try random surahs until we find a valid pair
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  for (const { surah, verses } of shuffled) {
    const pair = pickTwoNonConsecutiveVerses(verses);
    if (pair) {
      const [v1, v2] = pair;
      const answerVerses = verses.filter((v) => v.id >= v1.id && v.id <= v2.id);
      return {
        juz: juzNumber,
        surah,
        verseStart: v1,
        verseEnd: v2,
        answerVerses,
      };
    }
  }
  return null;
}
