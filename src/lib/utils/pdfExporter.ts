import JSZip from 'jszip';
import MarkdownIt from 'markdown-it';
import html2pdf from 'html2pdf.js'; // Add this import
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
	const options = defaultOptions;

	// Convert markdown to HTML using markdown-it
	const md = new MarkdownIt();
	const htmlContent = md.render(markdownContent);

	// Create a container for the HTML with enhanced CSS for tables and lists
	const container = document.createElement('div');
	container.innerHTML = `
        <style>
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 2px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            ul, ol { margin-left: 20px; }
            li { margin-bottom: 5px; }
            ul ul, ol ol { margin-left: 15px; } /* Better sublist handling */
        </style>
        <h1>${policyTitle}</h1>
        <h2>${organizationName}</h2>
        <p><strong>Framework:</strong> ${framework}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        ${htmlContent}
    `;

	// Append to body temporarily for rendering
	document.body.appendChild(container);

	// Configure html2pdf options
	const pdfOptions = {
		margin: options.margin,
		filename: 'temp.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
	};

	// Generate PDF as Uint8Array
	const pdfBlob = await html2pdf().set(pdfOptions).from(container).outputPdf('blob');
	const arrayBuffer = await pdfBlob.arrayBuffer();

	// Remove temporary container
	document.body.removeChild(container);

	return new Uint8Array(arrayBuffer);
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
