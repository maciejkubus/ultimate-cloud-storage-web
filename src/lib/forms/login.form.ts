import type { LoginData } from '$lib/interfaces/login-data.interface';
import { createForm } from 'svelte-forms-lib';
import * as yup from 'yup';
import { AbstractForm } from './abstract.form';

export class LoginForm extends AbstractForm {
	constructor() {
		super();
	}

	createForm() {
		return createForm({
			initialValues: {
				username: '',
				password: '',
			},
			validationSchema: yup.object().shape({
				username: yup.string().required('Please enter your username'),
				password: yup.string().required('Please enter your password'),
			}),
			onSubmit: this.submit,
		});
	}

	submit(values: LoginData): void {
		this.loading = true;
		try {
			console.log(values);
			throw new Error('Method not implemented.');
			this.sent = true;
		} catch (e) {
			console.log(e);
		} finally {
			this.loading = false;
		}
	}
}
