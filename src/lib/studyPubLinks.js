import readingPlan from "./readingPlanData";
import { BOOK_MAP } from "./jwLibraryLinks";

// Guia de Pesquisa (publicação rsg) — abre a publicação no JW Library (ou jw.org).
export const RSG_URL = "https://www.jw.org/finder?wtlocale=T&pub=rsg&srcid=share";

const GUIA_BASE = "https://www.jw.org/pt/biblioteca/indices/guia-de-pesquisa/";

// Slug do Guia de Pesquisa para um livro: nome codificado, espaços viram hífens.
// Os nomes do plano (BOOK_MAP) batem com os usados pelo Guia (acentos inclusivos).
function guiaSlug(name) {
  return encodeURIComponent(name).replace(/%20/g, "-");
}

export function guiaUrlForBook(name) {
  return `${GUIA_BASE}${guiaSlug(name)}/`;
}

// Pré-computa, para cada dia, quais livros da Bíblia COMEÇAM nesse dia (primeira
// aparição cronológica no plano). Usado para mostrar os links "no início de cada livro".
const BOOK_STARTS = (() => {
  const namesByLength = Object.keys(BOOK_MAP).sort((a, b) => b.length - a.length);
  const findBook = (clause) => {
    for (const name of namesByLength) {
      if (clause === name || clause.startsWith(name + " ")) return name;
    }
    return null;
  };
  const seen = new Set();
  const starts = {};
  for (const month of readingPlan) {
    for (const d of month.days) {
      const clauses = String(d.ref)
        .split("•")
        .map((c) => c.trim())
        .filter(Boolean);
      const newBooks = [];
      for (const clause of clauses) {
        const b = findBook(clause);
        if (b && !seen.has(b)) {
          seen.add(b);
          newBooks.push(b);
        }
      }
      if (newBooks.length) starts[d.day] = newBooks;
    }
  }
  return starts;
})();

export function bookStartsForDay(day) {
  return BOOK_STARTS[day] || [];
}