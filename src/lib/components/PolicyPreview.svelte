<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { marked } from 'marked';
	import { exportToPDF } from '$lib/utils/pdfExporter';
	import type { PolicySet, SecurityFramework } from '$lib/types';

	export let policies: PolicySet;
	export let organizationName: string;
	export let framework: SecurityFramework;

	const dispatch = createEventDispatcher();

	let activePolicy: 'accessControl' | 'acceptableUsage' | 'incidentResponse' = 'accessControl';
	let isExporting = false;

	const policyTitles = {
		accessControl: 'Access Control Policy',
		acceptableUsage: 'Acceptable Usage Policy',
		incidentResponse: 'Incident Response Policy'
	};

	function resetForm() {
		dispatch('reset');
	}

	async function handleExport() {
		isExporting = true;
		try {
			await exportToPDF(policies, organizationName, framework);
		} catch (error) {
			console.error('Export failed:', error);
			alert('Failed to export policies. Please try again.');
		} finally {
			isExporting = false;
		}
	}

	$: currentPolicyContent = policies[activePolicy];
	$: renderedHTML = marked(currentPolicyContent);
</script>

<div class="policy-preview">
	<div class="preview-header">
		<h2>Generated Security Policies for {organizationName}</h2>
		<p class="framework-info">Compliance Framework: <strong>{framework}</strong></p>

		<div class="action-buttons">
			<button class="secondary-btn" on:click={resetForm}> Generate New Policies </button>
			<button class="export-btn" on:click={handleExport} disabled={isExporting}>
				{#if isExporting}
					Exporting...
				{:else}
					Export as PDF Bundle
				{/if}
			</button>
		</div>
	</div>

	<div class="policy-tabs">
		<button
			class="tab {activePolicy === 'accessControl' ? 'active' : ''}"
			on:click={() => (activePolicy = 'accessControl')}
		>
			Access Control
		</button>
		<button
			class="tab {activePolicy === 'acceptableUsage' ? 'active' : ''}"
			on:click={() => (activePolicy = 'acceptableUsage')}
		>
			Acceptable Usage
		</button>
		<button
			class="tab {activePolicy === 'incidentResponse' ? 'active' : ''}"
			on:click={() => (activePolicy = 'incidentResponse')}
		>
			Incident Response
		</button>
	</div>

	<div class="policy-content">
		<div class="policy-title">
			<h3>{policyTitles[activePolicy]}</h3>
		</div>

		<div class="rendered-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html renderedHTML}
		</div>
	</div>
</div>

<style>
	.policy-preview {
		max-width: 1000px;
		margin: 0 auto;
	}

	.preview-header {
		text-align: center;
		margin-bottom: 2rem;
		padding: 2rem;
		background: #f8f9fa;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.preview-header h2 {
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	.framework-info {
		color: #666;
		margin-bottom: 1.5rem;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.secondary-btn,
	.export-btn {
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
		font-size: 1rem;
	}

	.secondary-btn {
		background: #6c757d;
		color: white;
	}

	.secondary-btn:hover {
		background: #5a6268;
	}

	.export-btn {
		background: #28a745;
		color: white;
	}

	.export-btn:hover:not(:disabled) {
		background: #218838;
	}

	.export-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.policy-tabs {
		display: flex;
		border-bottom: 2px solid #e9ecef;
		margin-bottom: 2rem;
		gap: 0.5rem;
	}

	.tab {
		padding: 1rem 1.5rem;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 500;
		color: #666;
		border-bottom: 3px solid transparent;
		transition: all 0.3s ease;
	}

	.tab:hover {
		color: #007bff;
		background: #f8f9fa;
	}

	.tab.active {
		color: #007bff;
		border-bottom-color: #007bff;
		background: #f8f9fa;
	}

	.policy-content {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.policy-title {
		background: #007bff;
		color: white;
		padding: 1rem 2rem;
	}

	.policy-title h3 {
		margin: 0;
		font-size: 1.3rem;
	}

	.rendered-content {
		padding: 2rem;
		line-height: 1.6;
		color: #333;
		max-height: 600px;
		overflow-y: auto;
	}

	.rendered-content :global(h1) {
		color: #1a1a1a;
		border-bottom: 2px solid #007bff;
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.rendered-content :global(h2) {
		color: #007bff;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.rendered-content :global(h3) {
		color: #333;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.rendered-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	.rendered-content :global(th),
	.rendered-content :global(td) {
		border: 1px solid #dee2e6;
		padding: 0.75rem;
		text-align: left;
	}

	.rendered-content :global(th) {
		background: #f8f9fa;
		font-weight: 600;
	}

	.rendered-content :global(ul),
	.rendered-content :global(ol) {
		margin-bottom: 1rem;
		padding-left: 2rem;
	}

	.rendered-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.rendered-content :global(p) {
		margin-bottom: 1rem;
	}

	.rendered-content :global(strong) {
		color: #007bff;
	}

	@media (max-width: 768px) {
		.policy-tabs {
			flex-direction: column;
		}

		.tab {
			text-align: center;
		}

		.action-buttons {
			flex-direction: column;
			align-items: center;
		}

		.secondary-btn,
		.export-btn {
			width: 100%;
			max-width: 300px;
		}

		.rendered-content {
			padding: 1rem;
		}
	}
</style>
