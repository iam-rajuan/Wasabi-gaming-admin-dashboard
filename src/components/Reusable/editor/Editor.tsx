"use client";
import "quill/dist/quill.snow.css";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import "./editor.css";

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: any;
  onTextChange?: (delta: any, oldDelta: any, source: any) => void;
  onSelectionChange?: (range: any, oldRange: any, source: any) => void;
  placeholder?: string;
}

const Editor = forwardRef<any, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, placeholder }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    // Extract content from nested structure
    const extractContent = (data) => {
      if (!data) return "";

      // If data has a 'text' property, use that
      if (typeof data === 'object' && data.text) {
        return data.text;
      }

      // If data is already a string, use it directly
      if (typeof data === 'string') {
        return data;
      }

      return "";
    };

    useEffect(() => {
      let quillInstance = null;

      const initQuill = async () => {
        const { default: Quill } = await import("quill");

        const container = containerRef.current;
        if (!container) return;

        // Check if already initialized
        if (container.querySelector('.ql-container')) return;

        const editorContainer = container.appendChild(
          container.ownerDocument.createElement("div")
        );

        const quill = new Quill(editorContainer, {
          theme: "snow",
          placeholder,
        });
        quillInstance = quill;

        // ✅ Expose quill instance
        if (typeof ref === "function") {
          ref(quill);
        } else if (ref) {
          (ref as any).current = quill;
        }

        // ✅ Handle both Delta and HTML
        const content = extractContent(defaultValueRef.current);
        if (content) {
          if (typeof content === "string") {
            // HTML string → insert into editor
            quill.clipboard.dangerouslyPasteHTML(0, content);
          } else {
            // Assume Delta object
            quill.setContents(content);
          }
        }

        // Listeners
        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
          onTextChangeRef.current?.(...args);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
          onSelectionChangeRef.current?.(...args);
        });

        // Handle initial readOnly
        quill.enable(!readOnly);
      };

      initQuill();

      return () => {
        // Cleanup not strictly necessary for simple cases but good practice
        // We avoid destroying container innerHTML immediately if strict mode causes double render
        // But for Quill, we usually want to cleanup.
        if (quillInstance) {
          // quillInstance = null; 
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          (ref as any).current = null;
        }
      };
    }, [ref, readOnly]);

    useEffect(() => {
      if ((ref as any)?.current) {
        (ref as any).current.enable(!readOnly);
      }
    }, [readOnly, ref]);

    return <div ref={containerRef} style={{ minHeight: "220px", height: "260px" }} />;
  }
);

Editor.displayName = "Editor";

export default Editor;
