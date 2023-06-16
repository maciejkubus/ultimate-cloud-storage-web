<div class="w-full" {...$$restProps}>
	<label class="label">
		<div>
			<slot name="label" />
		</div>
		<slot name="input" />
		<div class="w-full h-6 text-error-500 -mt-2">
			<slot name="error" />
		</div>
	</label>
</div>
