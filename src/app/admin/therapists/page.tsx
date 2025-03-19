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
  const [error, setError] = useState('');
  const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'WORKING'>('ALL');
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [isBatchUpdateDialogOpen, setIsBatchUpdateDialogOpen] = useState(false);
  const [newWorkStatus, setNewWorkStatus] = useState<'AVAILABLE' | 'WORKING'>('AVAILABLE');

  // 获取按摩师列表
  const fetchTherapists = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/therapists?locale=en`);
      
      if (!response.ok) {
        throw new Error(`Failed to get therapists: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to get therapists');
      }
      
      setTherapists(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to get therapists');
    } finally {
      setLoading(false);
      setSelectedTherapists([]);
    }
  };

  // 初始化时获取数据
  useEffect(() => {
    fetchTherapists();
  }, []);

  // 删除单个按摩师
  const [deleteTherapistId, setDeleteTherapistId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteTherapistId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTherapistId) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/therapists/${deleteTherapistId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to delete therapist: ${response.status}`);
      }
      
      toast.success('Therapist successfully deleted');
      // 重新获取列表
      fetchTherapists();
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete therapist');
    } finally {
      setIsDeleting(false);
    }
  };

  // 批量删除按摩师
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);

  const handleBatchDeleteClick = () => {
    if (selectedTherapists.length === 0) {
      toast.error('请至少选择一个按摩师');
      return;
    }
    setIsBatchDeleteDialogOpen(true);
  };

  const handleBatchDelete = async () => {
    if (selectedTherapists.length === 0) {
      toast.error('请至少选择一个按摩师');
      return;
    }
    
    try {
      setIsBatchDeleting(true);
      const response = await fetch(`/api/therapists`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          therapistIds: selectedTherapists
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Batch deletion failed: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message || `Successfully deleted ${selectedTherapists.length} therapists`);
      
      // 重新获取列表
      fetchTherapists();
      setIsBatchDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to batch delete therapists');
    } finally {
      setIsBatchDeleting(false);
    }
  };

  // 批量更新按摩师状态
  const handleBatchUpdateClick = () => {
    if (selectedTherapists.length === 0) {
      toast.error('请至少选择一个按摩师');
      return;
    }
    setIsBatchUpdateDialogOpen(true);
  };

  const handleBatchUpdate = async () => {
    if (selectedTherapists.length === 0) {
      toast.error('请至少选择一个按摩师');
      return;
    }
    
    try {
      setIsBatchUpdating(true);
      const response = await fetch(`/api/therapists`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          ids: selectedTherapists,
          data: {
            workStatus: newWorkStatus
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Batch update failed: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message || `Successfully updated ${selectedTherapists.length} therapists status`);
      
      // 重新获取列表
      fetchTherapists();
      setIsBatchUpdateDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to batch update therapists status');
    } finally {
      setIsBatchUpdating(false);
    }
  };

  // 处理选择/取消选择所有按摩师
  const handleSelectAll = () => {
    if (selectedTherapists.length === filteredTherapists.length) {
      // 如果所有按摩师都已选中，则取消全选
      setSelectedTherapists([]);
    } else {
      // 否则全选
      setSelectedTherapists(filteredTherapists.map(therapist => therapist.id));
    }
  };

  // 处理选择/取消选择单个按摩师
  const handleSelectTherapist = (id: string) => {
    if (selectedTherapists.includes(id)) {
      // 如果已选中，则取消选择
      setSelectedTherapists(selectedTherapists.filter(therapistId => therapistId !== id));
    } else {
      // 否则添加到选中列表
      setSelectedTherapists([...selectedTherapists, id]);
    }
  };



  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理状态筛选
  const handleStatusFilterChange = (status: 'ALL' | 'AVAILABLE' | 'WORKING') => {
    setStatusFilter(status);
  };

  // 根据搜索关键词和状态过滤按摩师列表
  const filteredTherapists = therapists.filter(therapist => {
    // 先按状态过滤
    if (statusFilter !== 'ALL' && therapist.workStatus !== statusFilter) {
      return false;
    }
    
    // 再按搜索关键词过滤
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      therapist.name.toLowerCase().includes(query) ||
      therapist.bio.toLowerCase().includes(query) ||
      therapist.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
      therapist.specialtiesTranslation.some(specialty => specialty.toLowerCase().includes(query)) ||
      therapist.experienceYears.toString().includes(query)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Therapist Management</h1>
        <div className="flex items-center space-x-4">
          <Button asChild>
            <Link href="/admin/therapists/new">
              Add Therapist
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md">
          <div className="text-red-500">{error}</div>
        </div>
      )}
      
      {!loading && therapists.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            {selectedTherapists.length > 0 && (
              <div className="flex space-x-2">
                <Button
                  onClick={handleBatchDeleteClick}
                  disabled={isBatchDeleting}
                  variant="destructive"
                  size="sm"
                >
                  {isBatchDeleting ? 'Processing...' : `Delete Selected (${selectedTherapists.length})`}
                </Button>
                <Button
                  onClick={handleBatchUpdateClick}
                  disabled={isBatchUpdating}
                  variant="secondary"
                  size="sm"
                >
                  {isBatchUpdating ? 'Processing...' : `Update Status (${selectedTherapists.length})`}
                </Button>
              </div>
            )}
            <Button
              onClick={fetchTherapists}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                onClick={() => handleStatusFilterChange('ALL')}
                variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                className="rounded-none"
              >
                All
              </Button>
              <Button
                onClick={() => handleStatusFilterChange('AVAILABLE')}
                variant={statusFilter === 'AVAILABLE' ? 'default' : 'outline'}
                size="sm"
                className="rounded-none"
              >
                Available
              </Button>
              <Button
                onClick={() => handleStatusFilterChange('WORKING')}
                variant={statusFilter === 'WORKING' ? 'default' : 'outline'}
                size="sm"
                className="rounded-none"
              >
                Working
              </Button>
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, specialties, experience..."
              className="w-64"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      ) : 

      therapists.length === 0 ? (
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedTherapists.length > 0 && selectedTherapists.length === filteredTherapists.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTherapists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No matching therapists found
                  </td>
                </tr>
              ) : (
                filteredTherapists.map((therapist) => (
                  <tr key={therapist.id} className="hover:bg-gray-50">
                    <td className="w-12 px-4 py-4">
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedTherapists.includes(therapist.id)}
                          onCheckedChange={() => handleSelectTherapist(therapist.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative">
                          <Image
                            src={therapist.imageUrl}
                            alt={therapist.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{therapist.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{therapist.bio}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {therapist.specialtiesTranslation.map((specialty, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{therapist.experienceYears} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${therapist.workStatus === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {therapist.workStatus === 'AVAILABLE' ? 'Available' : 'Working'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button asChild variant="link" size="sm" className="mr-2">
                        <Link href={`/admin/therapists/${therapist.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(therapist.id)}
                        variant="link"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredTherapists.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
              Showing {filteredTherapists.length} therapists {searchQuery ? `(filtered from ${therapists.length})` : ''}
            </div>
          )}
        </div>
      )}
      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
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

      {/* 批量删除确认对话框 */}
      <Dialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Batch Deletion</DialogTitle>
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

      {/* 批量更新状态对话框 */}
      <Dialog open={isBatchUpdateDialogOpen} onOpenChange={setIsBatchUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Therapist Status</DialogTitle>
            <DialogDescription>
              Please select the status to update for {selectedTherapists.length} therapists.
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
                  className="rounded-none"
                >
                  Available
                </Button>
                <Button
                  onClick={() => setNewWorkStatus('WORKING')}
                  variant={newWorkStatus === 'WORKING' ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-none"
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
