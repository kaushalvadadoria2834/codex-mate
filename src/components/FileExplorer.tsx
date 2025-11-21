import { useState } from "react";
import { Search, ChevronRight, ChevronDown, File, Folder, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FileNode } from "@/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface FileExplorerProps {
  files: FileNode[];
  selectedFiles: string[];
  onFileSelect: (path: string) => void;
  onFileContextToggle: (path: string) => void;
  indexingStatus?: {
    status: 'idle' | 'indexing' | 'completed';
    filesIndexed: number;
    progress: number;
  };
}

const FileTreeNode = ({
  node,
  depth = 0,
  selectedPath,
  selectedForContext,
  onSelect,
  onContextToggle,
}: {
  node: FileNode;
  depth?: number;
  selectedPath: string;
  selectedForContext: string[];
  onSelect: (path: string) => void;
  onContextToggle: (path: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const isSelected = selectedPath === node.path;
  const isInContext = selectedForContext.includes(node.path);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-secondary/50 rounded transition-colors",
          isSelected && "bg-secondary"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (node.type === 'folder') {
            setIsExpanded(!isExpanded);
          } else {
            onSelect(node.path);
          }
        }}
      >
        {node.type === 'folder' && (
          <span className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        
        {node.type === 'folder' ? (
          <Folder className="h-4 w-4 text-primary" />
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}
        
        <span className="flex-1 text-sm truncate">{node.name}</span>
        
        {node.type === 'file' && (
          <Checkbox
            checked={isInContext}
            onCheckedChange={() => onContextToggle(node.path)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              selectedForContext={selectedForContext}
              onSelect={onSelect}
              onContextToggle={onContextToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer = ({
  files,
  selectedFiles,
  onFileSelect,
  onFileContextToggle,
  indexingStatus,
}: FileExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPath, setSelectedPath] = useState("");

  const handleFileSelect = (path: string) => {
    setSelectedPath(path);
    onFileSelect(path);
  };

  const filterFiles = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query) return nodes;
    
    return nodes.reduce((acc: FileNode[], node) => {
      if (node.type === 'folder' && node.children) {
        const filteredChildren = filterFiles(node.children, query);
        if (filteredChildren.length > 0) {
          acc.push({ ...node, children: filteredChildren });
        }
      } else if (node.name.toLowerCase().includes(query.toLowerCase())) {
        acc.push(node);
      }
      return acc;
    }, []);
  };

  const filteredFiles = filterFiles(files, searchQuery);

  return (
    <div className="h-full flex flex-col bg-sidebar-background border-r border-panel-border">
      <div className="p-3 border-b border-panel-border space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {indexingStatus && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {indexingStatus.status === 'indexing' ? 'Indexing...' : 'Indexed'}
              </span>
              <span className="text-muted-foreground">
                {indexingStatus.filesIndexed} files
              </span>
            </div>
            {indexingStatus.status === 'indexing' && (
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${indexingStatus.progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {selectedFiles.length} selected
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              selectedPath={selectedPath}
              selectedForContext={selectedFiles}
              onSelect={handleFileSelect}
              onContextToggle={onFileContextToggle}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Folder className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No files found' : 'Upload a codebase to get started'}
            </p>
          </div>
        )}
      </div>

      {indexingStatus && indexingStatus.status === 'completed' && (
        <div className="p-2 border-t border-panel-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last synced: Just now</span>
          </div>
        </div>
      )}
    </div>
  );
};
