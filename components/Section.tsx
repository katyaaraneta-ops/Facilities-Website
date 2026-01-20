import React from 'react';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = "", narrow = false }) => {
  return (
    <section id={id} className={`py-20 md:py-32 ${className}`}>
      <div className={`mx-auto px-6 md:px-12 ${narrow ? 'max-w-4xl' : 'max-w-6xl'}`}>
        {children}
      </div>
    </section>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-corporate-900 mb-12 md:mb-16">
    {children}
  </h2>
);