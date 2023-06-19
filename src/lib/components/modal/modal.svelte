<script lang="ts">
	export const containerClass = '';
	export const headerClass = 'text-2xl font-bold';
	export const bodyClass = '';
	export const footerClass = '';
</script>

<div class="card p-4 w-modal shadow-xl space-y-4 {containerClass}">
	{#if $$slots.header}
		<div class={headerClass}>
			<slot name="header" />
		</div>
	{/if}
	{#if $$slots.body}
		<div class={bodyClass}>
			<slot name="body" />
		</div>
	{/if}
	{#if $$slots.footer}
		<div class={footerClass}>
			<slot name="footer" />
		</div>
	{/if}
</div>
