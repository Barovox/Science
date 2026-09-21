import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";
import { Text } from "@mantine/core";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  label,
  placeholder,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: placeholder || "" }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !readOnly,
  });

  return (
    <>
      {label && (
        <Text mb="xs" fw="bold">
          {label}
        </Text>
      )}
      <MantineRichTextEditor editor={editor}>
        {!readOnly && (
          <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Bold />
              <MantineRichTextEditor.Italic />
              <MantineRichTextEditor.Underline />
              <MantineRichTextEditor.Strikethrough />
              <MantineRichTextEditor.ClearFormatting />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.ColorPicker
                colors={[
                  "#25262b",
                  "#868e96",
                  "#fa5252",
                  "#e64980",
                  "#be4bdb",
                  "#7950f2",
                  "#4c6ef5",
                  "#228be6",
                  "#15aabf",
                  "#12b886",
                  "#40c057",
                  "#82c91e",
                  "#fab005",
                  "#fd7e14",
                ]}
              />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.BulletList />
              <MantineRichTextEditor.OrderedList />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Link />
              <MantineRichTextEditor.Unlink />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Undo />
              <MantineRichTextEditor.Redo />
            </MantineRichTextEditor.ControlsGroup>
          </MantineRichTextEditor.Toolbar>
        )}

        <MantineRichTextEditor.Content />
      </MantineRichTextEditor>
    </>
  );
}
