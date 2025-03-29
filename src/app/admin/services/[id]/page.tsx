'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ServiceTranslation = {
  locale: string;
  name: string;
  description: string;
  slug: string;
};

type Service = {
  id: string;
  price: number;
  duration: number;
  imageUrl: string;
  translations: ServiceTranslation[];
  createdAt?: string;
  updatedAt?: string;
};

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  
  const [service, setService] = useState<Service | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [translations, setTranslations] = useState<ServiceTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch service data');
        }
        
        const data = await response.json();
        const serviceData = data.data;
        
        // Get translations for all supported languages
        const allTranslationsResponse = await Promise.all(
          ['zh', 'en', 'ko'].map(locale => 
            fetch(`/api/services/${id}?locale=${locale}`).then(res => res.json())
          )
        );
        
        const allTranslations = allTranslationsResponse.map((res, index) => ({
          locale: ['zh', 'en', 'ko'][index],
          name: res.data.name || '',
          description: res.data.description || '',
          slug: res.data.slug || '',
        }));
        
        setService(serviceData);
        setPrice(serviceData.price);
        setDuration(serviceData.duration);
        setImageUrl(serviceData.imageUrl);
        setTranslations(allTranslations);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch service data');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleTranslationChange = (locale: string, field: keyof ServiceTranslation, value: string) => {
    setTranslations(prevTranslations =>
      prevTranslations.map(translation =>
        translation.locale === locale
          ? { ...translation, [field]: value }
          : translation
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validate required fields
      for (const locale of ['zh', 'en', 'ko']) {
        const translation = translations.find(t => t.locale === locale);
        if (!translation?.name || !translation?.description) {
          throw new Error(`Please fill in the name and description for ${locale === 'zh' ? 'Chinese' : locale === 'en' ? 'English' : 'Korean'}`);
        }
      }

      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
          duration,
          imageUrl,
          translations,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to update service');
      }

      router.push('/admin/services');
    } catch (err: any) {
      setError(err.message || 'Failed to update service. Please try again later');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-500">{error}</div>
        <Link
          href="/admin/services"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Edit Service</h1>
        <Link
          href="/admin/services"
          className="text-gray-600 hover:text-gray-900"
        >
          Back to List
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (THB)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Translations</h2>
          <div className="space-y-6">
            {translations.map((translation) => (
              <div
                key={translation.locale}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  {translation.locale === 'zh' ? 'Chinese' : translation.locale === 'en' ? 'English' : 'Korean'}
                </h3>

                <div className="mb-4">
                  <label htmlFor={`name-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id={`name-${translation.locale}`}
                    value={translation.name}
                    onChange={(e) => handleTranslationChange(translation.locale, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`description-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id={`description-${translation.locale}`}
                    value={translation.description}
                    onChange={(e) => handleTranslationChange(translation.locale, 'description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`slug-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id={`slug-${translation.locale}`}
                    value={translation.slug}
                    onChange={(e) => handleTranslationChange(translation.locale, 'slug', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL slug is used to generate the service detail page URL. Only letters, numbers, hyphens and underscores are allowed.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/admin/services"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
} 