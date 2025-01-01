<script lang="ts">
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ArrowLeft from 'carbon-icons-svelte/lib/ArrowLeft.svelte';
	import { modalStore, toastStore } from '@skeletonlabs/skeleton';
	import { months } from '$lib/utils/months';
	import { onMount } from 'svelte';
	import { range } from '$lib/utils/range';

	export let date: Date;

	let header = '';
	let maxDays = 0;
	let days: any[] = [];

	onMount(() => {
		update();
	});

	function update() {
		header = `${months[date.getMonth()]} ${date.getFullYear()}`;
		maxDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

		const dayOfWeek = date.getDay();
		for (let i = 0; i < dayOfWeek - 1; i++) {
			days.push(null);
		}

		days = [...days, ...range(1, maxDays + 1)];
	}

	function nextMonth() {
		date.setMonth(date.getMonth() + 1);
		update();
	}

	function prevMonth() {
		date.setMonth(date.getMonth() - 1);
		update();
	}

	function submit(day: number) {
		if ($modalStore[0].response)
			$modalStore[0].response({
				day,
				year: date.getFullYear(),
				month: date.getMonth() + 1,
			});
		modalStore.close();
	}
</script>

<div class="variant-filled-surface p-4 xl:p-8 rounded-xl shadow-lg space-y-4">
	<div class="w-full flex gap-8 justify-between items-center">
		<button on:click={prevMonth}> <ArrowLeft size={24} /> </button>
		<div class="text-xl text-center xl:w-[330px]">{header}</div>
		<button on:click={nextMonth}> <ArrowRight size={24} /> </button>
	</div>
	<div class="w-full grid grid-cols-7">
		<div class="p-4 text-center font-extrabold">Mo</div>
		<div class="p-4 text-center font-extrabold">Tu</div>
		<div class="p-4 text-center font-extrabold">We</div>
		<div class="p-4 text-center font-extrabold">Th</div>
		<div class="p-4 text-center font-extrabold">Fr</div>
		<div class="p-4 text-center font-extrabold">Sa</div>
		<div class="p-4 text-center font-extrabold">Su</div>
		{#each days as day, index}
			<button
				class="p-4 text-center {index % 7 == 6
					? 'text-rose-600 font-bold'
					: ''} aspect-square rounded-full hover:bg-surface-800 transition-all duration-150 ease-in-out"
				disabled={day == null}
				on:click={() => submit(day)}
			>
				{day == null ? '' : day}
			</button>
		{/each}
	</div>
</div>
