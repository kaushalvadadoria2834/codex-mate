import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TopNavigation } from "@/components/TopNavigation";
import { FileExplorer } from "@/components/FileExplorer";
import { ChatInterface } from "@/components/ChatInterface";
import { CodePreview } from "@/components/CodePreview";
import { SettingsModal } from "@/components/SettingsModal";
import { FileNode, Message, ProjectSettings } from "@/types";
import { toast } from "sonner";

const Index = () => {
  const [projectName, setProjectName] = useState("My Project");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFileLanguage, setSelectedFileLanguage] = useState("typescript");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ProjectSettings>({
    apiKey: "",
    databaseUrl: "",
    model: "llama-3.1-70b-versatile",
    temperature: 0.7,
    maxTokens: 2048,
  });
  const [indexingStatus, setIndexingStatus] = useState<{
    status: 'idle' | 'indexing' | 'completed';
    filesIndexed: number;
    progress: number;
  }>({ status: 'idle', filesIndexed: 0, progress: 0 });

  const handleFileSelect = (path: string) => {
    setSelectedFilePath(path);
    // In a real app, fetch file content from backend
    setSelectedFileContent(`// File: ${path}\n// Content will be loaded from backend\n\nconsole.log("Hello from ${path}");`);
    
    // Detect language from extension
    const ext = path.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
      'html': 'html',
      'css': 'css',
      'json': 'json',
    };
    setSelectedFileLanguage(langMap[ext || ''] || 'plaintext');
  };

  const handleFileContextToggle = (path: string) => {
    setSelectedFiles(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const handleUploadCodebase = async (file: File) => {
    toast.info("Uploading codebase...");
    setIndexingStatus({ status: 'indexing', filesIndexed: 0, progress: 0 });

    // Simulate upload and indexing
    setTimeout(() => {
      setIndexingStatus({ status: 'indexing', filesIndexed: 50, progress: 50 });
    }, 1000);

    setTimeout(() => {
      setIndexingStatus({ status: 'completed', filesIndexed: 100, progress: 100 });
      
      // Mock file structure
      const mockFiles: FileNode[] = [
        {
          name: "src",
          path: "src",
          type: "folder",
          children: [
            {
              name: "components",
              path: "src/components",
              type: "folder",
              children: [
                { name: "App.tsx", path: "src/components/App.tsx", type: "file", size: 1024 },
                { name: "Header.tsx", path: "src/components/Header.tsx", type: "file", size: 512 },
              ],
            },
            { name: "index.tsx", path: "src/index.tsx", type: "file", size: 256 },
            { name: "utils.ts", path: "src/utils.ts", type: "file", size: 768 },
          ],
        },
        { name: "package.json", path: "package.json", type: "file", size: 2048 },
        { name: "tsconfig.json", path: "tsconfig.json", type: "file", size: 512 },
      ];
      
      setFiles(mockFiles);
      toast.success("Codebase indexed successfully!");
    }, 2000);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about: "${content}"\n\nHere's a sample code response:\n\n\`\`\`typescript\nfunction analyzeCode() {\n  // This is where I would provide intelligent code analysis\n  console.log("Analyzing your codebase...");\n  return "Analysis complete!";\n}\n\`\`\`\n\nIn a real implementation, I would:\n1. Analyze your codebase structure\n2. Provide context-aware suggestions\n3. Help with refactoring and improvements`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleStopGeneration = () => {
    setIsLoading(false);
    toast.info("Generation stopped");
  };

  const handleNewProject = () => {
    if (confirm("Start a new project? This will clear the current workspace.")) {
      setFiles([]);
      setMessages([]);
      setSelectedFiles([]);
      setSelectedFilePath("");
      setSelectedFileContent("");
      setProjectName("My Project");
      toast.success("New project created");
    }
  };

  const handleExport = () => {
    const data = {
      projectName,
      messages,
      files,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-')}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported");
  };

  return (
    <div className="h-screen flex flex-col">
      <TopNavigation
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSettingsClick={() => setSettingsOpen(true)}
        onNewProject={handleNewProject}
        onExport={handleExport}
      />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer
              files={files}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onFileContextToggle={handleFileContextToggle}
              indexingStatus={indexingStatus}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-panel-border hover:bg-primary transition-colors" />

          <Panel defaultSize={50} minSize={30}>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onUploadCodebase={handleUploadCodebase}
              isLoading={isLoading}
              onStopGeneration={handleStopGeneration}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-panel-border hover:bg-primary transition-colors" />

          <Panel defaultSize={30} minSize={20}>
            <CodePreview
              filePath={selectedFilePath}
              content={selectedFileContent}
              language={selectedFileLanguage}
            />
          </Panel>
        </PanelGroup>
      </div>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default Index;
