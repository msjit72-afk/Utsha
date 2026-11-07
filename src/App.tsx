/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InvoiceData, InvoiceItem } from './types/invoice';
import { generateWordDocument } from './utils/docxGenerator';
import { numberToWordsIndian } from './utils/numberToWords';
import { exportInvoiceToPdf, exportInvoiceToImage, triggerDirectPrint } from './utils/printPdfExporter';
import { HeaderNav } from './components/HeaderNav';
import { InvoiceSheet } from './components/InvoiceSheet';
import { InvoiceEditorForm } from './components/InvoiceEditorForm';
import { TemplateComparator } from './components/TemplateComparator';
import {
  FileText,
  Printer,
  Eye,
  Edit3,
  Download,
  Info,
  FileCheck,
  Image as ImageIcon,
  Palette,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const defaultInvoiceData: InvoiceData = {
  invoiceNo: 'ITT-2026-104',
  date: '07/11/2026',
  customerName: 'Mr. Amitav Banerjee',
  passportNo: 'V8932410',
  idNo: '7894 1230 4567',
  items: [
    {
      id: 'item-1',
      slNo: 1,
      description: 'Return Air Tickets (Kolkata CCU - Dubai DXB - Kolkata CCU)',
      amount: '36500',
    },
    {
      id: 'item-2',
      slNo: 2,
      description: '4-Star Luxury Hotel Accommodation (4 Nights / 5 Days with Breakfast)',
      amount: '28000',
    },
    {
      id: 'item-3',
      slNo: 3,
      description: 'UAE Tourist Visa Assistance & Comprehensive Travel Insurance',
      amount: '7500',
    },
    {
      id: 'item-4',
      slNo: 4,
      description: 'Private Airport Transfers & Half-Day Dubai Guided City Tour',
      amount: '5500',
    },
    {
      id: 'item-5',
      slNo: 5,
      description: 'Desert Safari with Dune Bashing, Camel Ride & BBQ Dinner',
      amount: '4800',
    },
  ],
  paymentMethod: 'online',
  amountInWords: 'Rupees Eighty-Two Thousand Three Hundred Only',
  companyName: 'INTERNATIONAL TOUR AND TRAVEL',
  companyAddress: 'E42, Mukundapur Bazar, Kolkata – 700099',
  companyPhone: '8420512151',
  slogan: 'Explore the World with Us...',
  signatoryName: 'UTSHA',
  signatoryTitle: 'Proprietor',
};

const blankTemplateData: InvoiceData = {
  invoiceNo: '',
  date: '',
  customerName: '',
  passportNo: '',
  idNo: '',
  items: [
    { id: 'item-1', slNo: 1, description: '', amount: '' },
    { id: 'item-2', slNo: 2, description: '', amount: '' },
    { id: 'item-3', slNo: 3, description: '', amount: '' },
    { id: 'item-4', slNo: 4, description: '', amount: '' },
    { id: 'item-5', slNo: 5, description: '', amount: '' },
  ],
  paymentMethod: 'cash',
  amountInWords: '',
  companyName: 'INTERNATIONAL TOUR AND TRAVEL',
  companyAddress: 'E42, Mukundapur Bazar, Kolkata – 700099',
  companyPhone: '8420512151',
  slogan: 'Explore the World with Us...',
  signatoryName: 'UTSHA',
  signatoryTitle: 'Proprietor',
};

const bangkokTourData: InvoiceData = {
  invoiceNo: 'ITT-2026-105',
  date: '07/11/2026',
  customerName: 'Mrs. Sreyashi Das & Family',
  passportNo: 'Z4109823',
  idNo: '9012 3456 7890',
  items: [
    {
      id: 'item-1',
      slNo: 1,
      description: 'Flight Booking (Kolkata - Bangkok Suvarnabhumi Return)',
      amount: '29800',
    },
    {
      id: 'item-2',
      slNo: 2,
      description: 'Pattaya 2N + Bangkok 2N Deluxe Resort Package (Breakfast included)',
      amount: '31500',
    },
    {
      id: 'item-3',
      slNo: 3,
      description: 'Coral Island Tour with Speedboat & Indian Lunch',
      amount: '4200',
    },
    {
      id: 'item-4',
      slNo: 4,
      description: 'Chao Phraya Princess Luxury Dinner Cruise',
      amount: '3600',
    },
    {
      id: 'item-5',
      slNo: 5,
      description: 'Thailand Visa on Arrival Assistance & Foreign Exchange',
      amount: '5900',
    },
  ],
  paymentMethod: 'online',
  amountInWords: 'Rupees Seventy-Five Thousand Only',
  companyName: 'INTERNATIONAL TOUR AND TRAVEL',
  companyAddress: 'E42, Mukundapur Bazar, Kolkata – 700099',
  companyPhone: '8420512151',
  slogan: 'Explore the World with Us...',
  signatoryName: 'UTSHA',
  signatoryTitle: 'Proprietor',
};

export default function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(defaultInvoiceData);
  const [activeView, setActiveView] = useState<'editor' | 'compare' | 'preview'>('editor');
  const [templateStyle, setTemplateStyle] = useState<'vector' | 'photo'>('vector');
  const [isEditableInline, setIsEditableInline] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownloadDocx = async (options: { includeTemplateImage?: boolean } = {}) => {
    setIsProcessing(true);
    try {
      await generateWordDocument(invoice, options);
      showToast('Microsoft Word (.docx) downloaded successfully!');
    } catch (err) {
      console.error('Word doc generation error:', err);
      showToast('Could not generate Word document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadBlankDocx = async () => {
    setIsProcessing(true);
    try {
      await generateWordDocument(blankTemplateData, {
        filename: 'International_Tour_Travel_Blank_Template.docx',
      });
      showToast('Blank Word Template (.docx) downloaded!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = async () => {
    // 1. First trigger print
    try {
      triggerDirectPrint();
      showToast('Print dialog triggered! (Enable "Background graphics" for rich color)');
    } catch (err) {
      console.warn('Browser blocked print dialog, generating A4 PDF:', err);
      showToast('Browser blocked dialog, downloading print-ready A4 PDF...');
      await handleSavePdf();
    }
  };

  const handleSavePdf = async () => {
    setIsProcessing(true);
    try {
      showToast('Rendering high-definition A4 PDF...');
      const numClean = invoice.invoiceNo ? invoice.invoiceNo.replace(/[^a-zA-Z0-9_-]/g, '') : 'ITT';
      await exportInvoiceToPdf('invoice-sheet', `Invoice_${numClean}_International_Tour_Travel.pdf`);
      showToast('PDF successfully downloaded!');
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Failed to export PDF. Try Print > Save as PDF instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveImage = async () => {
    setIsProcessing(true);
    try {
      showToast('Rendering high-resolution image for WhatsApp...');
      const numClean = invoice.invoiceNo ? invoice.invoiceNo.replace(/[^a-zA-Z0-9_-]/g, '') : 'ITT';
      await exportInvoiceToImage('invoice-sheet', `Invoice_${numClean}_International_Tour_Travel.png`);
      showToast('PNG image successfully downloaded!');
    } catch (err) {
      console.error('Image export error:', err);
      showToast('Failed to export image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadPreset = (presetKey: 'dubai' | 'bangkok' | 'blank') => {
    if (presetKey === 'dubai') {
      setInvoice({ ...defaultInvoiceData });
      showToast('Loaded Dubai Holiday package');
    } else if (presetKey === 'bangkok') {
      setInvoice({ ...bangkokTourData });
      showToast('Loaded Bangkok-Pattaya Tour package');
    } else {
      setInvoice({ ...blankTemplateData });
      showToast('Loaded Blank Template');
    }
  };

  const handleFieldChange = (field: keyof InvoiceData, value: any) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setInvoice((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      const total = items.reduce((acc, it) => {
        const val = typeof it.amount === 'string' ? parseFloat(it.amount) : it.amount;
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
      return {
        ...prev,
        items,
        amountInWords: total > 0 ? numberToWordsIndian(total) : prev.amountInWords,
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Bar strictly conforming to Top Bar Contract */}
      <HeaderNav
        activeView={activeView}
        onSelectView={setActiveView}
        onDownloadDocx={() => handleDownloadDocx()}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002b66] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-400 no-print animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {/* VIEW 1: EDITOR WORKSPACE (Default) */}
        {activeView === 'editor' && (
          <div className="space-y-6">
            {/* Action Bar & Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002b66] to-[#001733] flex items-center justify-center text-amber-400 font-black text-xl shadow-xs">
                  ✈
                </div>
                <div>
                  <h2 className="text-base font-black text-[#002b66] leading-tight">
                    International Tour and Travel • Invoice Studio
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    E42, Mukundapur Bazar, Kolkata – 700099 | Phone: 8420512151
                  </p>
                </div>
              </div>

              {/* Master Print & Download Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. PRINT BUTTON (ACTIVE & PROMINENT) */}
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
                  title="Direct A4 Print (Ctrl + P)"
                >
                  <Printer className="w-4 h-4 text-emerald-200" />
                  <span>Print Now</span>
                </button>

                {/* 2. SAVE AS PDF */}
                <button
                  onClick={handleSavePdf}
                  disabled={isProcessing}
                  className="px-3.5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  title="Download direct PDF file"
                >
                  <FileCheck className="w-4 h-4 text-rose-200" />
                  <span>PDF</span>
                </button>

                {/* 3. DOWNLOAD WORD (.DOCX) */}
                <button
                  onClick={() => handleDownloadDocx()}
                  disabled={isProcessing}
                  className="px-4 py-2.5 bg-[#002b66] hover:bg-[#001733] text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  title="Download editable Microsoft Word document"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Word (.docx)</span>
                </button>

                {/* 4. SAVE IMAGE (PNG) */}
                <button
                  onClick={handleSaveImage}
                  disabled={isProcessing}
                  className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  title="Download high-resolution image for WhatsApp"
                >
                  <ImageIcon className="w-4 h-4 text-amber-200" />
                  <span>PNG</span>
                </button>

                {/* 5. Direct Inline Editing Toggle */}
                <button
                  onClick={() => setIsEditableInline(!isEditableInline)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isEditableInline
                      ? 'bg-amber-100 text-amber-900 border border-amber-400'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Type directly into the invoice paper"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditableInline ? 'Direct Edit: ON' : 'Direct Edit'}</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Left Form Controls, Right Live Invoice Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form Controls (5 cols) */}
              <div className="lg:col-span-5 no-print">
                <InvoiceEditorForm
                  data={invoice}
                  onChange={setInvoice}
                  onDownloadDocx={handleDownloadDocx}
                  onPrint={handlePrint}
                  onSavePdf={handleSavePdf}
                  onSaveImage={handleSaveImage}
                  onLoadPreset={handleLoadPreset}
                  templateStyle={templateStyle}
                  onChangeTemplateStyle={setTemplateStyle}
                />

                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-emerald-700" />
                    <span>Print Quality Guarantee:</span>
                  </div>
                  <p>
                    The print layout is configured with <code>@media print</code>, <code>size: A4 portrait</code>, and <code>print-color-adjust: exact</code>. It will print with the exact royal navy headers, gold ribbons, watermark, and footer without cutting off.
                  </p>
                </div>
              </div>

              {/* Right Column: Live High-Fidelity Invoice Sheet Preview (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                {/* Preview Toolbar */}
                <div className="w-full flex flex-wrap items-center justify-between mb-2 px-1 text-xs text-slate-600 gap-2 no-print">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#002b66] flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Live Print Sheet Preview</span>
                    </span>

                    {/* Graphic Style Switcher */}
                    <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-300">
                      <span className="text-[11px] text-slate-500 font-semibold">Graphic:</span>
                      <button
                        onClick={() => setTemplateStyle('vector')}
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          templateStyle === 'vector' ? 'bg-[#002b66] text-white' : 'text-slate-700'
                        }`}
                      >
                        HD Vector
                      </button>
                      <button
                        onClick={() => setTemplateStyle('photo')}
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          templateStyle === 'photo' ? 'bg-[#002b66] text-white' : 'text-slate-700'
                        }`}
                      >
                        Photo Overlay
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Sheet</span>
                    </button>
                    <button
                      onClick={handleSavePdf}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <FileCheck className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Printable Invoice Sheet Container */}
                <div className="w-full overflow-x-auto flex justify-center py-2">
                  <InvoiceSheet
                    data={invoice}
                    onChangeField={handleFieldChange}
                    onUpdateItem={handleUpdateItem}
                    isEditableInline={isEditableInline}
                    templateStyle={templateStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TEMPLATE COMPARATOR */}
        {activeView === 'compare' && (
          <TemplateComparator
            data={invoice}
            onDownloadDocx={() => handleDownloadDocx()}
            onBackToEditor={() => setActiveView('editor')}
          />
        )}

        {/* VIEW 3: FULL PAGE PRINT / PREVIEW VIEW */}
        {activeView === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print">
              <div>
                <h3 className="font-extrabold text-[#002b66] text-lg">
                  Full Page A4 Print View
                </h3>
                <p className="text-xs text-slate-500">
                  Ready for physical printing or saving as high-resolution PDF.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4 text-emerald-200" />
                  <span>Print Document Now</span>
                </button>
                <button
                  onClick={handleSavePdf}
                  className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <FileCheck className="w-4 h-4 text-rose-200" />
                  <span>Save as PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadDocx()}
                  className="px-4 py-2.5 bg-[#002b66] hover:bg-[#001733] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Word (.docx)</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center py-4">
              <InvoiceSheet
                data={invoice}
                isEditableInline={false}
                templateStyle={templateStyle}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <span>International Tour and Travel • E42, Mukundapur Bazar, Kolkata – 700099 • 8420512151</span>
          <span>A4 Print Ready · Microsoft Word (.docx) · Vector PDF</span>
        </div>
      </footer>
    </div>
  );
}
