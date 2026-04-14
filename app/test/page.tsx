import { prisma } from '@/lib/prisma';

export default async function Page() {
  const maintain = await prisma.assetMaintenance.findMany();

  return (
    <ul>
      {maintain.map(AssetMaintenance => <li key={AssetMaintenance.maintenance_id}>{AssetMaintenance.condition}</li>)}
    </ul>
  );
}
