import React from 'react';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = "", narrow = false }) => {
  return (
    <section id={id} className={`py-20 md:py-24 ${className}`}>
      <div className={`mx-auto px-6 ${narrow ? 'max-w-3xl' : 'max-w-4xl'}`}>
        {children}
      </div>
    </section>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-serif text-corporate-900 mb-10 md:mb-12 border-b border-corporate-200 pb-4 inline-block pr-12">
    {children}
  </h2>
);