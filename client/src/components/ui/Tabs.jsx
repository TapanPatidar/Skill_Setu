import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils.js';

const TabsContext = createContext(null);

export const Tabs = ({ value, defaultValue, onValueChange, className, children }) => {
  const [selected, setSelected] = useState(value !== undefined ? value : defaultValue);

  const currentValue = value !== undefined ? value : selected;
  const handleChange = (val) => {
    if (value === undefined) setSelected(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 p-1.5 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] select-none',
        className
      )}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used inside Tabs');

  const isSelected = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onChange(value)}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF]',
        isSelected
          ? 'bg-white text-[#0F172A] shadow-sm font-semibold'
          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used inside Tabs');

  if (context.value !== value) return null;

  return <div className={cn('mt-4 focus-visible:outline-none', className)}>{children}</div>;
};
