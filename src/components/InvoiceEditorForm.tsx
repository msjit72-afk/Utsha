import React, { useState } from 'react';
import { InvoiceData, InvoiceItem, PaymentMethod } from '../types/invoice';
import { numberToWordsIndian } from '../utils/numberToWords';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  User,
  CreditCard,
  Building,
  CheckCircle2,
  FileCheck,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';

interface InvoiceEditorFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onDownloadDocx: (options?: { includeTemplateImage?: boolean }) => void;
  onPrint: () => void;
  onSavePdf: () => void;
  onSaveImage: () => void;
  onLoadPreset: (presetKey: 'dubai' | 'bangkok' | 'blank') => void;
  templateStyle: 'vector' | 'photo';
  onChangeTemplateStyle: (style: 'vector' | 'photo') => void;
}

export const InvoiceEditorForm: React.FC<InvoiceEditorFormProps> = ({
  data,
  onChange,
  onDownloadDocx,
  onPrint,
  onSavePdf,
  onSaveImage,
  onLoadPreset,
  templateStyle,
  onChangeTemplateStyle,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'payment' | 'company'>('details');
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Field change helper
  const handleFieldChange = (field: keyof InvoiceData, value: any) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
  };

  // Items manipulation
  const handleAddItem = (presetDescription = '', presetAmount = '') => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slNo: data.items.length + 1,
      description: presetDescription,
      amount: presetAmount,
    };
    const newItems = [...data.items, newItem];
    const total = calculateTotal(newItems);
    onChange({
      ...data,
      items: newItems,
      amountInWords: total > 0 ? numberToWordsIndian(total) : data.amountInWords,
    });
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...data.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    const total = calculateTotal(updatedItems);
    onChange({
      ...data,
      items: updatedItems,
      amountInWords: total > 0 ? numberToWordsIndian(total) : data.amountInWords,
    });
  };

  const handleRemoveItem = (index: number) => {
    if (data.items.length <= 1) {
      const resetItems = [{ ...data.items[0], description: '', amount: '' }];
      onChange({ ...data, items: resetItems, amountInWords: '' });
      return;
    }
    const filtered = data.items.filter((_, i) => i !== index);
    const renumbered = filtered.map((item, idx) => ({ ...item, slNo: idx + 1 }));
    const total = calculateTotal(renumbered);
    onChange({
      ...data,
      items: renumbered,
      amountInWords: total > 0 ? numberToWordsIndian(total) : '',
    });
  };

  const calculateTotal = (items: InvoiceItem[]): number => {
    return items.reduce((acc, item) => {
      const val = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const currentTotal = calculateTotal(data.items);

  const handleDocxClick = async (includeImage = false) => {
    setIsExporting(true);
    try {
      await onDownloadDocx({ includeTemplateImage: includeImage });
      setStatusMessage('Word document (.docx) downloaded successfully!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const travelServicePresets = [
    { title: 'Air Tickets (Kolkata - Dubai Return)', amount: '34500' },
    { title: 'Hotel Accommodation (4 Nights / 5 Days with Breakfast)', amount: '28000' },
    { title: 'Tourist Visa & Overseas Travel Insurance', amount: '7500' },
    { title: 'Airport Transfers & Sightseeing City Tour', amount: '6200' },
    { title: 'Desert Safari with Dune Bashing & BBQ Dinner', amount: '4800' },
    { title: 'Thailand 5D4N Tour Package (Pattaya + Bangkok)', amount: '42000' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Top Banner / Actions Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#002b66] uppercase tracking-wider">
              Print & Export Controls
            </span>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Invoice Studio</span>
            </h2>
          </div>

          {/* Graphic Design Mode Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
            <button
              type="button"
              onClick={() => onChangeTemplateStyle('vector')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                templateStyle === 'vector'
                  ? 'bg-[#002b66] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Ultra-crisp vector graphics with gold accents"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>HD Vector</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTemplateStyle('photo')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                templateStyle === 'photo'
                  ? 'bg-[#002b66] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Original pre-printed stationary photo with typed text"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo Overlay</span>
            </button>
          </div>
        </div>

        {/* Big Action Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {/* Active Print Button */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            title="Open browser print dialog for A4 page"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>Print Invoice</span>
          </button>

          {/* Save as PDF */}
          <button
            type="button"
            onClick={onSavePdf}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            title="Download crisp A4 PDF document"
          >
            <FileCheck className="w-4 h-4 text-rose-200" />
            <span>Save as PDF</span>
          </button>

          {/* Download Word (.docx) */}
          <button
            type="button"
            onClick={() => handleDocxClick(false)}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#002b66] hover:bg-[#001733] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            title="Download editable Microsoft Word document"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Word (.docx)</span>
          </button>

          {/* Save as Image (PNG) */}
          <button
            type="button"
            onClick={onSaveImage}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            title="Download PNG for WhatsApp sharing"
          >
            <ImageIcon className="w-4 h-4 text-amber-200" />
            <span>Save Image</span>
          </button>
        </div>

        {statusMessage && (
          <div className="mt-2.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Quick Presets Strip */}
      <div className="px-4 py-2 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-700 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Quick Tour Samples:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onLoadPreset('dubai')}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#002b66] rounded font-bold transition-colors"
          >
            Dubai Holiday
          </button>
          <button
            onClick={() => onLoadPreset('bangkok')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded font-bold transition-colors"
          >
            Bangkok Tour
          </button>
          <button
            onClick={() => onLoadPreset('blank')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Blank Template</span>
          </button>
        </div>
      </div>

      {/* Editor Section Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/50 px-3">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'details'
              ? 'border-[#002b66] text-[#002b66] bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Customer & ID</span>
        </button>

        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'items'
              ? 'border-[#002b66] text-[#002b66] bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Services ({data.items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'payment'
              ? 'border-[#002b66] text-[#002b66] bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment & Words</span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'company'
              ? 'border-[#002b66] text-[#002b66] bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Agency & Signatory</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 overflow-y-auto max-h-[640px] space-y-4">
        {/* ================= TAB 1: CUSTOMER & DETAILS ================= */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={data.invoiceNo}
                  onChange={(e) => handleFieldChange('invoiceNo', e.target.value)}
                  placeholder="ITT/2026/042"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002b66] focus:border-[#002b66] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  placeholder="07/11/2026"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002b66] focus:border-[#002b66] outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Full Name
              </label>
              <input
                type="text"
                value={data.customerName}
                onChange={(e) => handleFieldChange('customerName', e.target.value)}
                placeholder="e.g. Mr. Amitav Banerjee"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002b66] focus:border-[#002b66] outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Passport Number
                </label>
                <input
                  type="text"
                  value={data.passportNo}
                  onChange={(e) => handleFieldChange('passportNo', e.target.value)}
                  placeholder="e.g. V8932410"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002b66] focus:border-[#002b66] outline-none uppercase font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ID Number (Aadhaar / Voter ID)
                </label>
                <input
                  type="text"
                  value={data.idNo}
                  onChange={(e) => handleFieldChange('idNo', e.target.value)}
                  placeholder="e.g. 7894 1230 4567"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002b66] focus:border-[#002b66] outline-none font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LINE ITEMS ================= */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {/* Quick Add Presets */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5 uppercase tracking-wider">
                Click to Insert Travel Service:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {travelServicePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddItem(preset.title, preset.amount)}
                    className="text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 px-2 py-1 rounded transition-colors text-left font-medium"
                  >
                    + {preset.title.split('(')[0]} (₹{parseInt(preset.amount).toLocaleString('en-IN')})
                  </button>
                ))}
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-2">
              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300"
                >
                  <span className="w-6 text-center text-xs font-extrabold text-[#002b66]">
                    {index + 1}.
                  </span>

                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                    placeholder="Service Description"
                    className="flex-1 text-xs sm:text-sm px-2.5 py-1.5 bg-white border border-slate-200 rounded focus:border-[#002b66] outline-none font-semibold"
                  />

                  <div className="relative w-28 sm:w-32">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleUpdateItem(index, 'amount', e.target.value)}
                      placeholder="0.00"
                      className="w-full text-right text-xs sm:text-sm pl-6 pr-2.5 py-1.5 bg-white border border-slate-200 rounded focus:border-[#002b66] outline-none tabular-nums font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleAddItem('', '')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#002b66] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold mr-2">Total Amount:</span>
                <span className="text-sm font-black text-[#002b66] tabular-nums">
                  ₹ {currentTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PAYMENT & WORDS ================= */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['cash', 'online'] as PaymentMethod[]).map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                      data.paymentMethod === method
                        ? 'border-[#002b66] bg-blue-50 text-[#002b66]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={data.paymentMethod === method}
                      onChange={() => handleFieldChange('paymentMethod', method)}
                      className="sr-only"
                    />
                    <span className="capitalize text-sm font-bold">
                      {method === 'cash' ? '💵 Cash' : '💳 Online (UPI / Card / NetBanking)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Amount in Words
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleFieldChange(
                      'amountInWords',
                      currentTotal > 0 ? numberToWordsIndian(currentTotal) : ''
                    )
                  }
                  className="text-[11px] text-[#002b66] hover:underline font-bold"
                >
                  Auto-Convert from Total
                </button>
              </div>
              <textarea
                rows={2}
                value={data.amountInWords}
                onChange={(e) => handleFieldChange('amountInWords', e.target.value)}
                placeholder="e.g. Rupees Eighty-Two Thousand Three Hundred Only"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002b66] focus:border-[#002b66] outline-none italic font-semibold"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 4: COMPANY & SIGNATORY ================= */}
        {activeTab === 'company' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Agency Name
              </label>
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Agency Address
              </label>
              <input
                type="text"
                value={data.companyAddress}
                onChange={(e) => handleFieldChange('companyAddress', e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={data.companyPhone}
                  onChange={(e) => handleFieldChange('companyPhone', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md font-bold text-[#002b66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={data.slogan}
                  onChange={(e) => handleFieldChange('slogan', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md italic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Authorized Signatory Name
                </label>
                <input
                  type="text"
                  value={data.signatoryName}
                  onChange={(e) => handleFieldChange('signatoryName', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md font-bold text-[#002b66]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Title
                </label>
                <input
                  type="text"
                  value={data.signatoryTitle}
                  onChange={(e) => handleFieldChange('signatoryTitle', e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Tip Strip */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[#002b66]">💡 Print Tip:</span>
          <span>In the print window, enable <strong className="text-slate-800">"Background graphics"</strong> for 100% full rich colors.</span>
        </div>

        <button
          type="button"
          onClick={() => handleDocxClick(true)}
          className="text-xs text-[#002b66] hover:underline font-bold flex items-center gap-1 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Word (.docx) + Original Artwork</span>
        </button>
      </div>
    </div>
  );
};
