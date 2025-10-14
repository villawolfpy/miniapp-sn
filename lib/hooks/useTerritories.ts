'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TerritorySummary, TerritoriesApiResponse } from '@/lib/sn/types';

interface TerritoriesState {
  territories: TerritorySummary[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

async function fetchTerritories(): Promise<TerritoriesApiResponse> {
  const response = await fetch('/api/sn/territories');
  if (!response.ok) {
    throw new Error(`Failed to load territories (${response.status})`);
  }

  return (await response.json()) as TerritoriesApiResponse;
}

export function useTerritories(): TerritoriesState {
  const [territories, setTerritories] = useState<TerritorySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTerritories();
      setTerritories(data.territories);
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setTerritories([]);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    territories,
    loading,
    error,
    reload: load,
  };
}
