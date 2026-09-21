export interface Heading {
  depth: number;
  content: string;
  id: string;
  getNode: () => HTMLHeadingElement;
}

function autoAddHeadingIds(root: HTMLElement): void {
  const headings = Array.from(
    root.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4, h5, h6")
  );
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    heading.style.marginTop = "38.4px";
  });
}

function getHeadingsData(headings: HTMLHeadingElement[]): Heading[] {
  const result: Heading[] = [];

  for (const heading of headings) {
    if (heading.id) {
      result.push({
        depth: parseInt(heading.tagName.replace("H", "")!, 10),
        content: heading.textContent?.trim() || "",
        id: heading.id,
        getNode: () =>
          document.getElementById(heading.id) as HTMLHeadingElement,
      });
    }
  }

  return result;
}

export function getHeadings(): Heading[] {
  const root = document.getElementById("mdx");

  if (!root) {
    return [];
  }

  // Tìm tất cả các thẻ heading (h2, h3, ...) trong vùng root
  const headings: HTMLHeadingElement[] = Array.from(
    root.querySelectorAll("h1, h2, h3, h4, h5, h6")
  );

  // Thêm ID nếu thiếu
  autoAddHeadingIds(root);

  // Thêm id nếu thiếu để đảm bảo các heading có thể được tham chiếu
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
  });

  return getHeadingsData(headings);
}
