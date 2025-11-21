import { useState, useRef, useEffect } from "react";
import { Send, Upload, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { toast } from "sonner";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onUploadCodebase: (file: File) => void;
  isLoading: boolean;
  onStopGeneration: () => void;
}

export const ChatInterface = ({
  messages,
  onSendMessage,
  onUploadCodebase,
  isLoading,
  onStopGeneration,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.zip')) {
        onUploadCodebase(file);
      } else {
        toast.error("Please upload a .zip file");
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md space-y-4">
              <h2 className="text-2xl font-semibold">Welcome to AI Coding Agent</h2>
              <p className="text-muted-foreground">
                Upload your codebase and start asking questions about your code. I can help you
                understand, refactor, and improve your code.
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="default"
                size="lg"
                className="mt-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Codebase
              </Button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-panel-border p-4">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your code..."
            className="min-h-[44px] max-h-[200px] resize-none"
            disabled={isLoading}
          />

          {isLoading ? (
            <Button variant="destructive" size="icon" onClick={onStopGeneration}>
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
