
import React from 'react';
import { EmptyState as EmptyStateType } from '@/types';
import { Button } from '@/components/ui/button';

interface EmptyStateProps extends EmptyStateType {
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  action, 
  icon, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="mx-auto w-12 h-12 text-muted-foreground mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="default">
          {action.label}
        </Button>
      )}
    </div>
  );
}
