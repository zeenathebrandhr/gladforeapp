import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';
import type { Farmer } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

export default function AdminFarmers() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: farmers, isLoading } = useQuery({
    queryKey: ['/api/farmers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Farmer[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return new Promise<void>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              const farmers = results.data.map((row: any) => ({
                name: row.name || row.Name,
                phone: row.phone || row.Phone,
                national_id: row.national_id || row.nationalId || row.ID,
              }));

              const { error } = await supabase
                .from('farmers')
                .insert(farmers);

              if (error) throw error;
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farmers'] });
      toast({
        title: 'Upload successful',
        description: 'Farmers have been added to the system',
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    await uploadMutation.mutateAsync(selectedFile);
    setUploading(false);
  };

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6">
      <PageHeader
        title="Farmers Management"
        subtitle="Upload and manage farmer data"
      />

      {/* CSV Upload Section */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Farmers (CSV)</h3>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center hover-elevate">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-csv-file"
            />
            
            <span className="material-icons text-5xl text-muted-foreground mb-4">
              cloud_upload
            </span>
            
            <h4 className="text-base font-medium mb-2">
              {selectedFile ? selectedFile.name : 'Upload CSV File'}
            </h4>
            
            <p className="text-sm text-muted-foreground mb-4">
              CSV should include: Name, Phone, National ID
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-browse-file"
              >
                <span className="material-icons mr-2">attach_file</span>
                Browse File
              </Button>
              
              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  data-testid="button-upload-csv"
                >
                  <span className="material-icons mr-2">cloud_upload</span>
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farmers List */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">
            Registered Farmers ({farmers?.length || 0})
          </h3>
          
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading farmers...
            </div>
          ) : farmers && farmers.length > 0 ? (
            <div className="space-y-3">
              {farmers.map((farmer) => (
                <div
                  key={farmer.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-card-border hover-elevate"
                  data-testid={`farmer-card-${farmer.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-2xl text-primary">person</span>
                    <div>
                      <p className="font-medium text-foreground">{farmer.name}</p>
                      <p className="text-sm text-muted-foreground">{farmer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-muted-foreground">
                      ID: {farmer.national_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-icons text-5xl text-muted-foreground mb-3">
                people_outline
              </span>
              <p className="text-muted-foreground">No farmers registered yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a CSV file to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
