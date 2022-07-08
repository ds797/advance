import { get } from 'svelte/store';

export const error = e => {
	notifications.set([...get(notifications), e]);
}