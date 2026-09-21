import { Table, Textarea } from "@mantine/core";

const EditableCell = ({
  placeholder,
  value,
  onChange,
  readOnly,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
}) => (
  <Table.Td>
    <Textarea
      autosize
      variant="unstyled"
      placeholder={readOnly ? "" : placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
    />
  </Table.Td>
);

export default EditableCell;
