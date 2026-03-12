"use client";
import { useRef, useState, useEffect } from "react";
import Editor from "./Editor";

interface EditSectionProps {
  data?: any;
  section?: any;
  onChange?: (value: string) => void;
  // Supporting usage where onChange expects (value) => void
  // If some component passes (field, value) => void, we might need to adjust.
  // Based on analysis, ManageSchoolFeilds and ManageJobFeilds pass (value) => ...

  value?: string;
  placeholder?: string;
}

const TextEditor: React.FC<EditSectionProps> = ({ data, section, onChange, value, placeholder }) => {
  const [range, setRange] = useState<any>();
  const [lastChange, setLastChange] = useState<any>();
  const [readOnly, setReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quillRef = useRef<any>(null);

  // Standardize content from data or value
  const getContent = () => {
    if (value !== undefined) return value;
    if (!data) return "";
    if (typeof data === 'object' && data.text) {
      return data.text;
    }
    if (typeof data === 'string') {
      return data;
    }
    return "";
  };

  // Sync content updates to parent
  useEffect(() => {
    if (lastChange && quillRef.current && onChange) {
      const content = quillRef.current.root.innerHTML || "";
      onChange(content);
    }
  }, [lastChange, onChange]);

  return (
    <div
      className="flex w-full bg-white flex-col relative"
      style={{
        minHeight: "220px",
      }}
    >
      <Editor
        ref={quillRef}
        readOnly={readOnly || isLoading}
        defaultValue={getContent()}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextEditor;
