import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, FileText, Calendar, Trash2, Play, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useFiles } from "@/contexts/FilesContext";

interface UploadTabProps {
  projectId: string;
}

export function UploadTab({ projectId }: UploadTabProps) {
  const { getFilesByProject, addFile, updateFile, deleteFile } = useFiles();
  const files = getFilesByProject(projectId);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [chunkSize, setChunkSize] = useState(400);
  const [overlapSize, setOverlapSize] = useState(20);
  const [doReset, setDoReset] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      addFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadDate: new Date().toISOString().split('T')[0],
        status: "uploaded",
        projectId: projectId
      });
    });
    
    toast.success(`${fileList.length} file(s) uploaded successfully`);
  };

  const handleProcess = (fileId: string) => {
    setSelectedFileId(fileId);
    setIsProcessModalOpen(true);
  };

  const handleProcessSubmit = () => {
    if (!selectedFileId) return;
    
    // Start processing
    updateFile(selectedFileId, { status: "processing" });
    
    toast.success("Processing started");
    setIsProcessModalOpen(false);
    
    // Simulate processing completion
    setTimeout(() => {
      updateFile(selectedFileId, { status: "indexed" });
      toast.success("File processed and indexed");
    }, 3000);
  };

  const handleDelete = (fileId: string) => {
    deleteFile(fileId);
    toast.success("File deleted");
  };

  const getStatusBadge = (status: "uploaded" | "processing" | "indexed" | "error") => {
    const variants = {
      uploaded: { variant: "secondary" as const, icon: FileText, label: "Uploaded" },
      processing: { variant: "default" as const, icon: Clock, label: "Processing" },
      indexed: { variant: "default" as const, icon: CheckCircle, label: "Indexed" },
      error: { variant: "destructive" as const, icon: XCircle, label: "Error" }
    };
    
    const config = variants[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-smooth cursor-pointer hover:border-primary ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <UploadCloud className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT files</p>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.docx,.txt"
            />
          </div>

          {/* Files Table */}
          {files.length > 0 && (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{file.name}</span>
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(file.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProcess(file.id)}
                            disabled={file.status === "processing"}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Modal */}
      <Dialog open={isProcessModalOpen} onOpenChange={setIsProcessModalOpen}>
        <DialogContent className="dark">
          <DialogHeader>
            <DialogTitle className="text-primary">Process File</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label className="text-muted-foreground font-bold">Chunk Size: {chunkSize}</Label>
              <Slider
                value={[chunkSize]}
                onValueChange={(value) => setChunkSize(value[0])}
                min={50}
                max={500}
                step={10}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-muted-foreground font-bold">Overlap Size: {overlapSize}</Label>
              <Slider
                value={[overlapSize]}
                onValueChange={(value) => setOverlapSize(value[0])}
                min={0}
                max={100}
                step={5}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reset"
                checked={doReset}
                onCheckedChange={(checked) => setDoReset(checked as boolean)}
              />
              <Label className="text-muted-foreground/45" htmlFor="reset">Reset existing index</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button className="bg-red-500 text-white hover:bg-red-600" variant="outline" onClick={() => setIsProcessModalOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary" onClick={handleProcessSubmit}>
                Process & Index
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}