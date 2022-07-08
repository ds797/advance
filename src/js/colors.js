export const hexify = ({ h = 0, s = 100, l = 50 }) => {
	s /= 100;
	l /= 100;

	let a = s * Math.min(l, 1 - l);
  let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return `#${Math.floor(f(0) * 255).toString(16).padStart(2, '0')}${Math.floor(f(8) * 255).toString(16).padStart(2, '0')}${Math.floor(f(4) * 255).toString(16).padStart(2, '0')}`;
}