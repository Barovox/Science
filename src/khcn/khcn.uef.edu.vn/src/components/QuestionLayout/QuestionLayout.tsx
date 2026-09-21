import { IconArrowLeft, IconBug } from "@tabler/icons-react";
import { Anchor, Center, Container, Text, Title } from "@mantine/core";
import { Frontmatter } from "@/types";
import { PageHeaderLink } from "./PageHeaderLink/PageHeaderLink";
import { TableOfContents } from "./TableOfContents";
import classes from "./QuestionLayout.module.css";

interface QuestionLayoutProps {
  question: Frontmatter;
  children: React.ReactNode;
}

export function Layout({ question, children }: QuestionLayoutProps) {
  const convertDateString = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <article>
        <header className={classes.header}>
          <Container size="md">
            <Anchor href="/help-center" underline="hover" fz="sm">
              <Center inline component="span" style={{ gap: 5 }}>
                <IconArrowLeft size={18} stroke={1.5} />
                <span>Quay lại trung tâm hỗ trợ</span>
              </Center>
            </Anchor>

            <Title className={classes.title}>{question.tieuDe}</Title>

            <nav className={classes.links}>
              <PageHeaderLink icon={<IconBug size={18} stroke={1.5} />} link="">
                Phản hồi thêm về câu hỏi này
              </PageHeaderLink>
            </nav>

            <Text c="dimmed" fz="xs" mt="md">
              Cập nhật lần cuối:{" "}
              <Text
                component="time"
                dateTime={convertDateString(question.a_dateSubmit)}
                c="var(--mantine-color-text)"
                inherit
              >
                {convertDateString(question.a_dateSubmit)}
              </Text>
            </Text>
          </Container>
        </header>
        <Container size="md" className={classes.innerContainer}>
          <div className={classes.inner}>
            <div className={classes.content} id="mdx">
              {children}
            </div>
          </div>
          <TableOfContents />
        </Container>
      </article>
    </>
  );
}

const QuestionLayout = ({
  question,
  children,
}: {
  question: Frontmatter;
  children: React.ReactNode;
}) => {
  return <Layout question={question}>{children}</Layout>;
};

export default QuestionLayout;
