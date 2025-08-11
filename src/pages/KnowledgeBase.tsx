
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Trash2, Download, Search } from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

interface KnowledgeDocument {
  id: string;
  fileName: string;
  size: number;
  uploadedAt: string;
}

export function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: documents, isLoading } = useApiQuery<KnowledgeDocument[]>(
    ['knowledge-list'],
    '/api/knowledge/list'
  );

  const uploadMutation = useApiMutation<{ id: string; fileName: string }, FormData>(
    '/api/knowledge/upload',
    'POST'
  );

  const deleteMutation = useApiMutation<{ message: string }, void>(
    '/api/knowledge/delete',
    'DELETE'
  );

  const handleFileUpload = () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);
    
    uploadMutation.mutate(formData);
    setUploadFile(null);
    
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(undefined);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return { name: 'PDF', color: 'bg-red-100 text-red-800' };
      case 'txt':
        return { name: 'TXT', color: 'bg-blue-100 text-blue-800' };
      case 'csv':
        return { name: 'CSV', color: 'bg-green-100 text-green-800' };
      default:
        return { name: 'DOC', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredDocuments = (documents || []).filter(doc => 
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading text="Loading knowledge base..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Upload and manage documents for AI training</p>
        </div>
        <FileText className="w-8 h-8 text-primary" />
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Document</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,.txt,.csv"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button 
              onClick={handleFileUpload}
              disabled={!uploadFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Supported formats: PDF, TXT, CSV (Max 10MB per file)
          </p>
        </CardContent>
      </Card>

      {/* Search and Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => {
                const fileType = getFileType(doc.fileName);
                return (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Badge className={fileType.color}>
                        {fileType.name}
                      </Badge>
                      <div>
                        <h4 className="font-medium">{doc.fileName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : documents && documents.length > 0 ? (
            <EmptyState
              title="No documents found"
              description="No documents match your search criteria."
              icon={<Search className="w-12 h-12" />}
            />
          ) : (
            <EmptyState
              title="No documents uploaded"
              description="Upload your first document to start building your knowledge base."
              icon={<FileText className="w-12 h-12" />}
              action={{
                label: 'Upload Document',
                onClick: () => document.getElementById('file-upload')?.click()
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      {documents && documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{documents.length}</div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatFileSize(documents.reduce((acc, doc) => acc + doc.size, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {documents.filter(doc => doc.fileName.endsWith('.pdf')).length}
                </div>
                <div className="text-sm text-muted-foreground">PDF Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {documents.filter(doc => doc.fileName.endsWith('.txt')).length}
                </div>
                <div className="text-sm text-muted-foreground">Text Files</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
