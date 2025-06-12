import { config } from "$lib/config";
import type { EmotionCheck } from "$lib/interfaces/emotion-check.interface";
import { type UserStore } from "$lib/interfaces/user-store.interface";
import { userStore } from "$lib/stores/user.store";

export class EmotionCheckService {
  private static instance: EmotionCheckService;
  private static user: UserStore;

  constructor() {
    userStore.subscribe((value) => {
      EmotionCheckService.user = value;
    });
  }

  public static getInstance(): EmotionCheckService {
    if (!EmotionCheckService.instance) {
      EmotionCheckService.instance = new EmotionCheckService();
    }
    return EmotionCheckService.instance;
  }

  async create(content: EmotionCheck): Promise<EmotionCheck> {
    const res = await fetch(config.apiBaseUrl + '/emotion-checks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionCheckService.user.access_token,
      },
      body: JSON.stringify(content)
    });

    const emotionCheck = res.json();

    return emotionCheck;
  }

  async getEmotionChecks(): Promise<EmotionCheck[]> {
    const res = await fetch(config.apiBaseUrl + '/emotion-checks/mine', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionCheckService.user.access_token,
      },
    });

    const emotionChecks = res.json();
    return emotionChecks;
  }

  async update(id: number, data: any) {
    const res = await fetch(config.apiBaseUrl + '/emotion-checks/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionCheckService.user.access_token,
      },
      body: JSON.stringify(data)
    });

    const emotionChecks = res.json();

    return emotionChecks;
  }

  async delete(id: number) {
    await fetch(config.apiBaseUrl + '/emotion-checks/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionCheckService.user.access_token,
      },
    });
  }

  async addEmotion(emotionCheckId: number, emotionId: number) {
    const res = await fetch(config.apiBaseUrl + '/emotion-checks/' + emotionCheckId + '/add/' + emotionId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionCheckService.user.access_token,
      },
    });

    return res.ok;
  }

  async removeEmotion(emotionCheckId: number, emotionId: number) {
    const res = await fetch(config.apiBaseUrl + '/emotion-checks/' + emotionCheckId + '/add/' + emotionId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + EmotionCheckService.user.access_token,
      },
    });

    return res.ok;
  }
}