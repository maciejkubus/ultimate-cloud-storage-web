<script lang="ts">
	import ExpenceAdder from '$lib/components/expence-adder/expence-adder.svelte';
	import ExpencesList from '$lib/components/expences-list/expences-list.svelte';
	import PaginationBar from '$lib/components/pagination-bar/pagination-bar.svelte';
	import EventCreator from '$lib/components/event-creator/event-creator.svelte';
	import TaskList from '$lib/components/task-list/task-list.svelte';
	import TaskTile from '$lib/components/task-tile/task-tile.svelte';
	import type { Event } from '$lib/interfaces/event.interface';
	import type { Expence } from '$lib/interfaces/expence.interface';
	import type { Paginated } from '$lib/interfaces/paginated.interface';
	import { EventsService } from '$lib/services/events.service';
	import { ExpencesService } from '$lib/services/expences.service';
	// import { Expence } from '$lib/interfaces/expence.interface';
	import { pageMetadataStore } from '$lib/stores/page-metadata.store';
	import { months } from '$lib/utils/months';
	import { onMount } from 'svelte';
	import EventCalendar from '$lib/components/event-calendar/event-calendar.svelte';
	import EmotionCreator from '$lib/components/emotion-creator/emotion-creator.svelte';
	import EmotionsList from '$lib/components/emotions-list/emotions-list.svelte';

	onMount(async () => {
		pageMetadataStore.set({
			title: 'Emotions',
		});
	});
</script>

<svelte:head>
	<title>Ultimate Cloud Storage - Emotions</title>
</svelte:head>

<div class="w-full py-8 flex flex-col lg:flex-row gap-8">
	<EmotionsList />
	<div class="w-full lg:w-3/4">dupa</div>
</div>
