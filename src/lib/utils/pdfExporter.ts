import jsPDF from 'jspdf';
import JSZip from 'jszip';
import type { PolicySet, SecurityFramework } from '$lib/types';

interface PDFOptions {
	margin: number;
	fontSize: number;
	lineHeight: number;
	pageHeight: number;
	pageWidth: number;
}

const defaultOptions: PDFOptions = {
	margin: 20,
	fontSize: 10,
	lineHeight: 1.4,
	pageHeight: 297, // A4 height in mm
	pageWidth: 210 // A4 width in mm
};

export async function exportToPDF(
	policies: PolicySet,
	organizationName: string,
	framework: SecurityFramework
): Promise<void> {
	try {
		const zip = new JSZip();

		// Create PDFs for each policy
		const accessControlPdf = await createPolicyPDF(
			policies.accessControl,
			'Access Control Policy',
			organizationName,
			framework
		);

		const acceptableUsagePdf = await createPolicyPDF(
			policies.acceptableUsage,
			'Acceptable Usage Policy',
			organizationName,
			framework
		);

		const incidentResponsePdf = await createPolicyPDF(
			policies.incidentResponse,
			'Incident Response Policy',
			organizationName,
			framework
		);

		// Add PDFs to zip
		zip.file(`${organizationName}_Access_Control_Policy.pdf`, accessControlPdf);
		zip.file(`${organizationName}_Acceptable_Usage_Policy.pdf`, acceptableUsagePdf);
		zip.file(`${organizationName}_Incident_Response_Policy.pdf`, incidentResponsePdf);

		// Generate and download zip
		const zipBlob = await zip.generateAsync({ type: 'blob' });
		downloadBlob(
			zipBlob,
			`${organizationName}_Security_Policies_${framework.replace(/\s+/g, '_')}.zip`
		);
	} catch (error) {
		console.error('Error exporting policies:', error);
		throw new Error('Failed to export policies');
	}
}

async function createPolicyPDF(
	markdownContent: string,
	policyTitle: string,
	organizationName: string,
	framework: SecurityFramework
): Promise<Uint8Array> {
	const pdf = new jsPDF('p', 'mm', 'a4');
	const options = defaultOptions;

	let currentY = options.margin;

	// Add header
	pdf.setFontSize(16);
	pdf.setFont('helvetica', 'bold');
	pdf.text(policyTitle, options.margin, currentY);
	currentY += 10;

	pdf.setFontSize(12);
	pdf.text(organizationName, options.margin, currentY);
	currentY += 8;

	pdf.setFontSize(10);
	pdf.setFont('helvetica', 'normal');
	pdf.text(`Framework: ${framework}`, options.margin, currentY);
	currentY += 8;

	pdf.text(`Generated: ${new Date().toLocaleDateString()}`, options.margin, currentY);
	currentY += 15;

	// Convert markdown to plain text with basic formatting
	const plainText = convertMarkdownToPlainText(markdownContent);

	// Add content
	pdf.setFontSize(options.fontSize);
	currentY = addTextToPDF(pdf, plainText, options.margin, currentY, options);

	// Add footer to each page
	const pageCount = pdf.getNumberOfPages();
	for (let i = 1; i <= pageCount; i++) {
		pdf.setPage(i);
		pdf.setFontSize(8);
		pdf.text(
			`Page ${i} of ${pageCount} | ${organizationName} ${policyTitle}`,
			options.margin,
			options.pageHeight - 10
		);
	}

	return new Uint8Array(pdf.output('arraybuffer') as ArrayBuffer);
}

function convertMarkdownToPlainText(markdown: string): string {
	// Remove markdown syntax while preserving structure
	const text = markdown
		// Headers
		.replace(/^#+\s+(.*)$/gm, '\n$1\n' + '='.repeat(50) + '\n')
		// Bold
		.replace(/\*\*(.*?)\*\*/g, '$1')
		// Italic
		.replace(/\*(.*?)\*/g, '$1')
		// Lists
		.replace(/^\s*[-*+]\s+/gm, '• ')
		.replace(/^\s*\d+\.\s+/gm, '• ')
		// Tables (basic conversion)
		.replace(/\|/g, ' | ')
		// Remove extra markdown
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`([^`]+)`/g, '$1')
		// Clean up extra whitespace
		.replace(/\n{3,}/g, '\n\n')
		.trim();

	return text;
}

function addTextToPDF(
	pdf: jsPDF,
	text: string,
	x: number,
	startY: number,
	options: PDFOptions
): number {
	const lines = text.split('\n');
	let currentY = startY;
	const maxWidth = options.pageWidth - 2 * options.margin;

	for (const line of lines) {
		if (line.trim() === '') {
			currentY += options.fontSize * 0.5;
			continue;
		}

		// Check if we need a new page
		if (currentY > options.pageHeight - options.margin - 20) {
			pdf.addPage();
			currentY = options.margin;
		}

		// Handle long lines by wrapping them
		const wrappedLines = pdf.splitTextToSize(line, maxWidth);

		for (const wrappedLine of wrappedLines) {
			if (currentY > options.pageHeight - options.margin - 20) {
				pdf.addPage();
				currentY = options.margin;
			}

			// Check if this is a header line (indicated by = characters)
			if (wrappedLine.includes('='.repeat(10))) {
				continue; // Skip the separator lines
			}

			pdf.text(wrappedLine, x, currentY);
			currentY += options.fontSize * options.lineHeight;
		}
	}

	return currentY;
}

function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.style.display = 'none';

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	URL.revokeObjectURL(url);
}
