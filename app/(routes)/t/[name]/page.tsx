import { TerritoryClient } from './TerritoryClient';

interface Props {
  params: { name: string };
}

export default function TerritoryPage({ params }: Props) {
  return <TerritoryClient name={decodeURIComponent(params.name)} />;
}
