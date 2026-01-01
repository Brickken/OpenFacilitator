'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api, type Facilitator } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CreateFacilitatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (facilitator: Facilitator) => void;
  walletBalance?: string;
}

export function CreateFacilitatorModal({
  open,
  onOpenChange,
  onSuccess,
  walletBalance,
}: CreateFacilitatorModalProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; customDomain: string }) => {
      // 1. Purchase subscription for new facilitator
      const purchaseResult = await api.purchaseSubscription();

      if (!purchaseResult.success) {
        if (purchaseResult.insufficientBalance) {
          throw new Error(`Insufficient balance. You need $${purchaseResult.required} USDC but only have $${purchaseResult.available}.`);
        }
        throw new Error(purchaseResult.error || 'Failed to purchase subscription');
      }

      // 2. Create the facilitator
      const facilitator = await api.createFacilitator({
        ...data,
        subdomain: data.customDomain.replace(/\./g, '-'),
      });

      // 3. Set up the domain on Railway
      await api.setupDomain(facilitator.id);

      return facilitator;
    },
    onSuccess: (facilitator) => {
      queryClient.invalidateQueries({ queryKey: ['facilitators'] });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['billingWallet'] });
      onSuccess(facilitator);
      onOpenChange(false);
      setName('');
      setDomain('');
    },
    onError: (error) => {
      toast({
        title: 'Failed to create facilitator',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  const handleCreate = () => {
    if (!name.trim() || !domain.trim()) return;
    createMutation.mutate({
      name: name.trim(),
      customDomain: domain.trim(),
    });
  };

  const balance = parseFloat(walletBalance || '0');
  const hasEnoughBalance = balance >= 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Facilitator</DialogTitle>
          <DialogDescription>
            Set up a new x402 facilitator with your own domain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Internal name for your reference
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="pay.yourdomain.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
            />
            <p className="text-xs text-muted-foreground">
              You'll need to configure DNS after creation
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Monthly cost</span>
              <span className="font-semibold">$5.00 USDC</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Charged from your billing wallet. First charge today.
            </p>
            {!hasEnoughBalance && (
              <p className="text-xs text-destructive">
                Insufficient balance. You have ${walletBalance || '0.00'} USDC.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || !domain.trim() || !hasEnoughBalance || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Facilitator'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
