"use client";

import { useMemo, useState } from "react";
import styles from "./rich-text-editor.module.css";

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
};

function normalizeInitialValue(value: string) {
  if (!value.trim()) {
    return "<p></p>";
  }

  if (value.includes("<") && value.includes(">")) {
    return value;
  }

  return `<p>${value.replace(/\n/g, "<br />")}</p>`;
}

export function RichTextEditor({ name, defaultValue = "" }: RichTextEditorProps) {
  const initialValue = useMemo(() => normalizeInitialValue(defaultValue), [defaultValue]);
  const [html, setHtml] = useState(initialValue);

  const runCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("bold")}
        >
          Bold
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("italic")}
        >
          Italic
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("formatBlock", "h2")}
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("insertUnorderedList")}
        >
          Bullet list
        </button>
      </div>

      <div
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => setHtml(event.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />

      <input type="hidden" name={name} value={html} />
    </div>
  );
}
