export interface PolicyFormData {
	organizationName: string;
	framework: SecurityFramework;
	constraints: string;
}

export type SecurityFramework = 'PCI-DSS' | 'HIPAA' | 'NIST 800-171' | 'CMMC Level 1';

export interface PolicySet {
	accessControl: string;
	acceptableUsage: string;
	incidentResponse: string;
}

export interface GeneratedPolicy {
	type: 'Access Control' | 'Acceptable Usage' | 'Incident Response';
	content: string;
	organizationName: string;
	framework: SecurityFramework;
}
