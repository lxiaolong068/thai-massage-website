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
import { Trash2, RefreshCw, Search, Edit, Pencil } from 'lucide-react';

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

  // 获取按摩师列表
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

  // 处理删除单个按摩师
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
    if (selectedTherapists.length === 0) return;
    
    setIsBatchDeleting(true);
    try {
      const response = await fetch('/api/therapists', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedTherapists,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete therapists');
      }
      
      // 更新列表
      setTherapists(therapists.filter(t => !selectedTherapists.includes(t.id)));
      setSelectedTherapists([]);
      toast.success(`${selectedTherapists.length} therapists deleted successfully`);
      setIsBatchDeleteDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsBatchDeleting(false);
    }
  };

  // 批量更新按摩师状态
  const handleBatchUpdateClick = () => {
    if (selectedTherapists.length === 0) return;
    setIsBatchUpdateDialogOpen(true);
  };

  const handleBatchUpdate = async () => {
    if (selectedTherapists.length === 0) return;
    
    setIsBatchUpdating(true);
    try {
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
        throw new Error(errorData.message || 'Failed to update therapists');
      }
      
      // 更新列表中的状态
      setTherapists(therapists.map(t => 
        selectedTherapists.includes(t.id) ? { ...t, workStatus: newWorkStatus } : t
      ));
      
      toast.success(`${selectedTherapists.length} therapists updated successfully`);
      setIsBatchUpdateDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsBatchUpdating(false);
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTherapists(filteredTherapists.map(t => t.id));
    } else {
      setSelectedTherapists([]);
    }
  };

  // 处理单选
  const handleSelectTherapist = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedTherapists([...selectedTherapists, id]);
    } else {
      setSelectedTherapists(selectedTherapists.filter(t => t !== id));
    }
  };

  // 处理状态筛选
  const handleStatusFilterChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  // 根据搜索查询和状态筛选按摩师
  const filteredTherapists = therapists.filter((therapist) => {
    const searchMatch = 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // 状态筛选
    const statusMatch = selectedStatus === null || therapist.workStatus === selectedStatus;
    
    return searchMatch && statusMatch;
  });

  return (
    <div className="container p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">按摩师管理</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/admin/therapists/new">
              添加按摩师
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
            全部
          </Button>
          <Button 
            variant={selectedStatus === 'AVAILABLE' ? "default" : "outline"}
            onClick={() => handleStatusFilterChange('AVAILABLE')}
            size="sm"
            className={selectedStatus === 'AVAILABLE' ? "bg-green-600 hover:bg-green-700 text-white" : "text-green-600 border-green-600 hover:bg-green-50"}
          >
            可预约
          </Button>
          <Button 
            variant={selectedStatus === 'WORKING' ? "default" : "outline"}
            onClick={() => handleStatusFilterChange('WORKING')}
            size="sm"
            className={selectedStatus === 'WORKING' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-blue-600 border-blue-600 hover:bg-blue-50"}
          >
            工作中
          </Button>
        </div>
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="搜索按摩师..."
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
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      ) : therapists.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <p className="text-yellow-700">没有找到按摩师</p>
          <Link
            href="/admin/therapists/new"
            className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            添加第一位按摩师
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
                  {isBatchDeleting ? '处理中...' : `批量删除 (${selectedTherapists.length})`}
                </Button>
                <Button
                  onClick={handleBatchUpdateClick}
                  disabled={isBatchUpdating}
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <RefreshCw size={16} className="mr-1"/>
                  {isBatchUpdating ? '处理中...' : `批量更新状态 (${selectedTherapists.length})`}
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
              <RefreshCw size={16} className="mr-1"/> 刷新
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
                    按摩师
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    专长
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    经验
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={therapist.imageUrl || '/images/placeholder.png'}
                            alt={therapist.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{therapist.name}</div>
                          <div className="text-sm text-gray-500">{therapist.id.substring(0, 8)}...</div>
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
                      <div className="text-sm text-gray-900">{therapist.experienceYears} 年</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          therapist.workStatus === 'AVAILABLE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {therapist.workStatus === 'AVAILABLE' ? '✓ 可预约' : '⌛ 工作中'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button asChild variant="link" size="sm" className="mr-2">
                        <Link href={`/admin/therapists/${therapist.id}`} className="flex items-center">
                          <Pencil size={14} className="mr-1"/> 编辑
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(therapist.id)}
                        variant="link"
                        size="sm"
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <Trash2 size={14} className="mr-1"/> 删除
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTherapists.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
                显示 {filteredTherapists.length} 位按摩师 {searchQuery || selectedStatus ? `(已筛选，共${therapists.length}位)` : ''}
              </div>
            )}
          </div>
        </>
      )}

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除此按摩师吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量删除确认对话框 */}
      <Dialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认批量删除</DialogTitle>
            <DialogDescription>
              您确定要删除 {selectedTherapists.length} 位选中的按摩师吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchDeleteDialogOpen(false)} disabled={isBatchDeleting}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleBatchDelete} disabled={isBatchDeleting}>
              {isBatchDeleting ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量更新状态对话框 */}
      <Dialog open={isBatchUpdateDialogOpen} onOpenChange={setIsBatchUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更新按摩师状态</DialogTitle>
            <DialogDescription>
              请选择 {selectedTherapists.length} 位按摩师的新状态。
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 font-medium">新状态:</div>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  onClick={() => setNewWorkStatus('AVAILABLE')}
                  variant={newWorkStatus === 'AVAILABLE' ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-none ${newWorkStatus === 'AVAILABLE' ? 'bg-green-600 hover:bg-green-700' : 'text-green-600'}`}
                >
                  可预约
                </Button>
                <Button
                  onClick={() => setNewWorkStatus('WORKING')}
                  variant={newWorkStatus === 'WORKING' ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-none ${newWorkStatus === 'WORKING' ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600'}`}
                >
                  工作中
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchUpdateDialogOpen(false)}>
              取消
            </Button>
            <Button variant="default" onClick={handleBatchUpdate} disabled={isBatchUpdating}>
              {isBatchUpdating ? '更新中...' : '确认更新'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}