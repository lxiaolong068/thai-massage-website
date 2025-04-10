'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { FileInput } from "@/components/ui/file-input";
import Image from 'next/image';
import { Loader2, Save } from "lucide-react";

interface ContactMethod {
  id: string;
  type: string;
  value: string;
  isActive: boolean;
  qrCode?: string;
}

export default function SettingsPage() {
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const defaultTypes = ['WeChat', 'WhatsApp', 'Line', 'Telegram'];

  useEffect(() => {
    fetchContactMethods();
  }, []);

  const fetchContactMethods = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/contact-methods');
      const data = await response.json();
      let fetchedMethods: ContactMethod[] = [];
      if (data.success && Array.isArray(data.data)) {
        fetchedMethods = data.data;
      }

      const initialLocalValues: Record<string, string> = {};
      const initialOriginalValues: Record<string, string> = {};

      const fullContactMethods = defaultTypes.map(type => {
        const existingMethod = fetchedMethods.find(
          (m: ContactMethod) => m.type.toUpperCase() === type.toUpperCase()
        );
        const method = existingMethod || {
          id: `temp-${type.toLowerCase()}`,
          type,
          value: '',
          isActive: false,
          qrCode: ''
        };
        initialLocalValues[method.id] = method.value || '';
        initialOriginalValues[method.id] = method.value || '';
        return method;
      });

      setContactMethods(fullContactMethods);
      setLocalValues(initialLocalValues);
      setOriginalValues(initialOriginalValues);

    } catch (error) {
      const initialLocalValues: Record<string, string> = {};
      const initialOriginalValues: Record<string, string> = {};
      const defaultMethods = defaultTypes.map(type => {
        const method = {
          id: `temp-${type.toLowerCase()}`,
          type,
          value: '',
          isActive: false,
          qrCode: ''
        };
        initialLocalValues[method.id] = '';
        initialOriginalValues[method.id] = '';
        return method;
      });
      setContactMethods(defaultMethods);
      setLocalValues(initialLocalValues);
      setOriginalValues(initialOriginalValues);

      toast({
        title: "Error",
        description: "Failed to fetch contact methods",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQRCodeUpload = async (type: string, file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('qrCode', file);
    formData.append('type', type.toUpperCase());

    setUploading(true);
    try {
      const response = await fetch('/api/v1/admin/contact-methods/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success && data.data?.qrCode) {
        toast({
          title: "Success",
          description: "QR code uploaded successfully",
        });
        const methodToUpdate = contactMethods.find(m => m.type === type);
        if (methodToUpdate) {
            setContactMethods(prevMethods =>
              prevMethods.map(method =>
                method.id === methodToUpdate.id ? { ...method, qrCode: data.data.qrCode } : method
              )
            );
        } else {
             console.warn(`Method type ${type} not found in state after QR upload.`);
             await fetchContactMethods();
        }
      } else {
        throw new Error(data.error || data.message || 'Upload failed or QR Code URL not returned');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload QR code",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (id: string, checked: boolean) => {
    let originalState: boolean | undefined;
    let originalMethodData: ContactMethod | undefined;

    try {
      // Optimistic UI update
      setContactMethods(prev => prev.map(m => {
        if (m.id === id) {
          originalState = m.isActive; // Store original state for potential rollback
          originalMethodData = { ...m }; // Store original data
          return { ...m, isActive: checked };
        }
        return m;
      }));

      let data: { success: boolean; data?: ContactMethod; error?: string; message?: string };
      if (id.startsWith('temp-')) {
        const type = id.replace('temp-', '').toUpperCase();
        const currentTempValue = localValues[id] || ''; // Get potentially unsaved value

        const response = await fetch('/api/v1/admin/contact-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            isActive: checked,
            value: currentTempValue // Send the current value during creation
          }),
        });
        data = await response.json();

        if (!data.success || !data.data?.id) { // Ensure we got a new ID back
           throw new Error(data.error || data.message || 'Creation failed or did not return necessary data');
        }

        const newMethod = data.data;
        const tempId = id; // Store temp id before it's gone

        // --- State Update Logic --- START
        setContactMethods(prev =>
          prev.map(m => m.id === tempId ? { ...newMethod } : m)
        );

        // Update localValues: map value from tempId to newId
        setLocalValues(prevLocal => {
          const newLocal = { ...prevLocal };
          const tempValue = newLocal[tempId]; // Get value associated with temp id
          delete newLocal[tempId]; // Remove old temp entry
          if (tempValue !== undefined) { // If there was a value
            newLocal[newMethod.id] = tempValue; // Assign it to the new real ID
          }
          return newLocal;
        });

        // Update originalValues similarly
        setOriginalValues(prevOriginal => {
            const newOriginal = { ...prevOriginal };
            const tempOrigValue = newOriginal[tempId];
            delete newOriginal[tempId];
            // Assign the *server-returned* value as the new original, or keep the temp one if server didn't return value?
            // Let's use the server-returned value as the new baseline.
             newOriginal[newMethod.id] = newMethod.value || '';
            return newOriginal;
        });
        // --- State Update Logic --- END

          toast({
            title: "Success",
            description: `Contact method ${type} ${checked ? 'created and activated' : 'created'}.`,
          });
          // await fetchContactMethods(); // REMOVED: No longer needed as we update state directly
          return; // Exit early as state is updated

      } else {
        const response = await fetch('/api/v1/admin/contact-methods', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            isActive: checked,
          }),
        });
         data = await response.json();
      }
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Contact method ${contactMethods.find(m => m.id === id)?.type || ''} ${checked ? 'activated' : 'deactivated'}.`,
        });
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
       // Rollback optimistic UI on error
       if (originalMethodData) { // Use originalMethodData for rollback
          // Explicitly assign the confirmed ContactMethod to a new const
          const confirmedOriginalData: ContactMethod = originalMethodData;
          setContactMethods(prev => prev.map(m => 
             // Ensure we only return valid ContactMethod objects
             m.id === id ? confirmedOriginalData : m // Use the explicitly typed const
          ));
       } else if (originalState !== undefined) { // Fallback if originalMethodData wasn't captured
           setContactMethods(prev => prev.map(m => 
              // Ensure isActive is always boolean when restoring. Default to false if undefined.
              m.id === id ? { ...m, isActive: originalState ?? false } : m
          ));
       }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update contact method status",
        variant: "destructive",
      });
    }
  };

  const handleLocalValueChange = (id: string, value: string) => {
    setLocalValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const savePromises = [];

    for (const method of contactMethods) {
      const currentLocalValue = localValues[method.id];
      const originalValue = originalValues[method.id];

      if (currentLocalValue !== originalValue || (method.id.startsWith('temp-') && currentLocalValue)) {
        const payload: { type?: string; id?: string; value: string } = {
          value: currentLocalValue,
        };

        let url = '/api/v1/admin/contact-methods';
        let httpMethod = 'PUT';

        if (method.id.startsWith('temp-')) {
          payload.type = method.type.toUpperCase();
          httpMethod = 'POST';
        } else {
          payload.id = method.id;
        }

        savePromises.push(
          fetch(url, {
            method: httpMethod,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }).then(async (res) => {
            const data = await res.json();
            return {
              type: method.type,
              success: data.success,
              error: data.error?.message || data.error || (res.ok ? null : `HTTP error ${res.status}`)
            };
          }).catch(error => ({
            type: method.type,
            success: false,
            error: error instanceof Error ? error.message : "Network error"
          }))
        );
      }
    }

    if (savePromises.length === 0) {
      toast({ title: "No changes", description: "No contact information was modified." });
      setIsSaving(false);
      return;
    }

    try {
      const results = await Promise.all(savePromises);
      const failedSaves = results.filter(r => !r.success);

      if (failedSaves.length === 0) {
        toast({
          title: "Success",
          description: "All contact settings saved successfully.",
        });
      } else {
        toast({
          title: "Partial Save",
          description: `Saved some settings, but failed for: ${failedSaves.map(f => f.type).join(', ')}. Errors: ${failedSaves.map(f=>f.error).join('; ')}`,
          variant: "default",
          duration: 7000
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving settings.",
        variant: "destructive",
      });
    } finally {
      await fetchContactMethods();
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Settings</h1>
        <Button 
          onClick={handleSaveAll} 
          disabled={isSaving || loading}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {isSaving ? (
             <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
          ) : (
             <Save className="mr-2 h-5 w-5" />
          )}
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactMethods.map((method) => (
          <Card key={method.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{method.type}</span>
                <Switch
                  checked={method.isActive}
                  onCheckedChange={(checked: boolean) => handleToggleActive(method.id, checked)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Contact Information</Label>
                <Input
                  type="text"
                  value={localValues[method.id] || ''}
                  onChange={(e) => handleLocalValueChange(method.id, e.target.value)}
                  placeholder={`Enter ${method.type} contact information`}
                  disabled={isSaving || loading}
                />
              </div>
              <div>
                <Label>QR Code</Label>
                {method.qrCode ? (
                  <div className="mt-2 relative aspect-square w-full max-w-[200px]">
                    <Image
                      src={method.qrCode}
                      alt={`${method.type} QR Code`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center">
                    No QR code uploaded
                  </div>
                )}
                <div className="mt-2">
                  <FileInput
                    accept="image/*"
                    onFileSelect={(file) => handleQRCodeUpload(method.type, file)}
                    disabled={uploading || isSaving || loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 