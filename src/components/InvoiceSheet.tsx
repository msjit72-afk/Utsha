import React from 'react';
import { InvoiceData } from '../types/invoice';

interface InvoiceSheetProps {
  data: InvoiceData;
  onChangeField?: (field: keyof InvoiceData, value: any) => void;
  onUpdateItem?: (index: number, field: string, value: any) => void;
  isEditableInline?: boolean;
  templateStyle?: 'vector' | 'photo';
}

export const InvoiceSheet: React.FC<InvoiceSheetProps> = ({
  data,
  onChangeField,
  onUpdateItem,
  isEditableInline = false,
  templateStyle = 'vector',
}) => {
  const totalAmountNum = data.items.reduce((acc, item) => {
    const val = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const formattedTotal = totalAmountNum.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  // Ensure at least 5 rows like original template
  const displayItems = [...data.items];
  while (displayItems.length < 5) {
    displayItems.push({
      id: `empty-${displayItems.length + 1}`,
      slNo: displayItems.length + 1,
      description: '',
      amount: '',
    });
  }

  // ========================================================
  // MODE 1: ORIGINAL PHOTO TEMPLATE OVERLAY MODE
  // ========================================================
  if (templateStyle === 'photo') {
    return (
      <div
        id="invoice-sheet"
        className="print-sheet relative mx-auto w-full max-w-[800px] h-[1130px] bg-white text-slate-900 shadow-2xl rounded-sm overflow-hidden select-text"
        style={{
          boxSizing: 'border-box',
        }}
      >
        {/* Background Image of the Original Master Template */}
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-11-07_at_2.01.35_AM_a450b00a.jpeg"
          alt="International Tour and Travel Template"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
        />

        {/* Dynamic Overlays at exact pixel coordinates */}
        {/* 1. Invoice No & Date */}
        <div className="absolute top-[242px] right-[48px] w-[185px] text-[13px] font-bold text-[#002244] z-10 text-right pr-2">
          {data.invoiceNo}
        </div>
        <div className="absolute top-[282px] right-[48px] w-[185px] text-[13px] font-bold text-[#002244] z-10 text-right pr-2">
          {data.date}
        </div>

        {/* 2. Customer Name */}
        <div className="absolute top-[316px] left-[175px] right-[45px] text-[14px] font-extrabold text-[#002244] z-10 px-2 tracking-wide">
          {data.customerName}
        </div>

        {/* 3. Passport No & ID No */}
        <div className="absolute top-[346px] left-[145px] w-[220px] text-[13px] font-bold text-[#002244] z-10 px-2 tracking-wider">
          {data.passportNo}
        </div>
        <div className="absolute top-[346px] left-[435px] right-[45px] text-[13px] font-bold text-[#002244] z-10 px-2 tracking-wider">
          {data.idNo}
        </div>

        {/* 4. Table Rows 1 to 5 */}
        <div className="absolute top-[414px] left-[45px] right-[45px] z-10">
          {displayItems.slice(0, 5).map((item, idx) => {
            const rowAmount =
              item.amount !== '' && item.amount !== undefined
                ? typeof item.amount === 'string'
                  ? parseFloat(item.amount)
                  : item.amount
                : NaN;

            return (
              <div key={idx} className="h-[43px] flex items-center text-[13px] font-medium text-slate-900">
                <div className="w-[85px] text-center font-bold text-[#002d62]">
                  {/* Row number is already in template */}
                </div>
                <div className="flex-1 px-4 font-semibold text-slate-800 truncate">
                  {item.description}
                </div>
                <div className="w-[130px] text-right pr-6 font-bold tabular-nums text-slate-900">
                  {!isNaN(rowAmount) ? rowAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Total Amount */}
        <div className="absolute top-[633px] right-[52px] w-[130px] text-right pr-4 text-[15px] font-black text-[#002d62] tabular-nums z-10">
          ₹ {formattedTotal}
        </div>

        {/* 6. Payment Method Checkboxes */}
        <div className="absolute top-[677px] left-[242px] z-10 font-bold text-[#002d62] text-[15px]">
          {data.paymentMethod === 'cash' ? '✔' : ''}
        </div>
        <div className="absolute top-[677px] left-[348px] z-10 font-bold text-[#002d62] text-[15px]">
          {data.paymentMethod === 'online' || data.paymentMethod === 'bank' ? '✔' : ''}
        </div>

        {/* 7. Amount in Words */}
        <div className="absolute top-[715px] left-[175px] right-[50px] text-[13px] font-semibold italic text-[#002244] z-10 px-2 truncate">
          {data.amountInWords}
        </div>
      </div>
    );
  }

  // ========================================================
  // MODE 2: ULTRA LUXE VECTOR HD GRAPHICS MODE
  // ========================================================
  return (
    <div
      id="invoice-sheet"
      className="print-sheet relative mx-auto w-full max-w-[800px] min-h-[1130px] bg-white text-slate-800 shadow-2xl rounded-sm p-7 sm:p-9 flex flex-col justify-between overflow-hidden border border-slate-200"
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Top Graphic Ribbon & Sweeping Arc */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#002b66] via-[#d48806] to-[#002b66]" />

      <div>
        {/* ================= HEADER SECTION ================= */}
        <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100">
          {/* Top Sweeping Golden/Blue Arcs */}
          <div className="absolute -top-7 -left-9 w-64 h-32 pointer-events-none opacity-40">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <path d="M0 0 C 80 10, 140 50, 180 100" fill="none" stroke="#f59e0b" strokeWidth="8" />
              <path d="M0 12 C 70 20, 120 55, 160 100" fill="none" stroke="#003366" strokeWidth="6" />
            </svg>
          </div>

          {/* Left: 3D Logo & Company Info */}
          <div className="flex items-start gap-3.5 max-w-[62%] relative z-10">
            {/* 3D Realistic Globe with Gold Arc & Jetliner */}
            <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-md">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                  <radialGradient id="globeGrad" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#4ba3e3" />
                    <stop offset="50%" stopColor="#0a5cb0" />
                    <stop offset="100%" stopColor="#002d62" />
                  </radialGradient>
                  <linearGradient id="goldSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>

                {/* Ocean Sphere */}
                <circle cx="56" cy="58" r="44" fill="url(#globeGrad)" />

                {/* Continents in Crisp White with Depth */}
                <path
                  d="M40 28 C 55 22, 70 26, 80 34 C 88 42, 94 56, 86 70 C 76 84, 58 92, 42 90 C 26 86, 22 70, 24 54 C 26 38, 32 30, 40 28 Z"
                  fill="#ffffff"
                  opacity="0.95"
                />
                <path
                  d="M48 36 C 60 32, 68 40, 72 52 C 64 62, 52 64, 44 56 C 40 50, 42 40, 48 36 Z"
                  fill="#0a5cb0"
                  opacity="0.35"
                />

                {/* Longitude and Latitude Lines */}
                <ellipse cx="56" cy="58" rx="44" ry="22" fill="none" stroke="#93c5fd" strokeWidth="1.2" opacity="0.6" />
                <ellipse cx="56" cy="58" rx="22" ry="44" fill="none" stroke="#93c5fd" strokeWidth="1.2" opacity="0.6" />
                <ellipse cx="56" cy="58" rx="44" ry="44" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />

                {/* Thick Golden Ribbon Orbit */}
                <path
                  d="M12 78 C 28 105, 75 102, 102 54 C 110 40, 114 26, 116 18"
                  fill="none"
                  stroke="url(#goldSwoosh)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                {/* Climbing Jetliner Silhouette */}
                <g transform="translate(100, 16) rotate(42) scale(0.9)">
                  <path
                    d="M0 -18 L4 -6 L18 2 L18 6 L4 3 L3 12 L8 16 L8 19 L1 17 L-6 19 L-6 16 L-1 12 L-2 3 L-16 6 L-16 2 L-2 -6 Z"
                    fill="#002d62"
                  />
                  <path
                    d="M-2 -6 L0 -18 L4 -6 Z"
                    fill="#1e3a8a"
                  />
                </g>
              </svg>
            </div>

            {/* Typography: Company Name & Contact */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#002b66] leading-none uppercase font-serif drop-shadow-xs">
                International
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-[#002b66] leading-tight uppercase font-serif mt-1">
                Tour and Travel
              </h2>

              <div className="mt-2.5 text-xs sm:text-sm text-slate-700 flex flex-col gap-1">
                <div className="flex items-center gap-2 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-[#003366]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{data.companyAddress}</span>
                </div>

                <div className="flex items-center gap-2 font-extrabold text-[#002b66] text-sm sm:text-base">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-[#d97706]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
                    </svg>
                  </div>
                  <span>📞 {data.companyPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: World Famous Landmarks Illustration */}
          <div className="relative w-full sm:w-auto flex flex-col items-end">
            <div className="relative w-64 h-24 overflow-hidden rounded-lg bg-gradient-to-b from-sky-100/90 to-amber-50/50 border border-amber-300/80 p-2 shadow-sm flex items-end justify-between">
              {/* Sky and clouds */}
              <div className="absolute top-1 left-2 text-[10px] text-sky-800 font-bold uppercase tracking-widest flex items-center gap-1">
                <span>✈ Worldwide Destinations</span>
              </div>

              {/* Vector Landmark Icons */}
              <div className="flex items-end justify-around w-full h-18 text-[#003366] opacity-90 pb-1">
                {/* Eiffel Tower */}
                <svg viewBox="0 0 40 70" className="h-16 w-8 text-[#002b66]" fill="currentColor">
                  <path d="M18 0 L22 0 L22 10 L25 25 L15 25 L18 10 Z M14 28 L26 28 L29 50 L11 50 Z M8 53 L32 53 L38 70 L28 70 L25 56 C 22 58, 18 58, 15 56 L12 70 L2 70 Z" />
                </svg>

                {/* Colosseum / Roman Arches */}
                <svg viewBox="0 0 50 40" className="h-11 w-12 text-[#b45309]" fill="currentColor">
                  <path d="M5 40 L5 15 C 10 10, 40 10, 45 15 L45 40 Z" opacity="0.2" />
                  <path d="M5 40 L5 20 L45 20 L45 40 Z M10 25 C 10 22, 14 22, 14 25 L14 40 L10 40 Z M18 25 C 18 22, 22 22, 22 25 L22 40 L18 40 Z M26 25 C 26 22, 30 22, 30 25 L30 40 L26 40 Z M34 25 C 34 22, 38 22, 38 25 L38 40 L34 40 Z" />
                </svg>

                {/* Big Ben Elizabeth Tower */}
                <svg viewBox="0 0 30 75" className="h-16 w-7 text-[#002b66]" fill="currentColor">
                  <path d="M13 0 L17 0 L15 8 L18 15 L12 15 Z M10 17 L20 17 L20 30 L10 30 Z M8 32 L22 32 L22 75 L8 75 Z" />
                  <circle cx="15" cy="24" r="3" fill="#fbbf24" />
                </svg>

                {/* Statue of Liberty */}
                <svg viewBox="0 0 35 70" className="h-16 w-8 text-[#047857]" fill="currentColor">
                  <path d="M15 0 L18 6 L14 8 L12 18 L20 18 L19 8 L17 6 Z M10 20 L22 20 L24 45 L8 45 Z M6 48 L26 48 L24 70 L8 70 Z" />
                  <circle cx="17" cy="4" r="3" fill="#f59e0b" />
                </svg>
              </div>

              {/* Airliner flying across top */}
              <div className="absolute top-2 right-4 text-sm animate-pulse">
                ✈
              </div>
            </div>
          </div>
        </div>

        {/* ================= INVOICE BANNER & NO / DATE ================= */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Centered / Left INVOICE Badge */}
          <div className="relative flex items-center justify-center">
            <div className="bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#002244] text-white font-extrabold text-xl sm:text-2xl px-12 py-1.5 rounded-full shadow-lg border-2 border-amber-400 tracking-widest uppercase flex items-center gap-3">
              <span>INVOICE</span>
              <svg className="w-6 h-6 text-amber-400 transform rotate-12 filter drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
          </div>

          {/* Right: Invoice No. & Date Box */}
          <div className="w-full sm:w-68 bg-amber-50/80 border-2 border-amber-500 rounded-xl px-4 py-2.5 shadow-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#002b66]">
              <span className="shrink-0">Invoice No. :</span>
              {isEditableInline && onChangeField ? (
                <input
                  type="text"
                  value={data.invoiceNo}
                  onChange={(e) => onChangeField('invoiceNo', e.target.value)}
                  placeholder="ITT-2026-001"
                  className="w-32 text-right bg-white border border-amber-400 rounded px-2 py-0.5 text-xs font-bold text-slate-900"
                />
              ) : (
                <span className="font-extrabold text-slate-900 border-b border-amber-400 min-w-28 text-right">
                  {data.invoiceNo || '_______________'}
                </span>
              )}
            </div>

            {/* Divider with diamond star */}
            <div className="relative my-1.5 flex items-center justify-center">
              <div className="w-full h-0.5 bg-amber-400"></div>
              <span className="absolute px-1.5 bg-amber-50 text-amber-600 font-bold text-xs">◆</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#002b66]">
              <span className="shrink-0">Date :</span>
              {isEditableInline && onChangeField ? (
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => onChangeField('date', e.target.value)}
                  placeholder="07/11/2026"
                  className="w-32 text-right bg-white border border-amber-400 rounded px-2 py-0.5 text-xs font-bold text-slate-900"
                />
              ) : (
                <span className="font-semibold text-slate-900 border-b border-amber-400 min-w-28 text-right">
                  {data.date || '_______________'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= CUSTOMER INFO SECTION ================= */}
        <div className="mt-5 space-y-2.5 text-xs sm:text-sm text-[#002b66] font-bold">
          <div className="flex items-baseline gap-2">
            <span className="shrink-0 text-sm">Customer Name :</span>
            {isEditableInline && onChangeField ? (
              <input
                type="text"
                value={data.customerName}
                onChange={(e) => onChangeField('customerName', e.target.value)}
                placeholder="Enter customer name"
                className="flex-1 bg-blue-50/50 border-b-2 border-slate-500 focus:border-[#003366] outline-none px-2 py-0.5 text-slate-900 font-bold text-sm"
              />
            ) : (
              <span className="flex-1 border-b-2 border-slate-500 text-slate-900 font-bold pb-0.5 px-1 min-h-[1.5rem] text-sm">
                {data.customerName}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-baseline gap-4 sm:gap-6">
            <div className="flex-1 flex items-baseline gap-2 w-full">
              <span className="shrink-0">Passport No. :</span>
              {isEditableInline && onChangeField ? (
                <input
                  type="text"
                  value={data.passportNo}
                  onChange={(e) => onChangeField('passportNo', e.target.value)}
                  placeholder="e.g. Z1234567"
                  className="flex-1 bg-blue-50/50 border-b-2 border-slate-500 focus:border-[#003366] outline-none px-2 py-0.5 text-slate-900 font-semibold uppercase"
                />
              ) : (
                <span className="flex-1 border-b-2 border-slate-500 text-slate-900 font-semibold pb-0.5 px-1 min-h-[1.3rem] uppercase">
                  {data.passportNo}
                </span>
              )}
            </div>

            <div className="hidden sm:block text-amber-500 font-black text-lg">|</div>

            <div className="flex-1 flex items-baseline gap-2 w-full">
              <span className="shrink-0">ID No. :</span>
              {isEditableInline && onChangeField ? (
                <input
                  type="text"
                  value={data.idNo}
                  onChange={(e) => onChangeField('idNo', e.target.value)}
                  placeholder="Aadhaar / Voter ID"
                  className="flex-1 bg-blue-50/50 border-b-2 border-slate-500 focus:border-[#003366] outline-none px-2 py-0.5 text-slate-900 font-semibold"
                />
              ) : (
                <span className="flex-1 border-b-2 border-slate-500 text-slate-900 font-semibold pb-0.5 px-1 min-h-[1.3rem]">
                  {data.idNo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= MAIN ITEMS TABLE WITH WATERMARK ================= */}
        <div className="mt-5 relative overflow-hidden border-2 border-[#002b66] rounded-sm shadow-xs">
          {/* Subtle Watermark Seal in center of table */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.16] select-none z-0">
            <div className="relative w-84 h-84 rounded-full border-8 border-[#002b66] flex flex-col items-center justify-center p-6 text-center">
              <div className="text-xl font-black text-[#002b66] uppercase tracking-widest mb-1">
                INTERNATIONAL
              </div>
              <svg viewBox="0 0 100 100" className="w-28 h-28 my-1 text-[#002b66]" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="50" cy="50" r="42" />
                <ellipse cx="50" cy="50" rx="42" ry="20" />
                <ellipse cx="50" cy="50" rx="20" ry="42" />
                <path d="M15 65 Q50 90 85 40" stroke="#d97706" strokeWidth="5" />
              </svg>
              <div className="text-xl font-black text-[#002b66] uppercase tracking-widest mt-1">
                TOUR AND TRAVEL
              </div>
            </div>
          </div>

          <table className="w-full border-collapse relative z-10 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#002447] via-[#003366] to-[#002447] text-white">
                <th className="border-r border-blue-300/40 py-2.5 px-3 text-center font-extrabold w-14 sm:w-16">
                  Sl. No.
                </th>
                <th className="border-r border-blue-300/40 py-2.5 px-4 text-center font-extrabold">
                  Service Description and Service
                </th>
                <th className="py-2.5 px-4 text-center font-extrabold w-32 sm:w-40">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, idx) => {
                const rowAmount =
                  item.amount !== '' && item.amount !== undefined
                    ? typeof item.amount === 'string'
                      ? parseFloat(item.amount)
                      : item.amount
                    : NaN;

                return (
                  <tr
                    key={item.id || idx}
                    className="border-b border-[#002b66]/40 hover:bg-blue-50/30 transition-colors h-11"
                  >
                    <td className="border-r border-[#002b66]/40 text-center font-extrabold text-[#002b66] px-2 py-1.5 text-sm">
                      {idx + 1}.
                    </td>
                    <td className="border-r border-[#002b66]/40 px-3 py-1.5 text-slate-900 font-semibold">
                      {isEditableInline && onUpdateItem ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => onUpdateItem(idx, 'description', e.target.value)}
                          placeholder="Service description"
                          className="w-full bg-transparent outline-none focus:bg-blue-50/70 px-1 py-0.5 rounded"
                        />
                      ) : (
                        <span>{item.description}</span>
                      )}
                    </td>
                    <td className="text-right px-4 py-1.5 font-bold text-slate-900 tabular-nums text-sm">
                      {isEditableInline && onUpdateItem ? (
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => onUpdateItem(idx, 'amount', e.target.value)}
                          placeholder="0.00"
                          className="w-full text-right bg-transparent outline-none focus:bg-blue-50/70 px-1 py-0.5 rounded font-bold"
                        />
                      ) : (
                        <span>{!isNaN(rowAmount) ? rowAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================= TOTAL AMOUNT ROW ================= */}
        <div className="mt-3 flex justify-end items-center">
          <div className="flex items-center gap-0 border-2 border-[#002b66] rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#002b66] text-white font-extrabold text-xs sm:text-sm px-5 py-2 uppercase tracking-wider">
              Total Amount :
            </div>
            <div className="bg-amber-50/90 px-6 py-2 text-right font-black text-base sm:text-lg text-[#002b66] min-w-36 tabular-nums">
              ₹ {formattedTotal}
            </div>
          </div>
        </div>

        {/* ================= PAYMENT METHOD & AMOUNT IN WORDS ================= */}
        <div className="mt-4 space-y-3">
          {/* Payment Method */}
          <div className="flex items-center gap-6 text-xs sm:text-sm font-bold text-[#002b66]">
            <span>Payment Method :</span>
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800">
              <input
                type="radio"
                name="paymentMethodSheet"
                checked={data.paymentMethod === 'cash'}
                onChange={() => onChangeField && onChangeField('paymentMethod', 'cash')}
                disabled={!isEditableInline}
                className="w-4 h-4 text-[#003366] rounded border-slate-500 focus:ring-0"
              />
              <span className="font-semibold">Cash</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800">
              <input
                type="radio"
                name="paymentMethodSheet"
                checked={data.paymentMethod === 'online' || data.paymentMethod === 'bank'}
                onChange={() => onChangeField && onChangeField('paymentMethod', 'online')}
                disabled={!isEditableInline}
                className="w-4 h-4 text-[#003366] rounded border-slate-500 focus:ring-0"
              />
              <span className="font-semibold">Online</span>
            </label>
          </div>

          {/* Amount in Words */}
          <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50/80 flex flex-col sm:flex-row sm:items-baseline gap-2 text-xs sm:text-sm shadow-2xs">
            <span className="font-extrabold text-[#002b66] shrink-0">Amount in Words :</span>
            {isEditableInline && onChangeField ? (
              <input
                type="text"
                value={data.amountInWords}
                onChange={(e) => onChangeField('amountInWords', e.target.value)}
                placeholder="Rupees..."
                className="flex-1 bg-transparent border-b border-slate-400 focus:border-[#003366] outline-none text-slate-900 font-semibold italic px-1"
              />
            ) : (
              <span className="text-slate-900 font-semibold italic border-b border-slate-400 flex-1 pb-0.5">
                {data.amountInWords || '________________________________________________________'}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* ================= FOOTER SECTION ================= */}
      <div className="mt-8 pt-4">
        {/* Slogan + Stamp + Signature Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6">
          {/* Slogan & Airplane Trail */}
          <div className="flex flex-col items-start">
            <p className="font-script text-3xl sm:text-4xl text-[#002b66] tracking-wide filter drop-shadow-2xs">
              {data.slogan || 'Explore the World with Us...'}
            </p>
            <div className="flex items-center gap-2 text-amber-500 mt-1">
              <span className="text-xs tracking-widest text-[#002b66]">✦ ✦ ✦</span>
              <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400 to-[#002b66] rounded"></div>
              <span className="text-base">✈</span>
            </div>
          </div>

          {/* Stamp & Authorized Signature */}
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Circular Stamp / Seal */}
            <div className="relative w-26 h-26 rounded-full border-2 border-dashed border-[#002b66] p-1 flex flex-col items-center justify-center text-center rotate-[-5deg] shadow-sm">
              <div className="w-full h-full rounded-full border-2 border-[#002b66] flex flex-col items-center justify-center bg-blue-50/50">
                <span className="text-[8px] font-black text-[#002b66] uppercase tracking-tighter">
                  ★ INTERNATIONAL ★
                </span>
                <div className="my-1 border-y-2 border-[#002b66] w-4/5 py-0.5 text-center bg-white/70">
                  <span className="text-sm font-black text-[#002b66] tracking-widest">
                    UTSHA
                  </span>
                </div>
                <span className="text-[8px] font-black text-[#002b66] uppercase tracking-tighter">
                  TOUR AND TRAVEL
                </span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-right">
              <div className="text-xs font-bold text-[#002b66] mb-1">
                Authorized Signature
              </div>
              <div className="font-script text-3xl sm:text-4xl font-extrabold text-[#002b66] leading-none mb-1 select-none">
                {data.signatoryName || 'UTSHA'}
              </div>
              <div className="w-32 border-b-2 border-slate-800 ml-auto mb-1"></div>
              <div className="text-xs font-extrabold text-slate-800">
                {data.signatoryTitle || 'Proprietor'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Skyline Illustration & Deep Navy Wave */}
        <div className="relative -mx-7 -mb-7 sm:-mx-9 sm:-mb-9 mt-2 overflow-hidden">
          {/* Skyline Silhouette SVG with Monuments */}
          <div className="w-full h-16 text-[#002b66] flex items-end">
            <svg viewBox="0 0 1000 130" preserveAspectRatio="none" className="w-full h-full">
              {/* Skylines */}
              <path
                d="M0 130 L0 105 L25 105 L30 75 L40 75 L45 105 L65 105 L70 55 L80 55 L85 105 L110 105 
                   L125 30 L130 10 L135 30 L145 105 L175 105 L185 70 L195 70 L205 105 L240 105 
                   L260 40 L275 40 L280 20 L285 40 L300 105 L330 105 L340 80 L360 80 L370 105 
                   L410 105 L420 45 L425 10 L430 45 L440 105 L470 105 L490 65 L510 65 L520 105 
                   L550 105 L570 35 L590 35 L610 105 L640 105 L655 30 L665 10 L675 30 L690 105 
                   L730 105 L740 60 L760 60 L770 105 L800 105 L820 35 L835 35 L840 15 L845 35 L860 105 
                   L900 105 L920 75 L940 75 L950 105 L1000 105 L1000 130 Z"
                fill="#002447"
              />
              {/* London Eye Ferris Wheel */}
              <circle cx="430" cy="70" r="32" stroke="#f59e0b" strokeWidth="2.5" fill="none" opacity="0.85" />
              <line x1="430" y1="38" x2="430" y2="102" stroke="#f59e0b" strokeWidth="1.8" opacity="0.85" />
              <line x1="398" y1="70" x2="462" y2="70" stroke="#f59e0b" strokeWidth="1.8" opacity="0.85" />
              <line x1="407" y1="47" x2="453" y2="93" stroke="#f59e0b" strokeWidth="1.8" opacity="0.85" />
              <line x1="407" y1="93" x2="453" y2="47" stroke="#f59e0b" strokeWidth="1.8" opacity="0.85" />
            </svg>
          </div>

          {/* Deep Navy & Gold Wave Footer */}
          <div className="h-7 bg-gradient-to-r from-[#001733] via-[#002b66] to-[#001733] border-t-2 border-amber-400 flex items-center justify-between px-6 text-[11px] font-bold text-amber-300">
            <span>International Tour and Travel • Kolkata</span>
            <span>Worldwide Holidays & Visa Services</span>
            <span>Mob: 8420512151</span>
          </div>
        </div>
      </div>
    </div>
  );
};
