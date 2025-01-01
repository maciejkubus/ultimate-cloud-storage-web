export interface Event {
    id?: number;
    created?: string;
    updated?: string;
    name: string;
    description?: string;
    type: "event" | "task";
    color: string;
    start: string;
    end?: string;
}