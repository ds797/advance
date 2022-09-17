import { get } from 'svelte/store';
import { stack } from '../js/stores';

export const error = e => {
	stack.set([...get(stack), { type: 'error', message: e }]);
}