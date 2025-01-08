import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  // Extract the language from className, or default to plaintext
  const language = className?.replace("language-", "") || "plaintext";

  return (
    <SyntaxHighlighter language={language} style={dracula} showLineNumbers>
      {children.trim()}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
