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
  createdAt?: string;
  updatedAt?: string;
};

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState('zh'); // 默认显示中文
  const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // 获取按摩师列表
  const fetchTherapists = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/therapists?locale=${locale}`);
      
      if (!response.ok) {
        throw new Error(`获取按摩师列表失败: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || '获取按摩师列表失败');
      }
      
      setTherapists(data.data || []);
    } catch (err: any) {
      setError(err.message || '获取按摩师列表失败');
    } finally {
      setLoading(false);
      setSelectedTherapists([]);
    }
  };

  // 当locale变化时，重新获取数据
  useEffect(() => {
    fetchTherapists();
  }, [locale]);

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
        throw new Error(errorData.error?.message || `删除按摩师失败: ${response.status}`);
      }
      
      toast.success('按摩师已成功删除');
      // 重新获取列表
      fetchTherapists();
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || '删除按摩师失败');
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
        throw new Error(errorData.error?.message || `批量删除失败: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message || `成功删除 ${selectedTherapists.length} 个按摩师`);
      
      // 重新获取列表
      fetchTherapists();
      setIsBatchDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || '批量删除按摩师失败');
    } finally {
      setIsBatchDeleting(false);
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

  // 处理语言切换
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 根据搜索关键词过滤按摩师列表
  const filteredTherapists = therapists.filter(therapist => {
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
        <h1 className="text-2xl font-semibold">按摩师管理</h1>
        <div className="flex items-center space-x-4">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              onClick={() => handleLocaleChange('zh')}
              variant={locale === 'zh' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none"
            >
              中文
            </Button>
            <Button
              onClick={() => handleLocaleChange('en')}
              variant={locale === 'en' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none"
            >
              英文
            </Button>
            <Button
              onClick={() => handleLocaleChange('ko')}
              variant={locale === 'ko' ? 'default' : 'outline'}
              size="sm"
              className="rounded-none"
            >
              韩文
            </Button>
          </div>
          <Button asChild>
            <Link href="/admin/therapists/new">
              添加按摩师
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
              <Button
                onClick={handleBatchDeleteClick}
                disabled={isBatchDeleting}
                variant="destructive"
                size="sm"
              >
                {isBatchDeleting ? '处理中...' : `删除所选 (${selectedTherapists.length})`}
              </Button>
            )}
            <Button
              onClick={fetchTherapists}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              刷新
            </Button>
          </div>

          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="搜索按摩师姓名、专长、经验年限..."
              className="w-64"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      ) : 

      therapists.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <p className="text-yellow-700">暂无按摩师数据</p>
          <Link
            href="/admin/therapists/new"
            className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            添加第一个按摩师
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
                  按摩师
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  专长
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  经验
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTherapists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    没有找到匹配的按摩师
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
                      <div className="text-sm text-gray-900">{therapist.experienceYears} 年</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button asChild variant="link" size="sm" className="mr-2">
                        <Link href={`/admin/therapists/${therapist.id}`}>
                          编辑
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(therapist.id)}
                        variant="link"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredTherapists.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
              显示 {filteredTherapists.length} 个按摩师 {searchQuery ? `(已过滤，共 ${therapists.length} 个)` : ''}
            </div>
          )}
        </div>
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
              您确定要删除选中的 {selectedTherapists.length} 个按摩师吗？此操作无法撤销。
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
    </div>
  );
}
