import { Title } from "@mantine/core";
import classes from "./NothingFound.module.css";

export function NothingFound() {
  return (
    <section className={classes.root}>
      <Title order={2} c="bright">
        Nothing found... But do not give up yet!
      </Title>
    </section>
  );
}
