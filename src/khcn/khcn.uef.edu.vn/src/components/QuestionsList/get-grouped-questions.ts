import Fuse from "fuse.js";
import { Frontmatter } from "@/types";

let categoriesOrder: string[] = [];

export function exportCategories(question: Frontmatter[]) {
  // update categoriesOrder
  const categories = question.map((question) => question.phanLoai);
  categoriesOrder = Array.from(new Set(categories));
}

export function getGroupedQuestions(
  questions: Frontmatter[],
  searchQuery: string
) {
  const fuse = new Fuse(questions, {
    keys: ["tieuDe", "phanLoai", "moTa"],
    threshold: 0.3,
  });

  const searchResults =
    searchQuery.trim().length > 0
      ? fuse.search(searchQuery)
      : questions.map((question) => ({ item: question }));

  const grouped = searchResults.reduce<Record<string, Frontmatter[]>>(
    (acc, payload) => {
      const { phanLoai } = payload.item;

      if (!acc[phanLoai]) {
        acc[phanLoai] = [];
      }

      acc[phanLoai].push(payload.item);

      return acc;
    },
    {} as Record<string, Frontmatter[]>
  );

  return Object.keys(grouped)
    .sort((a, b) => {
      const aIndex = categoriesOrder.indexOf(a);
      const bIndex = categoriesOrder.indexOf(b);

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    })
    .filter((key) => grouped[key].length)
    .map((key) => ({
      category: key,
      questions: grouped[key],
    }));
}
