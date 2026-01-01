'use client';

import { Plus } from 'lucide-react';

interface CreateFacilitatorCardProps {
  onClick: () => void;
}

export function CreateFacilitatorCard({ onClick }: CreateFacilitatorCardProps) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-dashed border-border rounded-lg p-5 hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center min-h-[200px] text-center"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Plus className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="font-medium">Create New Facilitator</p>
      <p className="text-sm text-muted-foreground mt-1">$5/month</p>
    </button>
  );
}
