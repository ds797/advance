import * as eases from 'svelte/easing';

export const spin = (node, { deg = 45, duration = 400, easing = eases.cubicOut }) => {
	return {
		duration,
		easing,
		css: (t, u) => `
			opacity: ${t};
			transform: rotate(${u * deg}deg);`
	};
}

export const shift = (node, {
	delay = 0,
	duration = 400,
	easing = eases.cubicOut,
	x = 0,
	y = 0,
	type = 'top',
	units = 'px'
}) => {
	return {
		delay,
		duration,
		easing,
		css: t => `
			margin-${type}: ${(1 - t) * ((type === 'top' || type === 'bottom') ? y : x)}${units};`
	};
}

export const fly = (node, {
	delay = 0,
	duration = 400,
	easing = eases.cubicOut,
	x = 0,
	y = 0,
	units = 'px'
}) => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	const width = parseInt(style.width);

	return {
		delay,
		duration,
		easing,
		css: t => `
			transform: ${transform} translate(${(1 - t) * x}${units}, ${(1 - t) * y}${units});
			${t < 0.5 ? `width: ${0}px;` : `width: ${width}px;`}
			overflow: shown;`
	};
}

export const day = (
	node,
	{ axis = 'height', delay = 0, duration = 300, easing = eases.cubicOut }
) => {
	const height = parseFloat(getComputedStyle(node)[axis]);

	return {
		delay,
		duration,
		easing,
		css: t => `
			overflow: hidden;
			${axis}: ${t * height}px;
		`
	};
}

export const slide = (
	node,
	{ axis = 'height', delay = 0, duration = 300, easing = eases.cubicOut, fade = false }
) => {
	const style = getComputedStyle(node);
	const height = parseFloat(style[axis]);
	const padding = { top: parseFloat(style.paddingTop), right: parseFloat(style.paddingRight), bottom: parseFloat(style.paddingBottom), left: parseFloat(style.paddingLeft) };
	const opacity = +style.opacity;

	if (axis === 'both') {
		const width = parseFloat(style.width);
		const height = parseFloat(style.height);
		if (fade) {
			return {
				delay,
				duration,
				easing,
				css: t => `
					overflow: hidden;
					width: ${t * width}px;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
				`
			};
		} else {
			return {
				delay,
				duration,
				easing,
				css: t => `
					overflow: hidden;
					width: ${t * width}px;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
					opacity: ${t * opacity};
				`
			};
		}
	}

	if (fade) {
		if (axis === 'height') {
			return {
				delay,
				duration,
				easing,
				css: t => `
					overflow: hidden;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
					opacity: ${t * opacity};
				`
			};
		} else if (axis === 'width') {
			return {
				delay,
				duration,
				easing,
				css: t => `
					overflow: hidden;
					width: ${t * height}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
					opacity: ${t * opacity};
				`
			};
		}
	} else {
		if (axis === 'height') {
			return {
				delay,
				duration,
				easing,
				css: t => `
					overflow: hidden;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
				`
			};
		} else if (axis === 'width') {
			return {
				delay,
				duration,
				easing,
				css: t => `
					overflow: hidden;
					width: ${t * height}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
				`
			};
		}
	}
}

export const motion = (node, { movement, transition }) => {
	const { x = 0, y = 0, units = 'px', fade = true } = movement;
	const { delay = 0, duration = 400 } = transition || {};
	const easing = eases[transition?.easing] ?? eases.cubicOut;

	const style = getComputedStyle(node);

	return {
		delay,
		duration,
		easing,
		css: t => `
		${fade ? `opacity: ${t * +style.opacity};` : ''}
		transform: translate(${t * x - x}${units}, ${t * y - y}${units});`
	};
}

export const draw = (node, params) => {
	const len = node.getTotalLength();

	return {
		delay: params.delay,
		duration: params.duration || 800,
		easing: params.easing || eases.cubicOut,
		css: (t, u) => `stroke-dasharray: ${(params.reverse ? u : t) * len} ${(params.reverse ? t : u) * len}`
	};
}