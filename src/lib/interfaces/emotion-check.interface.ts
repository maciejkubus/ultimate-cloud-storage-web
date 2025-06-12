import type { Emotion } from "./emotion.interface";

export interface EmotionCheck {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  emotions: Emotion[]
}