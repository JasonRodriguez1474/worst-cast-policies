<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { fade } from 'svelte/transition';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Security Policy Generator | FSP Research</title>
	<meta
		name="description"
		content="AI-powered security policy generation for cybersecurity education and training"
	/>
</svelte:head>

<div class="app-layout">
	<header class="app-header">
		<nav class="nav-container">
			<div class="brand">
				<div class="logo-section">
					<a href="https://fs-platforms.com/" class="gradient-text-link" target="_blank">
						<h1 class="gradient-text">FSP Research</h1>
					</a>
					<span class="tagline">Security Policy Innovation</span>
				</div>
			</div>
			<div class="nav-info">
				<span class="beta-badge">Educational Tool</span>
			</div>
		</nav>
	</header>

	<main class="main-content" transition:fade={{ duration: 300 }}>
		{@render children?.()}
	</main>

	<footer class="app-footer">
		<div class="footer-content">
			<div class="footer-brand">
				<a href="https://fs-platforms.com/" class="gradient-text-link" target="_blank">
					<h3 class="gradient-text">FSP Research</h3>
				</a>
				<p>Advancing cybersecurity education through innovative AI-powered tools and research.</p>
			</div>
			<div class="footer-links">
				<div class="footer-section">
					<h4>Research</h4>
					<p class="footer-note">
						This tool uses the lowest-performing LLM we've benchmarked, and thus is for educational
						purposes only.
					</p>
				</div>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2025 <a href="https://fs-platforms.com/" class="gradient-text-link" target="_blank">FSP Research</a>. Built for cybersecurity education and training.</p>
		</div>
	</footer>
</div>

<style>
	.app-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.app-header {
		background: var(--gradient-primary);
		color: white;
		box-shadow: var(--shadow-lg);
		position: relative;
		overflow: hidden;
	}

	.app-header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 70%);
		pointer-events: none;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo-section h1 {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 700;
		background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: -0.025em;
	}

	.tagline {
		font-size: 0.875rem;
		font-weight: 400;
		opacity: 0.9;
		font-style: italic;
		display: block;
		margin-top: -0.25rem;
	}

	.nav-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.beta-badge {
		background: var(--fsp-orange);
		color: white;
		padding: 0.375rem 0.75rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		box-shadow: var(--shadow-sm);
		animation: pulse 3s infinite;
	}

	.main-content {
		flex: 1;
		padding: 2rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.app-footer {
		background: var(--fsp-dark-gray);
		color: white;
		margin-top: 4rem;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 2rem 2rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
	}

	.footer-brand h3 {
		margin: 0 0 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		background: linear-gradient(135deg, var(--fsp-light-blue), var(--fsp-orange));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.footer-brand p {
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.6;
		margin: 0;
	}

	.footer-section h4 {
		color: var(--fsp-light-blue);
		margin: 0 0 1rem;
		font-weight: 600;
	}

	.footer-note {
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
		margin: 0;
		font-style: italic;
	}

	.footer-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 2rem;
		text-align: center;
	}

	.footer-bottom p {
		margin: 0;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.875rem;
	}

	.gradient-text-link {
		text-decoration: none;
		color: white;
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 1rem;
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.logo-section h1 {
			font-size: 1.5rem;
		}

		.footer-content {
			grid-template-columns: 1fr;
			gap: 2rem;
			padding: 2rem 1rem;
		}

		.main-content {
			padding: 1rem;
		}
	}

	@media (max-width: 480px) {
		.nav-container {
			padding: 0.75rem;
		}

		.logo-section h1 {
			font-size: 1.25rem;
		}

		.beta-badge {
			font-size: 0.75rem;
			padding: 0.25rem 0.5rem;
		}
	}
</style>
