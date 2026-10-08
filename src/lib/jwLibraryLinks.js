// Maps Portuguese book names (as used in the reading plan) to the JW Library / jw.org Finder book numbers.
export const BOOK_MAP = {
  "Gênesis": 1, "Êxodo": 2, "Levítico": 3, "Números": 4, "Deuteronômio": 5,
  "Josué": 6, "Juízes": 7, "Rute": 8, "1 Samuel": 9, "2 Samuel": 10,
  "1 Reis": 11, "2 Reis": 12, "1 Crônicas": 13, "2 Crônicas": 14, "Esdras": 15,
  "Neemias": 16, "Ester": 17, "Jó": 18, "Salmos": 19, "Provérbios": 20,
  "Eclesiastes": 21, "Cântico de Salomão": 22, "Isaías": 23, "Jeremias": 24,
  "Lamentações": 25, "Ezequiel": 26, "Daniel": 27, "Oseias": 28, "Joel": 29,
  "Amós": 30, "Obadias": 31, "Jonas": 32, "Miqueias": 33, "Naum": 34,
  "Habacuque": 35, "Sofonias": 36, "Ageu": 37, "Zacarias": 38, "Malaquias": 39,
  "Mateus": 40, "Marcos": 41, "Lucas": 42, "João": 43, "Atos": 44,
  "Romanos": 45, "1 Coríntios": 46, "2 Coríntios": 47, "Gálatas": 48,
  "Efésios": 49, "Filipenses": 50, "Colossenses": 51, "1 Tessalonicenses": 52,
  "2 Tessalonicenses": 53, "1 Timóteo": 54, "2 Timóteo": 55, "Tito": 56,
  "Filemom": 57, "Hebreus": 58, "Tiago": 59, "1 Pedro": 60, "2 Pedro": 61,
  "1 João": 62, "2 João": 63, "3 João": 64, "Judas": 65, "Apocalipse": 66,
};

const BOOK_NAMES_BY_LENGTH = Object.keys(BOOK_MAP).sort((a, b) => b.length - a.length);

function findBook(clause) {
  for (const name of BOOK_NAMES_BY_LENGTH) {
    if (clause === name || clause.startsWith(name + " ")) return name;
  }
  return null;
}

function buildJWUrl(bookNum, chStart, chEnd) {
  const b = String(bookNum).padStart(2, "0");
  const startRef = `${b}${String(chStart).padStart(3, "0")}000`;
  const endRef = `${b}${String(chEnd).padStart(3, "0")}999`;
  return `https://www.jw.org/finder?srcid=jwlshare&wtlocale=T&prefer=lang&bible=${startRef}-${endRef}&pub=nwtsty`;
}

// Parses a reading-plan reference string (e.g. "Êxodo 39–40 • Salmos 90, 1–2")
// into a list of { label, url } objects, one per contiguous chapter range,
// each pointing to the exact chapter(s) in the JW Library / jw.org Finder.
export function parseReadingRef(ref) {
  if (!ref) return [];
  const clauses = ref.split("•").map((c) => c.trim()).filter(Boolean);
  const links = [];

  clauses.forEach((clause) => {
    const bookName = findBook(clause);
    if (!bookName) return;
    const bookNum = BOOK_MAP[bookName];
    const rest = clause.slice(bookName.length).trim();
    if (!rest) return;

    const tokens = rest.split(",").map((t) => t.trim()).filter(Boolean);
    tokens.forEach((token) => {
      let start, end;
      if (token.includes("–")) {
        const [a, b] = token.split("–").map((p) => p.trim());
        start = parseInt(a, 10);
        end = parseInt(b, 10);
      } else if (token.includes("-")) {
        const [a, b] = token.split("-").map((p) => p.trim());
        start = parseInt(a, 10);
        end = parseInt(b, 10);
      } else {
        start = end = parseInt(token, 10);
      }
      if (Number.isNaN(start) || Number.isNaN(end)) return;

      const label = start === end ? `${bookName} ${start}` : `${bookName} ${start}–${end}`;
      links.push({ label, url: buildJWUrl(bookNum, start, end) });
    });
  });

  return links;
}