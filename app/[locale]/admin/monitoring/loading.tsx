import { Card } from '@bze/ui';

export default function MonitoringLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="h-6 w-56 animate-pulse rounded bg-border" />
      <Card>
        <div className="h-10 animate-pulse rounded-xl bg-border" />
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-border" />
            <div className="mt-2 h-6 w-20 animate-pulse rounded bg-border" />
          </Card>
        ))}
      </div>
      <Card>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-border" />
          ))}
        </div>
      </Card>
    </div>
  );
}
