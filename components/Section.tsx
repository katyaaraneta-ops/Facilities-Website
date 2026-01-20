import React from 'react';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = "", narrow = false }) => {
  return (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
      {/* 
         narrow: max-w-[800px] strictly for reading columns
         default: max-w-[1024px] for wider layouts if needed (though mostly unused in this design)
      */}
      <div className={`mx-auto px-6 ${narrow ? 'max-w-[840px]' : 'max-w-5xl'}`}>
        {children}
      </div>
    </section>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-serif text-corporate-900 mb-12 md:mb-16 border-b border-corporate-200 pb-6 inline-block pr-16 leading-tight">
    {children}
  </h2>
);