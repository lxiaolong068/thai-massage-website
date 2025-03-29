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
import { Trash2, RefreshCw, Search, Edit, Pencil, User, PlusCircle, MoreHorizontal, Check } from 'lucide-react';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

  const handleBatchUpdate = async (status: 'active' | 'inactive') => {
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
            status: status,
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
            ? { ...therapist, status }
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

  // 加载状态组件
  const LoadingState = () => (
    <div className="w-full space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Therapist Management</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/therapists/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg font-medium text-base"
          >
            <PlusCircle className="w-5 h-5" />
            Add Therapist
          </Link>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search therapists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
            }}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={selectedStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('active')}
            className="whitespace-nowrap"
          >
            Active
          </Button>
          <Button
            variant={selectedStatus === 'inactive' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('inactive')}
            className="whitespace-nowrap"
          >
            Inactive
          </Button>
        </div>
      </div>

      {selectedTherapists.length > 0 && (
        <div className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {selectedTherapists.length} therapist(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBatchUpdate('active')}
            >
              Set Active
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBatchUpdate('inactive')}
            >
              Set Inactive
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBatchDelete}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : therapists.length === 0 ? (
        <div className="text-center py-10">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No Therapists</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new therapist.</p>
          <div className="mt-6">
            <Link
              href="/admin/therapists/new"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg font-medium text-base mx-auto w-fit"
            >
              <PlusCircle className="w-5 h-5" />
              Add First Therapist
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedTherapists.length === therapists.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTherapists(therapists.map(t => t.id));
                      } else {
                        setSelectedTherapists([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {therapists.map((therapist) => (
                <TableRow key={therapist.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTherapists.includes(therapist.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTherapists([...selectedTherapists, therapist.id]);
                        } else {
                          setSelectedTherapists(selectedTherapists.filter(id => id !== therapist.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 relative rounded-full overflow-hidden">
                        <ImageWithFallback
                          src={therapist.imageUrl || '/images/placeholder-therapist.jpg'}
                          alt={therapist.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{therapist.name}</div>
                        <div className="text-sm text-gray-500">{therapist.specialties.join(', ')}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{therapist.experienceYears} years</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                      {therapist.specialties.length > 3 && (
                        <Badge variant="secondary">
                          +{therapist.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={therapist.workStatus === 'AVAILABLE' ? 'success' : 'secondary'}
                    >
                      {therapist.workStatus === 'AVAILABLE' ? '✓ Available' : '⌛ Working'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/therapists/${therapist.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(therapist.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
            <Button variant="default" onClick={() => handleBatchUpdate(newWorkStatus as 'active' | 'inactive')} disabled={isBatchUpdating}>
              {isBatchUpdating ? 'Updating...' : 'Confirm Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}