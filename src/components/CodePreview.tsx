import { useState, useEffect } from "react";
import { Copy, Download, Check, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";

interface CodePreviewProps {
  filePath: string;
  content: string;
  language: string;
}

export const CodePreview = ({ filePath, content, language }: CodePreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop() || "file.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-editor-background border-l border-panel-border">
      <div className="h-12 border-b border-panel-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sm">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="truncate text-muted-foreground">{filePath || "No file selected"}</span>
        </div>
        
        {content && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1">
        {content ? (
          <Editor
            height="100%"
            language={language}
            value={content}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <FileCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select a file to preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
