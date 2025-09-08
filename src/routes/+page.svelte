<script lang="ts">
	import type { PolicyFormData, SecurityFramework, PolicySet } from '$lib/types';
	import PolicyPreview from '$lib/components/PolicyPreview.svelte';

	let formData: PolicyFormData = {
		organizationName: '',
		framework: 'PCI-DSS',
		constraints: ''
	};

	let isLoading = false;
	let generatedPolicies: PolicySet | null = null;
	let error: string | null = null;

	const frameworkOptions: SecurityFramework[] = [
		'PCI-DSS',
		'HIPAA',
		'NIST 800-171',
		'CMMC Level 1'
	];

	const constraintExamples = [
		'Remote workforce, cloud infrastructure',
		'Healthcare data, patient privacy requirements',
		'Financial transactions, multi-tenant SaaS',
		'IoT devices, edge computing environments',
		'Third-party integrations, API security'
	];

	async function handleSubmit() {
		if (!isFormValid) return;

		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/generate-policies', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error(`Failed to generate policies: ${response.statusText}`);
			}

			generatedPolicies = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
		} finally {
			isLoading = false;
		}
	}

	$: isFormValid =
		formData.organizationName.trim().length > 0 &&
		formData.organizationName.trim().length <= 20 &&
		formData.constraints.trim().length > 0 &&
		formData.constraints.trim().length <= 500;

	function resetForm() {
		generatedPolicies = null;
		error = null;
		formData = {
			organizationName: '',
			framework: 'PCI-DSS',
			constraints: ''
		};
	}
</script>

<div class="container">
	<header>
		<h1>Security Policy Generator</h1>
		<p>
			We set out to discover the best LLM to generate cybersecurity policies and along the way we
			also found the worst. <br />This generator uses our worst-ranking LLM and should not be used
			in production. It was designed for cybersecurity students to conduct mock audits.
		</p>
	</header>

	{#if !generatedPolicies}
		<form on:submit|preventDefault={handleSubmit} class="policy-form">
			<div class="form-group">
				<label for="organizationName">Organization Name *</label>
				<input
					id="organizationName"
					type="text"
					bind:value={formData.organizationName}
					placeholder="Enter organization name"
					maxlength="20"
					required
				/>
				<span class="char-count">{formData.organizationName.length}/20</span>
			</div>

			<div class="form-group">
				<label for="framework">Compliance Framework *</label>
				<select id="framework" bind:value={formData.framework} required>
					{#each frameworkOptions as option (option)}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<div class="form-group">
				<label for="constraints">Specific Constraints & Considerations *</label>
				<textarea
					id="constraints"
					bind:value={formData.constraints}
					placeholder="Describe your specific roles, systems, data types, or constraints. Examples: {constraintExamples.join(
						', '
					)}"
					maxlength="500"
					rows="4"
					required
				></textarea>
				<span class="char-count">{formData.constraints.length}/500</span>
			</div>

			{#if error}
				<div class="error-message">
					{error}
				</div>
			{/if}

			<button type="submit" disabled={!isFormValid || isLoading} class="submit-btn">
				{#if isLoading}
					Generating Policies...
				{:else}
					Generate Security Policies
				{/if}
			</button>
		</form>
	{:else}
		<PolicyPreview
			policies={generatedPolicies}
			organizationName={formData.organizationName}
			framework={formData.framework}
			on:reset={resetForm}
		/>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	header h1 {
		font-size: 2.5rem;
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	header p {
		color: #666;
		font-size: 1.1rem;
	}

	.policy-form {
		background: #f9f9f9;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 1.5rem;
		position: relative;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #333;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.3s ease;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #007bff;
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.char-count {
		position: absolute;
		bottom: -1.5rem;
		right: 0;
		font-size: 0.875rem;
		color: #666;
	}

	.submit-btn {
		width: 100%;
		background: #007bff;
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		font-weight: 600;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		margin-top: 1rem;
	}

	.submit-btn:hover:not(:disabled) {
		background: #0056b3;
	}

	.submit-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error-message {
		background: #f8d7da;
		color: #721c24;
		padding: 0.75rem;
		border-radius: 4px;
		border: 1px solid #f5c6cb;
		margin-bottom: 1rem;
	}
</style>
