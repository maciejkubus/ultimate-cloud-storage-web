import { config } from "$lib/config";
import type { Event } from "$lib/interfaces/event.interface";
import { type UserStore } from "$lib/interfaces/user-store.interface";
import { userStore } from "$lib/stores/user.store";

export class EventsService {
  private static instance: EventsService;
  private static user: UserStore;

  constructor() {
    userStore.subscribe((value) => {
      EventsService.user = value;
    });
  }

  public static getInstance(): EventsService {
    if (!EventsService.instance) {
      EventsService.instance = new EventsService();
    }
    return EventsService.instance;
  }

  async create(content: Event): Promise<Event> {
    const res = await fetch(config.apiBaseUrl + '/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EventsService.user.access_token,
      },
      body: JSON.stringify(content)
    });

    const event = res.json();

    return event;
  }

  async getEvents(year: number, month: number): Promise<Event[]> {
    const res = await fetch(config.apiBaseUrl + '/events/' + year + '-' + month, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EventsService.user.access_token,
      },
    });

    const events = res.json();
    return events;
  }

  async update(id: number, data: Event) {
    const res = await fetch(config.apiBaseUrl + '/events/' + id, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + EventsService.user.access_token,
			},
      body: JSON.stringify(data)
		});

    const event = res.json();

    return event;
  }

  async delete(id: number) {
    await fetch(config.apiBaseUrl + '/events/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EventsService.user.access_token,
      },
    });
  }
}