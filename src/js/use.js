import { convert } from './timestamp/functions';
import { u } from './supabase/functions';

export function event(node, item) {
	let marginTop;
	let mouse = { x: null, y: null };
	let parent = node.parentElement;

	const down = e => {
		if (e.target !== node) return;
		e.stopPropagation();

		marginTop = node.style.marginTop;
		mouse = { x: e.clientX, y: e.clientY };
	}

	const move = e => {
		if (!mouse.y) return;

		console.log(document.elementsFromPoint(e.clientX, e.clientY));

		const y = e.clientY - mouse.y;
		if (-5 < y && y < 5) return;
		if (0 <= parseInt(marginTop) + y && node.getBoundingClientRect().bottom < window.innerHeight) {
			node.style.marginTop = `${parseInt(marginTop) + y}px`;
		}
	}

	const up = () => {
		if (!mouse.y) return;

		if (marginTop === node.style.marginTop) {
			node.dispatchEvent(new CustomEvent('up'));
		} else {
			const time = convert([node.getBoundingClientRect()], parent.getBoundingClientRect())[0];
			const hdiff = item.finish.hours - item.start.hours;
			const mdiff = item.finish.minutes - item.start.minutes;
			item.start.setHours(time.hours);
			item.start.setMinutes(time.minutes);
			item.finish.setHours(time.hours + hdiff);
			item.finish.setMinutes(time.minutes + mdiff);
			u({
				id: item.id,
				start: item.start,
				end: item.finish
			});
		}
		mouse = { x: null, y: null }
	}

	const click = e => {
		if (e.target === node) e.stopPropagation();
	}

	document.addEventListener('mousedown', down, true);
	document.addEventListener('mousemove', move, true);
	document.addEventListener('mouseup', up, true);
	document.addEventListener('click', click, true);

	return function destroy() {
		document.removeEventListener('mousedown', down, true);
		document.removeEventListener('mousemove', move, true);
		document.removeEventListener('mouseup', up, true);
		document.removeEventListener('click', click, true);
	};
}

export const clickoutside = node => {
	const click = () => {
		node.dispatchEvent(new CustomEvent('outside'));
	}

	document.addEventListener('click', click, true);

	return function destroy() {
		document.removeEventListener('click', click, true);
	}
}