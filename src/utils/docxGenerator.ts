import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { InvoiceData } from '../types/invoice';

const NAVY = '003366';
const GOLD = 'D48806';
const LIGHT_BLUE = 'EBF3FB';
const GRAY_BORDER = 'CCCCCC';
const DARK_TEXT = '1A202C';
const MUTED_TEXT = '4A5568';

export async function generateWordDocument(
  data: InvoiceData,
  options: { includeTemplateImage?: boolean; filename?: string } = {}
): Promise<void> {
  const totalAmountNum = data.items.reduce((acc, item) => {
    const val = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const formattedTotal = totalAmountNum.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  // Cell border styles
  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: GRAY_BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: GRAY_BORDER },
    left: { style: BorderStyle.SINGLE, size: 4, color: GRAY_BORDER },
    right: { style: BorderStyle.SINGLE, size: 4, color: GRAY_BORDER },
  };

  const navyBorder = {
    top: { style: BorderStyle.SINGLE, size: 8, color: NAVY },
    bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY },
    left: { style: BorderStyle.SINGLE, size: 8, color: NAVY },
    right: { style: BorderStyle.SINGLE, size: 8, color: NAVY },
  };

  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  // Header Table: Left company name & address, Right Invoice Box
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          // Left: Company Info
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '✈ INTERNATIONAL',
                    bold: true,
                    size: 32, // 16pt
                    color: NAVY,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'TOUR AND TRAVEL',
                    bold: true,
                    size: 30, // 15pt
                    color: NAVY,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [
                  new TextRun({
                    text: `📍 ${data.companyAddress || 'E42, Mukundapur Bazar, Kolkata – 700099'}`,
                    size: 19,
                    color: MUTED_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: `📞 ${data.companyPhone || '8420512151'}`,
                    bold: true,
                    size: 20,
                    color: NAVY,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
          // Right: Invoice No & Date Box
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 12, color: GOLD },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD },
              left: { style: BorderStyle.SINGLE, size: 12, color: GOLD },
              right: { style: BorderStyle.SINGLE, size: 12, color: GOLD },
            },
            shading: {
              fill: 'FFFDF5',
              type: ShadingType.CLEAR,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 40 },
                children: [
                  new TextRun({
                    text: 'INVOICE',
                    bold: true,
                    size: 26,
                    color: NAVY,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 40, after: 40 },
                indent: { left: 100 },
                children: [
                  new TextRun({
                    text: 'Invoice No. : ',
                    bold: true,
                    size: 20,
                    color: NAVY,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: data.invoiceNo || '________________',
                    bold: true,
                    size: 20,
                    color: DARK_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 40, after: 60 },
                indent: { left: 100 },
                children: [
                  new TextRun({
                    text: 'Date : ',
                    bold: true,
                    size: 20,
                    color: NAVY,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: data.date || '________________',
                    size: 20,
                    color: DARK_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Customer Details Table
  const customerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                spacing: { before: 140, after: 60 },
                children: [
                  new TextRun({
                    text: 'Customer Name : ',
                    bold: true,
                    size: 21,
                    color: NAVY,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: data.customerName
                      ? ` ${data.customerName}`
                      : ' ________________________________________________________________',
                    bold: !!data.customerName,
                    size: 21,
                    color: DARK_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40, after: 140 },
                children: [
                  new TextRun({
                    text: 'Passport No. : ',
                    bold: true,
                    size: 21,
                    color: NAVY,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: data.passportNo ? ` ${data.passportNo}` : ' _____________________',
                    size: 21,
                    color: DARK_TEXT,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: '    |    ',
                    bold: true,
                    size: 21,
                    color: GOLD,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: 'ID No. : ',
                    bold: true,
                    size: 21,
                    color: NAVY,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: data.idNo ? ` ${data.idNo}` : ' _____________________',
                    size: 21,
                    color: DARK_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Line Items Table Header
  const tableHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        borders: navyBorder,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: 'Sl. No.',
                bold: true,
                size: 20,
                color: 'FFFFFF',
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 66, type: WidthType.PERCENTAGE },
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        borders: navyBorder,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: 'Service Description and Service',
                bold: true,
                size: 20,
                color: 'FFFFFF',
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        borders: navyBorder,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: 'Amount (₹)',
                bold: true,
                size: 20,
                color: 'FFFFFF',
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Table Body Rows (at least 5 rows to mirror original template)
  const rowsCount = Math.max(5, data.items.length);
  const bodyRows: TableRow[] = [];

  for (let i = 0; i < rowsCount; i++) {
    const item = data.items[i];
    const rowNumber = `${i + 1}.`;
    const description = item ? item.description : '';
    let amountStr = '';
    if (item && item.amount !== '' && item.amount !== undefined) {
      const val = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      amountStr = isNaN(val) ? '' : val.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    }

    bodyRows.push(
      new TableRow({
        children: [
          // Sl No
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            shading: {
              fill: i % 2 === 1 ? 'F8FAFC' : 'FFFFFF',
              type: ShadingType.CLEAR,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: rowNumber,
                    bold: true,
                    size: 20,
                    color: NAVY,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
          // Service Description
          new TableCell({
            width: { size: 66, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            shading: {
              fill: i % 2 === 1 ? 'F8FAFC' : 'FFFFFF',
              type: ShadingType.CLEAR,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 60, after: 60 },
                indent: { left: 80 },
                children: [
                  new TextRun({
                    text: description,
                    size: 20,
                    color: DARK_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
          // Amount
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            borders: thinBorder,
            shading: {
              fill: i % 2 === 1 ? 'F8FAFC' : 'FFFFFF',
              type: ShadingType.CLEAR,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 60, after: 60 },
                indent: { right: 80 },
                children: [
                  new TextRun({
                    text: amountStr,
                    bold: !!amountStr,
                    size: 20,
                    color: DARK_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  // Total Amount Row
  const totalRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 78, type: WidthType.PERCENTAGE },
        columnSpan: 2,
        borders: thinBorder,
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 70, after: 70 },
            indent: { right: 120 },
            children: [
              new TextRun({
                text: 'Total Amount :',
                bold: true,
                size: 22,
                color: 'FFFFFF',
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 8, color: GOLD },
          bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD },
          left: { style: BorderStyle.SINGLE, size: 8, color: GOLD },
          right: { style: BorderStyle.SINGLE, size: 8, color: GOLD },
        },
        shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 70, after: 70 },
            indent: { right: 80 },
            children: [
              new TextRun({
                text: `₹ ${formattedTotal}`,
                bold: true,
                size: 22,
                color: NAVY,
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const itemsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder,
    rows: [tableHeaderRow, ...bodyRows, totalRow],
  });

  // Payment Method & Amount in Words section
  const isCash = data.paymentMethod === 'cash';
  const isOnline = data.paymentMethod === 'online';

  const paymentParagraph = new Paragraph({
    spacing: { before: 160, after: 80 },
    children: [
      new TextRun({
        text: 'Payment Method :   ',
        bold: true,
        size: 21,
        color: NAVY,
        font: 'Arial',
      }),
      new TextRun({
        text: isCash ? '☑ Cash    ' : '☐ Cash    ',
        bold: isCash,
        size: 21,
        color: DARK_TEXT,
        font: 'Arial',
      }),
      new TextRun({
        text: isOnline ? '☑ Online' : '☐ Online',
        bold: isOnline,
        size: 21,
        color: DARK_TEXT,
        font: 'Arial',
      }),
    ],
  });

  const amountInWordsParagraph = new Paragraph({
    spacing: { before: 60, after: 180 },
    children: [
      new TextRun({
        text: 'Amount in Words : ',
        bold: true,
        size: 21,
        color: NAVY,
        font: 'Arial',
      }),
      new TextRun({
        text: data.amountInWords || '____________________________________________________________________',
        bold: !!data.amountInWords,
        size: 20,
        color: DARK_TEXT,
        font: 'Arial',
      }),
    ],
  });

  // Footer: Slogan on left, Stamp and Signature on right
  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          // Left: Slogan
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                spacing: { before: 120, after: 40 },
                children: [
                  new TextRun({
                    text: data.slogan || 'Explore the World with Us...',
                    italics: true,
                    bold: true,
                    size: 26,
                    color: NAVY,
                    font: 'Georgia',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '✈ -------------------------------------------',
                    size: 16,
                    color: GOLD,
                  }),
                ],
              }),
            ],
          }),
          // Center/Right: Stamp & Authorized Signature
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 80, after: 40 },
                children: [
                  new TextRun({
                    text: 'Authorized Signature',
                    bold: true,
                    size: 20,
                    color: NAVY,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 40, after: 20 },
                children: [
                  new TextRun({
                    text: data.signatoryName || 'UTSHA',
                    bold: true,
                    italics: true,
                    size: 26,
                    color: NAVY,
                    font: 'Georgia',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 20, after: 40 },
                children: [
                  new TextRun({
                    text: data.signatoryTitle || 'Proprietor',
                    size: 19,
                    color: MUTED_TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: '[ Seal: INTERNATIONAL TOUR AND TRAVEL - UTSHA ]',
                    size: 16,
                    color: GOLD,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Additional children array
  const docChildren: any[] = [];

  // Optional: include high-resolution template image on first page or preview
  if (options.includeTemplateImage) {
    try {
      const imgRes = await fetch(
        '/assets/aistudio/WhatsApp_Image_2026-11-07_at_2.01.35_AM_a450b00a.jpeg'
      );
      if (imgRes.ok) {
        const imgBuffer = await imgRes.arrayBuffer();
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new ImageRun({
                data: imgBuffer,
                transformation: {
                  width: 580,
                  height: 820,
                },
                type: 'jpg',
              }),
            ],
          })
        );
        // Page break if template image is included
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '',
                break: 1,
              }),
            ],
          })
        );
      }
    } catch (e) {
      console.warn('Could not load template image into docx:', e);
    }
  }

  // Add the formatted native editable tables and content
  docChildren.push(
    headerTable,
    customerTable,
    itemsTable,
    paymentParagraph,
    amountInWordsParagraph,
    footerTable
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename =
    options.filename ||
    `Invoice_${data.invoiceNo ? data.invoiceNo.replace(/[^a-zA-Z0-9_-]/g, '') : 'ITT'}_International_Tour_Travel.docx`;
  saveAs(blob, filename);
}
