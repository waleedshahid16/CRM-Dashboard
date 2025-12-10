/* eslint-disable no-case-declarations */
import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Type,
} from "lucide-react";

const RichTextEditor = ({
  value,
  onChange,
  error,
  placeholder = "Enter description...",
}) => {
  const editorRef = useRef(null);
  const [selectedFormat, setSelectedFormat] = useState("Normal");

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFormat = (format) => {
    switch (format) {
      case "bold":
        execCommand("bold");
        break;
      case "italic":
        execCommand("italic");
        break;
      case "underline":
        execCommand("underline");
        break;
      case "insertUnorderedList":
        execCommand("insertUnorderedList");
        break;
      case "insertOrderedList":
        execCommand("insertOrderedList");
        break;
      case "removeFormat":
        execCommand("removeFormat");
        break;
      case "createLink":
        const url = prompt("Enter the URL:");
        if (url) {
          execCommand("createLink", url);
        }
        break;
      default:
        break;
    }
  };

  const handleHeadingChange = (e) => {
    const heading = e.target.value;
    setSelectedFormat(heading);

    if (heading === "Normal") {
      execCommand("formatBlock", "<p>");
    } else if (heading === "Heading 1") {
      execCommand("formatBlock", "<h1>");
    } else if (heading === "Heading 2") {
      execCommand("formatBlock", "<h2>");
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
          <select
            value={selectedFormat}
            onChange={handleHeadingChange}
            className="px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option>Normal</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => handleFormat("bold")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleFormat("italic")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleFormat("underline")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => handleFormat("createLink")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => handleFormat("insertUnorderedList")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleFormat("insertOrderedList")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => handleFormat("removeFormat")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Clear Formatting"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className={`w-full px-3 py-3 min-h-[150px] outline-none focus:ring-0 ${
            error ? "bg-red-50" : ""
          }`}
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: value || "" }}
          data-placeholder={placeholder}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] {
          outline: none;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 2em;
          margin: 1em 0;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          padding-left: 2em;
          margin: 1em 0;
        }
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
