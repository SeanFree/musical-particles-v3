import CompositeLayer from '@/controllers/CompositeLayer'
import {
	TAU,
	sin,
	cos
} from '@/common/util'

export const SPECTRUM_DEFAULTS = {
	spectrumType: 'radial',
	backlight: true,
	backlightRadius: 160,
	startAngle: 0.75,
	spectrumRadius: 160,
	segmentLengthMin: 0,
	segmentLengthMax: 100,
	reflect: false,
	baseHue: 160,
	rangeHue: 120,
	originX: 0.5,
	originY: 0.5,
	glow: true,
	frequencyCount: 0
}

export const SPECTRUM_CONFIG = {
	spectrumType: {
		type: 'string',
		options: [
			'linear',
			'radial'
		],
		init: true,
		value: SPECTRUM_DEFAULTS.spectrumType
	},
	backlight: {
		type: 'boolean',
		value: SPECTRUM_DEFAULTS.backlight
	},
	backlightRadius: {
		type: 'number',
		step: 1,
		min: 0,
		max: 800,
		value: SPECTRUM_DEFAULTS.backlightRadius
	},
	startAngle: {
		type: 'number',
		step: 0.05,
		min: 0,
		max: 1,
		value: SPECTRUM_DEFAULTS.startAngle
	},
	spectrumRadius: {
		type: 'number',
		step: 1,
		min: 0,
		max: 300,
		init: true,
		value: SPECTRUM_DEFAULTS.spectrumRadius
	},
	segmentLengthMin: {
		type: 'number',
		step: 1,
		min: 0,
		max: 100,
		value: SPECTRUM_DEFAULTS.segmentLengthMin
	},
	segmentLengthMax: {
		type: 'number',
		step: 1,
		min: 0,
		max: 300,
		value: SPECTRUM_DEFAULTS.segmentLengthMax
	},
	reflect: {
		type: 'boolean',
		init: true,
		value: SPECTRUM_DEFAULTS.reflect
	},
	baseHue: {
		type: 'number',
		step: 1,
		min: 0,
		max: 360,
		value: SPECTRUM_DEFAULTS.baseHue
	},
	rangeHue: {
		type: 'number',
		step: 1,
		min: 0,
		max: 360,
		value: SPECTRUM_DEFAULTS.rangeHue
	},
	originX: {
		type: 'number',
		step: 0.05,
		min: 0,
		max: 1,
		value: SPECTRUM_DEFAULTS.originX
	},
	originY: {
		type: 'number',
		step: 0.05,
		min: 0,
		max: 1,
		value: SPECTRUM_DEFAULTS.originY
	},
	glow: {
		type: 'boolean',
		value: SPECTRUM_DEFAULTS.glow
	}
}

export default class SpectrumVisualizer extends CompositeLayer {
	constructor(w, h, options) {
		super(w, h)
		this.options = Object.assign({}, SPECTRUM_DEFAULTS, options)
		this.init()
	}
	init() {
		this.spectrumWidth = this.options.frequencyCount
		this.spread = this.spectrumWidth * (this.options.reflect ? 2 : 1)
		this.segmentWidth =
			this.options.spectrumRadius /
			(this.spectrumWidth * (this.options.reflect ? 0.5 : 0.25))
		this.baseRadius = this.options.spectrumRadius
		this.normalizedAverageFrequency = 0
		this.drawSegment =
			this.options.spectrumType === 'linear'
				? this.drawLinearSegment
				: this.drawRadialSegment
	}
	setNormalizedAverageFrequency(normalizedAverageFrequency) {
		this.normalizedAverageFrequency = normalizedAverageFrequency
	}
	update() {
		this.buffer.clearRect(0, 0, this.width, this.height)
		this.scaledRadius =
			this.options.spectrumRadius * (1 + this.normalizedAverageFrequency)
		this.options.backlight && this.drawBacklight()
	}
	render(index, data) {
		if (this.options.reflect) {
			this.drawSegment(index, data)
			this.drawSegment(-index - 1, data)
		} else {
			this.drawSegment(index, data)
		}
	}
	drawBacklight() {
		let bx, by, hue, gradient

		bx = this.options.originX * this.width
		by = this.options.originY * this.height
		hue =
			this.options.baseHue +
			this.options.rangeHue * (1 - this.normalizedAverageFrequency)
		gradient = this.buffer.createRadialGradient(
			bx,
			by,
			0,
			bx,
			by,
			this.options.backlightRadius * (1 + this.normalizedAverageFrequency)
		)
		gradient.addColorStop(
			0,
			`hsla(${hue}, 75%, 50%, ${this.normalizedAverageFrequency})`
		)
		gradient.addColorStop(1, `hsla(${hue}, 75%, 40%, 0)`)
		this.buffer.fillStyle = gradient
		this.buffer.fillRect(0, 0, this.width, this.height)
	}
	drawRadialSegment(index, data) {
		let t, cosT, sinT, x1, y1, x2, y2, hue, scale

		t = (TAU * this.options.startAngle) + index / this.spread * TAU
		cosT = cos(t)
		sinT = sin(t)
		x1 = this.options.originX * this.width + this.scaledRadius * cosT
		y1 = this.options.originY * this.height + this.scaledRadius * sinT
		hue = this.options.baseHue + this.options.rangeHue * (1 - data)
		scale = this.options.segmentLengthMin + (data * this.options.segmentLengthMax)
		x2 = x1 + scale * cosT
		y2 = y1 + scale * sinT

		this.buffer.lineWidth = this.segmentWidth
		this.buffer.strokeStyle = `hsla(${hue}, 75%, 50%, 0.8)`
		this.buffer.beginPath()
		this.buffer.moveTo(x1, y1)
		this.buffer.lineTo(x2, y2)
		this.buffer.stroke()
		this.buffer.closePath()
	}
	drawLinearSegment(index, data) {
		let x, y, lineWidth, hue, scale

		scale = this.options.segmentLengthMin + (data * this.options.segmentLengthMax)
		x =
			index /
				this.options.frequencyCount *
				(this.width * (this.options.reflect ? 0.5 : 1)) +
			(this.options.reflect ? 0.5 * this.width : 0)
		y =
			this.height * this.options.originY +
			(scale - scale * this.options.originY)
		lineWidth = this.segmentWidth
		hue = this.options.baseHue + this.options.rangeHue * (1 - data)

		this.buffer.lineWidth = lineWidth
		this.buffer.strokeStyle = `hsla(${hue}, 75%, 50%, 0.8)`
		this.buffer.beginPath()
		this.buffer.moveTo(x + lineWidth, y)
		this.buffer.lineTo(x + lineWidth, y - scale)
		this.buffer.stroke()
		this.buffer.closePath()
	}
}
