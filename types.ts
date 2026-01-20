export interface FAQItem {
  question: string;
  answer: string; // Intentionally left blank or "—" as per requirements
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