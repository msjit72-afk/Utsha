export interface InvoiceItem {
  id: string;
  slNo: number;
  description: string;
  amount: number | string;
}

export type PaymentMethod = 'cash' | 'online' | 'bank';

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  customerName: string;
  passportNo: string;
  idNo: string;
  items: InvoiceItem[];
  paymentMethod: PaymentMethod;
  amountInWords: string;
  // Company details
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  slogan: string;
  signatoryName: string;
  signatoryTitle: string;
  notes?: string;
}

export interface SavedInvoice {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: InvoiceData;
}
