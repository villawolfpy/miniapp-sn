'use client';

import type { TerritorySummary } from '@/lib/sn/types';

interface TerritorySelectorProps {
  territories: TerritorySummary[];
  selected: string | null;
  onChange: (territory: string) => void;
  locale: 'en' | 'es';
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function TerritorySelector({
  territories,
  selected,
  onChange,
  locale,
  loading = false,
  error = null,
  onRetry,
}: TerritorySelectorProps) {
  const label = locale === 'es' ? 'Seleccionar Territorio' : 'Select Territory';
  const loadingText = locale === 'es' ? 'Cargando territorios...' : 'Loading territories...';
  const retryText = locale === 'es' ? 'Reintentar' : 'Retry';

  if (loading) {
    return (
      <div className="mb-4">
        <p className="text-sm text-gray-500">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <p className="text-sm text-red-600 mb-2">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    );
  }

  if (!territories.length) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {territories.map((territory) => {
          const isSelected = territory.slug === selected;
          return (
            <button
              key={territory.id}
              onClick={() => onChange(territory.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {territory.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
