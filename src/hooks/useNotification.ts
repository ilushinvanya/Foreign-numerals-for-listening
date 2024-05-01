import { mdiAlertDecagramOutline, mdiAlertOutline, mdiCheck } from '@mdi/js';
import { useQuasar } from 'quasar';

export const useNotification = () => {
	const $q = useQuasar()

	const setWarning = (text:string) => {
		$q.notify({
			icon: mdiAlertOutline,
			type: 'warning',
			timeout: 2000,
			message: text
		})
	}

	const setSuccess = (text:string) => {
		$q.notify({
			icon: mdiCheck,
			type: 'positive',
			timeout: 1000,
			message: text
		})
	}

	const setError = (text:string) => {
		$q.notify({
			icon: mdiAlertDecagramOutline,
			type: 'negative',
			timeout: 2000,
			message: text
		})
	}

	return {
		setWarning, setSuccess, setError
	}
}