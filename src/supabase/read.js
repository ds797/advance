import { supabase } from "./init";
import Timestamp from "../timestamp/Timestamp";

export const read = async () => {
	let items = [];

	const { data, error, status } = await supabase
		.from('items')
		.select('*');

	if (error || status === 406) console.error(error);

	if (data) {
		for (let item of data) {
			items.push({
				cal: item.cal,
				color: { h: item.h, s: item.s, v: item.v },
				completed: item.completed,
				description: item.description,
				id: item.id,
				start: item.start ? new Timestamp(new Date(item.start)) : undefined,
				finish: item.finish ? new Timestamp(new Date(item.finish)) : undefined,
				title: item.title
			});
		}
	}

	return items;
}