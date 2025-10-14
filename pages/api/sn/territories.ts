import type { NextApiRequest, NextApiResponse } from 'next';
import { executeStackerQuery, StackerNewsError } from '@/lib/server/stacker';
import type { TerritorySummary } from '@/lib/sn/types';

interface TerritoryNode {
  id?: string;
  name?: string;
  slug?: string;
  title?: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
}

interface TerritoriesData {
  territories?: TerritoryNode[];
  allTerritories?: TerritoryNode[];
  listTerritories?: TerritoryNode[];
}

interface TerritoryResponseBody {
  territories: TerritorySummary[];
  error?: string;
}

const TERRITORIES_QUERY = /* GraphQL */ `
  query MiniAppTerritories {
    territories: allTerritories {
      id
      name
      slug
      title
      description
      icon
      image
    }
  }
`;

function normalizeTerritories(data: TerritoriesData | undefined): TerritorySummary[] {
  const rawTerritories =
    data?.territories || data?.allTerritories || data?.listTerritories || [];

  return rawTerritories
    .filter(Boolean)
    .map((territory) => {
      const slug =
        territory?.slug || territory?.name || territory?.id || 'unknown-territory';

      return {
        id: territory?.id || slug,
        slug,
        title: territory?.title || territory?.name || slug,
        description: territory?.description || undefined,
        icon: territory?.icon || territory?.image || null,
      } satisfies TerritorySummary;
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TerritoryResponseBody>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ territories: [], error: 'Method not allowed' });
  }

  try {
    const data = await executeStackerQuery<TerritoriesData>(TERRITORIES_QUERY);
    const territories = normalizeTerritories(data);

    return res.status(200).json({ territories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error fetching territories';

    if (error instanceof StackerNewsError) {
      return res.status(200).json({ territories: [], error: message });
    }

    return res.status(500).json({ territories: [], error: message });
  }
}
