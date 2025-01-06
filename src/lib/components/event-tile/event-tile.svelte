<script lang="ts">
	import type { Event } from '$lib/interfaces/event.interface';
	import { months } from '$lib/utils/months';

	export let event: Event;
	export let region: string = '';

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

<div class="w-full px-4 xl:px-8 py-4 space-y-2 relative {region}">
	<div
		class="absolute top-0 left-0 h-12 w-1 animate-pulse"
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
	{#if event.description}
		<div class="text-gray-300 text-lg">{event.description}</div>
	{/if}
</div>
