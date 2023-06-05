import type { RegisterData } from '$lib/interfaces/register-data.interface';
import { createForm } from 'svelte-forms-lib';
import * as yup from 'yup';
import { AbstractForm } from './abstract.form';

export class RegisterForm extends AbstractForm {
	constructor() {
		super();
	}

	createForm() {
		return createForm({
			initialValues: {
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
				privacyPolicy: false,
			},
			validationSchema: yup.object().shape({
				username: yup.string().required('Please enter your username'),
				email: yup
					.string()
					.email('Please enter a valid email address')
					.required('Please enter your email'),
				password: yup
					.string()
					.required('Please enter your password')
					.min(8, 'Password must be at least 8 characters'),
				confirmPassword: yup
					.string()
					.required('Please confirm your password')
					.oneOf([yup.ref('password')], 'Passwords must match'),
				privacyPolicy: yup.boolean().oneOf([true], 'Please accept the privacy policy'),
			}),
			onSubmit: this.submit,
		});
	}

	submit(values: RegisterData): void {
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
