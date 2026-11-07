import React from 'react';
import { Download, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { InvoiceSheet } from './InvoiceSheet';

interface TemplateComparatorProps {
  data: InvoiceData;
  onDownloadDocx: () => void;
  onBackToEditor: () => void;
}

export const TemplateComparator: React.FC<TemplateComparatorProps> = ({
  data,
  onDownloadDocx,
  onBackToEditor,
}) => {
  const originalImagePath =
    '/assets/aistudio/WhatsApp_Image_2026-11-07_at_2.01.35_AM_a450b00a.jpeg';

  const convertedElements = [
    {
      title: 'Company Header & Contact',
      source: 'International Tour and Travel • Mukundapur Bazar, Kolkata • 8420512151',
      status: 'Converted to editable Word typography & layout',
    },
    {
      title: 'Invoice Metadata Box',
      source: 'Invoice No. & Date in gold ornamental framed container',
      status: 'Converted to dynamic Word table fields',
    },
    {
      title: 'Customer Details Strip',
      source: 'Customer Name, Passport No. & ID No.',
      status: 'Fully editable text lines with tabular alignment',
    },
    {
      title: 'Itemized Services Table',
      source: 'Sl. No., Service Description and Service, Amount (₹) with 5+ rows',
      status: 'Native Microsoft Word table with Navy (#003366) headers',
    },
    {
      title: 'Total Amount & In Words',
      source: 'Total Amount box + Indian Rupee words (Lakhs / Thousands)',
      status: 'Auto-calculated mathematical totals + Rupee words generator',
    },
    {
      title: 'Seal & Authorized Signatory',
      source: 'UTSHA Proprietor signature block & circular agency stamp',
      status: 'Official signature block and text seal ready for signing',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Introduction banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-1">
            Conversion Verification & Inspection
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Image Template to Microsoft Word (.docx) Conversion
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Compare the scanned photo template with the digital recreated document. You can download the editable Microsoft Word (.docx) file directly or continue editing the customer and service details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onDownloadDocx}
            className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download .DOCX</span>
          </button>
          <button
            onClick={onBackToEditor}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <span>Open Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Original Template Photo */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-slate-900 text-base">
                1. Original Uploaded Image Template
              </h3>
            </div>
            <a
              href={originalImagePath}
              download="Original_Invoice_Template.jpeg"
              className="text-xs text-[#003366] hover:underline font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </a>
          </div>

          <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 p-2 flex justify-center">
            <img
              src={originalImagePath}
              alt="Original International Tour and Travel Invoice Template"
              className="w-full max-h-[900px] object-contain rounded shadow-sm"
            />
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            Source: WhatsApp image uploaded for International Tour and Travel, Kolkata.
          </div>
        </div>

        {/* Right: Digital Interactive Version */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-slate-900 text-base">
                2. Converted Digital Document
              </h3>
            </div>
            <button
              onClick={onDownloadDocx}
              className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 font-semibold flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export as .docx</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 overflow-x-auto max-h-[900px] overflow-y-auto">
            <div className="transform scale-[0.85] sm:scale-100 origin-top">
              <InvoiceSheet data={data} isEditableInline={false} />
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-200">
            Exported as authentic Microsoft Word document (.docx) with formatted tables, headers, and custom font styling.
          </div>
        </div>
      </div>

      {/* Feature Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Template Elements Converted to Word
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {convertedElements.map((el, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h4 className="text-sm font-bold text-slate-900">{el.title}</h4>
              </div>
              <p className="text-xs text-slate-600 mb-2 font-mono">{el.source}</p>
              <span className="text-[11px] font-semibold text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                {el.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
