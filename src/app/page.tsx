import Image from "next/image";

import { DrillCanvas } from '@/components/DrillCanvas/DrillCanvas';

export default function Home() {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Futbol Drill Tasarımı</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <DrillCanvas width={800} height={600} />
        </div>
      </main>
    </div>
  );
}
