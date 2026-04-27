import quranData from 'quran-json/dist/quran.json';
import JUZ_BOUNDARIES from '../data/juzBoundaries';

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const wordCount = (text) => text.trim().split(/\s+/).length;

const MIN_WORDS = 75;
const MAX_WORDS = 170;

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

// Picks v1 and v2 such that the full verse range [v1..v2] is within the word-count window.
// Verses are never split — only complete ayahs are counted.
function pickVerseWindow(verses) {
  if (verses.length < 3) return null;

  const indices = [...Array(verses.length - 2).keys()]
    .sort(() => Math.random() - 0.5);

  for (const i of indices) {
    let cumulative = wordCount(verses[i].text);
    const candidates = [];

    for (let j = i + 1; j < verses.length; j++) {
      cumulative += wordCount(verses[j].text);
      if (cumulative > MAX_WORDS) break;
      if (cumulative >= MIN_WORDS && j >= i + 2) candidates.push(verses[j]);
    }

    if (candidates.length > 0) return [verses[i], pickRandom(candidates)];
  }
  return null;
}

// Main function: generate a question from a list of selected juz numbers
export function generateQuestion(selectedJuzNumbers) {
  if (!selectedJuzNumbers.length) return null;

  const juzNumber = pickRandom(selectedJuzNumbers);
  const surahsInJuz = getSurahsInJuz(juzNumber);

  const eligible = surahsInJuz.filter((s) => s.verses.length >= 3);
  if (!eligible.length) return null;

  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  for (const { surah, verses } of shuffled) {
    const pair = pickVerseWindow(verses);
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
