'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

type Service = {
  id: string;
  price: number;
  duration: number;
  imageUrl: string;
  name: string;
  description: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // Fetch services list
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/services?locale=en');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
      setSelectedServices([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Delete single service
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete service: ${response.status}`);
      }
      
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service');
    }
  };

  // Batch delete services
  const handleBatchDelete = async () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedServices.length} selected services? This action cannot be undone.`)) return;
    
    try {
      setIsBatchDeleting(true);
      const response = await fetch('/api/services', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          serviceIds: selectedServices
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Batch deletion failed: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message || `Successfully deleted ${selectedServices.length} services`);
      
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete services');
    } finally {
      setIsBatchDeleting(false);
    }
  };

  // Handle select/deselect all services
  const handleSelectAll = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map(service => service.id));
    }
  };

  // Handle select/deselect single service
  const handleSelectService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter services based on search query
  const filteredServices = services.filter(service => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.price.toString().includes(query) ||
      service.duration.toString().includes(query)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Services Management</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/services/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg font-medium text-base"
          >
            <PlusCircle className="w-5 h-5" />
            Add Service
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md">
          <div className="text-red-500">{error}</div>
        </div>
      )}
      
      {!loading && services.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            {selectedServices.length > 0 && (
              <button
                onClick={handleBatchDelete}
                disabled={isBatchDeleting}
                className="flex items-center bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBatchDeleting ? 'Processing...' : `Delete Selected (${selectedServices.length})`}
              </button>
            )}
            <button
              onClick={fetchServices}
              disabled={loading}
              className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search services..."
              className="border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      ) : (
        services.length === 0 ? (
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <p className="text-yellow-700">No services found</p>
            <Link
              href="/admin/services/new"
              className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
            >
              Add First Service
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.length > 0 && selectedServices.length === filteredServices.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                      No matching services found
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="w-12 px-4 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleSelectService(service.id)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative">
                            <Image
                              src={service.imageUrl}
                              alt={service.name}
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.price.toLocaleString()} THB</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.duration} minutes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredServices.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
                Showing {filteredServices.length} services {searchQuery ? `(filtered from ${services.length})` : ''}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}