import { config } from "$lib/config";
import type { Emotion } from "$lib/interfaces/emotion.interface";
import { type UserStore } from "$lib/interfaces/user-store.interface";
import { userStore } from "$lib/stores/user.store";

export class EmotionsService {
  private static instance: EmotionsService;
  private static user: UserStore;

  constructor() {
    userStore.subscribe((value) => {
      EmotionsService.user = value;
    });
  }

  public static getInstance(): EmotionsService {
    if (!EmotionsService.instance) {
      EmotionsService.instance = new EmotionsService();
    }
    return EmotionsService.instance;
  }

  async create(content: Partial<Emotion>): Promise<Emotion> {
    const res = await fetch(config.apiBaseUrl + '/emotions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionsService.user.access_token,
      },
      body: JSON.stringify(content)
    });

    const emotion = res.json();

    return emotion;
  }

  async getEmotions(): Promise<Emotion[]> {
    const res = await fetch(config.apiBaseUrl + '/emotions/mine', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionsService.user.access_token,
      },
    });

    const emotions = res.json();
    return emotions;
  }

  async update(id: number, data: any) {
    const res = await fetch(config.apiBaseUrl + '/emotions/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionsService.user.access_token,
      },
      body: JSON.stringify(data)
    });

    const emotion = res.json();

    return emotion;
  }

  async delete(id: number) {
    await fetch(config.apiBaseUrl + '/emotions/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionsService.user.access_token,
      },
    });
  }
}