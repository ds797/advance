export const date = ({ year = 0, month = 0, date = 1, hour = 0, minute = 0, second = 0, milli = 0 }) => {
	return new Date(year, month, date, hour, minute, second, milli);
}