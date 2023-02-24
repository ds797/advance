import { random } from './math';

export const title = () => {
	const titles = [{
		title: 'Party!',
		description: 'All night'
	}, {
		title: 'Work',
		description: 'Bring laptop'
	}, {
		title: 'Spend time with friends',
		description: 'Pre-order lunch'
	}, {
		title: 'Family dinner',
		description: 'At Mom\'s house'
	}];
	return titles[random(titles.length - 1)];
}