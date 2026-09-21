import { Anchor, Divider, Highlight } from "@mantine/core";
import { Frontmatter } from "@/types";
import classes from "./QuestionsListGroup.module.css";

export interface QuestionsListGroupProps {
  search: string;
  category: string;
  questions: Frontmatter[];
}

export function QuestionsListGroup({
  category,
  questions,
  search,
}: QuestionsListGroupProps) {
  const items = questions.map((question) => (
    <Anchor
      key={question.idCauHoi}
      href={`/q/${question.idCauHoi}`}
      className={classes.question}
      underline="never"
      // onClick={(e) => e.preventDefault()} // Prevent navigation
    >
      <Highlight highlight={search} className={classes.questionTitle}>
        {question.tieuDe}
      </Highlight>
      <Highlight highlight={search} className={classes.questionDescription}>
        {question.moTa}
      </Highlight>
    </Anchor>
  ));

  return (
    <section className={classes.group}>
      <header className={classes.header}>
        <h2 className={classes.category}>{category}</h2>
        <Divider className={classes.divider} />
      </header>
      {items}
    </section>
  );
}
