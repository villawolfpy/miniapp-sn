'use client';

interface TerritorySelectorProps {
  territories: Array<{ id: string; name: string }>;
  selected: string;
  onChange: (territory: string) => void;
  locale: 'en' | 'es';
}

/**
 * Displays the list of territories as a horizontally scrollable pill menu.
 */
export function TerritorySelector({ territories, selected, onChange, locale }: TerritorySelectorProps) {
  const label = locale === 'es' ? 'Seleccionar Territorio' : 'Select Territory';
  const loadingLabel = locale === 'es' ? 'Cargando territorios…' : 'Loading territories…';

  if (territories.length === 0) {
    return (
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">{label}</label>
        <div className="rounded-lg border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500">
          {loadingLabel}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {territories.map((territory) => (
          <button
            key={territory.id}
            onClick={() => onChange(territory.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selected === territory.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {territory.name}
          </button>
        ))}
      </div>
    </div>
  );
}
