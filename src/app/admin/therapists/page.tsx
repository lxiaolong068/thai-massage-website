'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, RefreshCw, Search, Edit, Pencil, User } from 'lucide-react';
import ImageWithFallback from '@/components/ui/image-with-fallback';

type Therapist = {
  id: string;
  imageUrl: string;
  specialties: string[];
  experienceYears: number;
  name: string;
  bio: string;
  specialtiesTranslation: string[];
  workStatus: 'AVAILABLE' | 'WORKING';
  createdAt?: string;
  updatedAt?: string;
};

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [therapistToDelete, setTherapistToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [isBatchUpdateDialogOpen, setIsBatchUpdateDialogOpen] = useState(false);
  const [newWorkStatus, setNewWorkStatus] = useState<'AVAILABLE' | 'WORKING'>('AVAILABLE');

  // Fetch therapists list
  const fetchTherapists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/therapists');
      if (!response.ok) {
        throw new Error('Failed to fetch therapists');
      }
      const data = await response.json();
      setTherapists(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to load therapists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  // Handle deleting a single therapist
  const handleDeleteClick = (id: string) => {
    setTherapistToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!therapistToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/therapists/${therapistToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete therapist');
      }
      
      // 更新列表
      setTherapists(therapists.filter(t => t.id !== therapistToDelete));
      toast.success('Therapist deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsDeleting(false);
      setTherapistToDelete(null);
    }
  };

  // 批量删除按摩师
  const handleBatchDeleteClick = () => {
    if (selectedTherapists.length === 0) return;
    setIsBatchDeleteDialogOpen(true);
  };

  const handleBatchDelete = async () => {
    setIsBatchDeleting(true);
    
    try {
      // Batch delete therapists
      const response = await fetch('/api/therapists', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedTherapists }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete therapists');
      }
      
      toast.success(`Successfully deleted ${selectedTherapists.length} therapists`);
      // Update list
      fetchTherapists();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete therapists');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsBatchDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // 批量更新按摩师状态
  const handleBatchUpdateClick = () => {
    if (selectedTherapists.length === 0) return;
    setIsBatchUpdateDialogOpen(true);
  };

  const handleBatchUpdate = async () => {
    setIsBatchUpdating(true);
    
    try {
      // Batch update therapist status
      const response = await fetch('/api/therapists', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedTherapists,
          data: {
            workStatus: newWorkStatus,
          },
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update therapists');
      }
      
      toast.success(`Successfully updated ${selectedTherapists.length} therapists`);
      
      // Update status in the list
      setTherapists(prev => 
        prev.map(therapist => 
          selectedTherapists.includes(therapist.id) 
            ? { ...therapist, workStatus: newWorkStatus }
            : therapist
        )
      );
      
      setSelectedTherapists([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update therapists');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsBatchUpdating(false);
      setIsBatchUpdateDialogOpen(false);
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    // Handle select all
    if (checked) {
      setSelectedTherapists(therapists.map(t => t.id));
    } else {
      setSelectedTherapists([]);
    }
  };

  // 处理单选
  const handleSelectTherapist = (id: string, checked: boolean) => {
    // Handle individual selection
    if (checked) {
      setSelectedTherapists(prev => [...prev, id]);
    } else {
      setSelectedTherapists(prev => prev.filter(therapistId => therapistId !== id));
    }
  };

  // Handle status filtering
  const handleStatusFilterChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  // Filter therapists based on search query and status
  const filteredTherapists = therapists.filter((therapist) => {
    const searchMatch = 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Status filtering
    const statusMatch = selectedStatus === null || therapist.workStatus === selectedStatus;
    
    return searchMatch && statusMatch;
  });

  return (
    <div className="container p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Therapist Management</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/admin/therapists/new">
              Add Therapist
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant={selectedStatus === null ? "default" : "outline"}
            onClick={() => handleStatusFilterChange(null)}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={selectedStatus === 'AVAILABLE' ? "default" : "outline"}
            onClick={() => handleStatusFilterChange('AVAILABLE')}
            size="sm"
            className={selectedStatus === 'AVAILABLE' ? "bg-green-600 hover:bg-green-700 text-white" : "text-green-600 border-green-600 hover:bg-green-50"}
          >
            Available
          </Button>
          <Button 
            variant={selectedStatus === 'WORKING' ? "default" : "outline"}
            onClick={() => handleStatusFilterChange('WORKING')}
            size="sm"
            className={selectedStatus === 'WORKING' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-blue-600 border-blue-600 hover:bg-blue-50"}
          >
            Working
          </Button>
        </div>
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search therapists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      ) : therapists.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <p className="text-yellow-700">No therapists found</p>
          <Link
            href="/admin/therapists/new"
            className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            Add First Therapist
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center space-x-3">
            {selectedTherapists.length > 0 && (
              <div className="flex space-x-2">
                <Button
                  onClick={handleBatchDeleteClick}
                  disabled={isBatchDeleting}
                  variant="destructive"
                  size="sm"
                  className="flex items-center"
                >
                  <Trash2 size={16} className="mr-1"/> 
                  {isBatchDeleting ? 'Processing...' : `Delete Selected (${selectedTherapists.length})`}
                </Button>
                <Button
                  onClick={handleBatchUpdateClick}
                  disabled={isBatchUpdating}
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <RefreshCw size={16} className="mr-1"/>
                  {isBatchUpdating ? 'Processing...' : `Update Status (${selectedTherapists.length})`}
                </Button>
              </div>
            )}
            <Button
              onClick={fetchTherapists}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <RefreshCw size={16} className="mr-1"/> Refresh
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    <Checkbox
                      checked={selectedTherapists.length === filteredTherapists.length && filteredTherapists.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Therapist
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialties
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTherapists.map((therapist) => (
                  <tr key={therapist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap w-10">
                      <Checkbox
                        checked={selectedTherapists.includes(therapist.id)}
                        onCheckedChange={(checked) => handleSelectTherapist(therapist.id, checked === true)}
                      />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 relative">
                          {therapist.imageUrl ? (
                            <ImageWithFallback
                              src={therapist.imageUrl}
                              alt={`${therapist.name} photo`}
                              fill
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-md">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{therapist.name}</div>
                          <div className="text-gray-500 truncate max-w-[200px]">{therapist.specialties.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {therapist.specialties.slice(0, 3).map((specialty, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {specialty}
                          </span>
                        ))}
                        {therapist.specialties.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{therapist.specialties.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{therapist.experienceYears} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          therapist.workStatus === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {therapist.workStatus === 'AVAILABLE' ? '✓ Available' : '⌛ Working'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button asChild variant="link" size="sm" className="mr-2">
                        <Link href={`/admin/therapists/${therapist.id}`} className="flex items-center">
                          <Pencil size={14} className="mr-1"/> Edit
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(therapist.id)}
                        variant="link"
                        size="sm"
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <Trash2 size={14} className="mr-1"/> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTherapists.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
                Showing {filteredTherapists.length} therapists {searchQuery || selectedStatus ? `(filtered from ${therapists.length} total)` : ''}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this therapist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch delete confirmation dialog */}
      <Dialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Batch Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTherapists.length} selected therapists? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchDeleteDialogOpen(false)} disabled={isBatchDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBatchDelete} disabled={isBatchDeleting}>
              {isBatchDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch update status dialog */}
      <Dialog open={isBatchUpdateDialogOpen} onOpenChange={setIsBatchUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Therapist Status</DialogTitle>
            <DialogDescription>
              Please select the new status for {selectedTherapists.length} therapists.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 font-medium">New Status:</div>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  onClick={() => setNewWorkStatus('AVAILABLE')}
                  variant={newWorkStatus === 'AVAILABLE' ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-none ${newWorkStatus === 'AVAILABLE' ? 'bg-green-600 hover:bg-green-700' : 'text-green-600'}`}
                >
                  Available
                </Button>
                <Button
                  onClick={() => setNewWorkStatus('WORKING')}
                  variant={newWorkStatus === 'WORKING' ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-none ${newWorkStatus === 'WORKING' ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600'}`}
                >
                  Working
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleBatchUpdate} disabled={isBatchUpdating}>
              {isBatchUpdating ? 'Updating...' : 'Confirm Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}