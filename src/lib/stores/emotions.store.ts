import type { Emotion } from '$lib/interfaces/emotion.interface';
import { writable, type Writable } from 'svelte/store';

export const emotionsStore: Writable<Emotion[]> = writable([]);

