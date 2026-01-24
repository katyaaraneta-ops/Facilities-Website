import React from 'react';

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface WhyItem {
  title: string;
  description: string; // Intentionally left blank or "—"
}

export interface OperationStep {
  step: string;
  title: string;
  description: string; // Intentionally left blank
}

export interface Asset {
  name: string;
  location: string;
  scope: string;
  imageUrl: string;
}