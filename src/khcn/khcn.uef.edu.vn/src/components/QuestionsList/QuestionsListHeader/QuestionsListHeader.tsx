import { useEffect, useRef } from "react";
import { IconSearch } from "@tabler/icons-react";
import { CloseButton, Container, Text, TextInput, Title } from "@mantine/core";
import classes from "./style.module.css";

interface QuestionsListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  total: number;
}

export function QuestionsListHeader({
  search,
  onSearchChange,
  total,
}: QuestionsListHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={classes.root}>
      <Container size="md">
        <Title className={classes.title}>Trung tâm hỗ trợ</Title>
        <Text className={classes.description}>
          {total} câu hỏi thường gặp và câu hỏi chung về hệ thống.
        </Text>

        <TextInput
          size="xl"
          radius="md"
          placeholder="Tìm câu hỏi, vấn đề..."
          leftSectionPointerEvents="none"
          leftSection={<IconSearch size={26} stroke={1.5} />}
          rightSection={
            search.trim().length > 0 && (
              <CloseButton size="lg" onClick={() => onSearchChange("")} />
            )
          }
          classNames={{ input: classes.searchInput }}
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          ref={inputRef}
        />
      </Container>
    </div>
  );
}
