<script lang="ts">
	import type { Event } from '$lib/interfaces/event.interface';
	import { months } from '$lib/utils/months';

	export let event: Event;

	function displayDate(d: Date) {
		const day = d.getDate();
		const month = months[d.getMonth()];
		const year = d.getFullYear();
		let hour = d.getHours().toString();
		let minute = d.getMinutes().toString();

		if (hour.length == 1) hour = '0' + hour;
		if (minute.length == 1) minute = '0' + minute;

		return `${day < 10 ? '0' + day : day} ${month} ${year}, ${hour}:${minute}`;
	}
</script>

<div
	class="w-full pr-4 xl:pr-8 pl-8 xl:pl-10 py-4 space-y-2 relative variant-filled-surface rounded-xl shadow-lg mb-4 overflow-hidden"
>
	<div
		class="absolute top-0 left-0 h-full w-2 xl:w-4 animate-pulse"
		style="background-color: {event.color};"
	/>
	<div class="flex flex-col xl:flex-row gap-2 xl:justify-between">
		<div class="text-2xl">{event.name}</div>
		<div class="xl:w-[300px] text-right text-gray-300">
			<div>From: {displayDate(new Date(event.start))}</div>
			{#if event.end}
				<div>To: {displayDate(new Date(event.end))}</div>
			{/if}
		</div>
	</div>
	<div
		class="text-gray-300 text-lg
  {event.description && event.description.length > 0 ? '' : 'italic'}"
	>
		{event.description && event.description.length > 0 ? event.description : 'No description.'}
	</div>
</div>
