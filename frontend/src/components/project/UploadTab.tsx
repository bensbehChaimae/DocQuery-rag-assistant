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
import { uploadFile, processAndPush } from "@/api/data";

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
  const [isUploading, setIsUploading] = useState(false);

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
  }, [projectId]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (fileList: File[]) => {
    if (fileList.length === 0) return;
    
    // Validate file types
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const invalidFiles = fileList.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return !validExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setIsUploading(true);
    console.log(`Starting upload for ${fileList.length} file(s) to project ${projectId}`);

    // Upload files one by one
    for (const file of fileList) {
      // Add local entry first with "uploading" status
      const frontId = addFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadDate: new Date().toISOString().split("T")[0],
        status: "uploaded", // Will be updated shortly
        projectId: projectId,
      });

      console.log(`Uploading file: ${file.name} (${file.size} bytes)`);

      try {
        // Upload to backend
        const res = await uploadFile(projectId, file);
        console.log(`Upload successful for ${file.name}:`, res);
        
        // Update with backend file_id
        updateFile(frontId, { 
          fileId: res.file_id, 
          status: "uploaded" 
        });
        
        toast.success(`${file.name} uploaded successfully`);
      } catch (err: any) {
        console.error(`Upload failed for ${file.name}:`, err);
        updateFile(frontId, { status: "error" });
        toast.error(`Upload failed for ${file.name}: ${err?.message || err}`);
      }
    }

    setIsUploading(false);
    console.log("All uploads completed");
  };

  const handleProcess = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    
    if (!file) {
      toast.error("File not found");
      return;
    }

    if (!file.fileId) {
      toast.error("This file has not been uploaded to the backend yet");
      return;
    }

    if (file.status === "processing") {
      toast.error("File is already being processed");
      return;
    }

    setSelectedFileId(fileId);
    setIsProcessModalOpen(true);
  };

  const handleProcessSubmit = async () => {
    if (!selectedFileId) return;

    const file = files.find((f) => f.id === selectedFileId);
    if (!file || !file.fileId) {
      toast.error("Invalid file or missing backend file ID");
      return;
    }

    console.log(`Starting processing for file: ${file.name} (ID: ${file.fileId})`);
    console.log(`Parameters: chunk_size=${chunkSize}, overlap_size=${overlapSize}, do_reset=${doReset ? 1 : 0}`);

    updateFile(selectedFileId, { status: "processing" });
    setIsProcessModalOpen(false);
    toast.success("Processing started...");

    try {
      const res = await processAndPush(projectId, file.fileId, {
        chunk_size: chunkSize,
        overlap_size: overlapSize,
        do_reset: doReset ? 1 : 0,
      });
      
      console.log("Processing completed:", res);
      updateFile(selectedFileId, { status: "indexed" });
      toast.success(`${file.name} processed and indexed successfully`);
    } catch (err: any) {
      console.error("Processing failed:", err);
      updateFile(selectedFileId, { status: "error" });
      toast.error(`Processing failed: ${err?.message || err}`);
    }
  };

  const handleDelete = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      console.log(`Deleting file: ${file.name}`);
    }
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
            } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => !isUploading && document.getElementById("file-input")?.click()}
          >
            <UploadCloud className={`h-16 w-16 text-primary mx-auto mb-4 ${isUploading ? "animate-pulse" : ""}`} />
            <p className="text-lg font-medium mb-2">
              {isUploading ? "Uploading..." : "Drop files here or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT files</p>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.docx,.txt"
              disabled={isUploading}
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
                            disabled={file.status === "processing" || !file.fileId}
                            title={!file.fileId ? "Upload not completed" : "Process and index file"}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(file.id)}
                            disabled={file.status === "processing"}
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
              <p className="text-xs text-muted-foreground">
                Number of tokens per chunk (50-500)
              </p>
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
              <p className="text-xs text-muted-foreground">
                Number of overlapping tokens between chunks (0-100)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reset"
                checked={doReset}
                onCheckedChange={(checked) => setDoReset(checked as boolean)}
              />
              <Label className="text-muted-foreground" htmlFor="reset">
                Reset existing index (clear previous data)
              </Label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                className="bg-red-500 text-white hover:bg-red-600" 
                variant="outline" 
                onClick={() => setIsProcessModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="gradient-primary" 
                onClick={handleProcessSubmit}
              >
                Process & Index
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}