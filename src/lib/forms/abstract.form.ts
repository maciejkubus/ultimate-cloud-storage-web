export abstract class AbstractForm {
	sent: boolean;
	loading: boolean;
	abstract submit(values: any): void;

	constructor() {
		this.sent = false;
		this.loading = false;
	}
}
