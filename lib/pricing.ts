export interface CreditPackage {
  id: string;
  credits: number;
  price: number; // in USD
  popular?: boolean;
}

export const creditPackages: CreditPackage[] = [
  { id: "starter", credits: 50, price: 5 },
  { id: "basic", credits: 150, price: 12 },
  { id: "growth", credits: 500, price: 35, popular: true },
  { id: "pro", credits: 1500, price: 89 },
  { id: "agency", credits: 5000, price: 249 },
];