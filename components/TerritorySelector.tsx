'use client';

interface TerritorySelectorProps {
  selected: string;
  onChange: (territory: string) => void;
  locale: 'en' | 'es';
}

const TERRITORIES = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'tech', label: 'Tech' },
  { id: 'nostr', label: 'Nostr' },
  { id: 'meta', label: 'Meta' },
  { id: 'recent', label: 'Recent' },
];

export function TerritorySelector({
  selected,
  onChange,
  locale,
}: TerritorySelectorProps) {
  const label = locale === 'es' ? 'Seleccionar Territorio' : 'Select Territory';

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TERRITORIES.map((territory) => (
          <button
            key={territory.id}
            onClick={() => onChange(territory.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selected === territory.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {territory.label}
          </button>
        ))}
      </div>
    </div>
  );
}
