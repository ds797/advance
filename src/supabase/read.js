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
				title: item.title,
				description: item.description,
				start: item.start ? new Timestamp(new Date(item.start)) : undefined,
				finish: item.finish ? new Timestamp(new Date(item.finish)) : undefined,
				completed: item.completed,
				color: { h: item.h, s: item.s, v: item.v },
				cal: item.cal,
				id: item.id
			});
		}
	}

	console.log({ items })

	return items;
}