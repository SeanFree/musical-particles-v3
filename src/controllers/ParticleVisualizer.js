import CompositeLayer from '@/controllers/CompositeLayer'
import PropsArray from '@/common/PropsArray'
import {
	TAU,
	rand,
	norm,
	dist,
	fadeInOut,
	pow,
	sin,
	cos,
	angle,
	lerp
} from '@/common/util'

export const PARTICLE_DEFAULTS = {
	baseTTL: 100,
	rangeTTL: 100,
	baseSize: 1,
	rangeSize: 10,
	baseHue: 0,
	rangeHue: 180,
	spawnRadius: 180,
	spawnSector: 1,
	spawnStartAngle: 0.5,
	originX: 0.5,
	originY: 0.5,
	baseSpeed: 1,
	rangeSpeed: 30,
	glow: true,
	frequencyCount: 0
}

export const PARTICLE_CONFIG = {
	baseTTL: {
		type: 'number',
		step: 1,
		min: 0,
		max: 200,
		value: PARTICLE_DEFAULTS.baseTTL
	},
	rangeTTL: {
		type: 'number',
		step: 1,
		min: 0,
		max: 800,
		value: PARTICLE_DEFAULTS.rangeTTL
	},
	baseSize: {
		type: 'number',
		step: 0.5,
		min: 1,
		max: 10,
		value: PARTICLE_DEFAULTS.baseSize
	},
	rangeSize: {
		type: 'number',
		step: 0.5,
		min: 1,
		max: 50,
		value: PARTICLE_DEFAULTS.rangeSize
	},
	baseHue: {
		type: 'number',
		step: 1,
		min: 0,
		max: 360,
		value: PARTICLE_DEFAULTS.baseHue
	},
	rangeHue: {
		type: 'number',
		step: 1,
		min: 0,
		max: 360,
		value: PARTICLE_DEFAULTS.rangeHue
	},
	spawnRadius: {
		type: 'number',
		step: 1,
		min: 50,
		max: 300,
		value: PARTICLE_DEFAULTS.spawnRadius
	},
	spawnSector: {
		type: 'number',
		step: 0.05,
		min: 0,
		max: 1,
		value: PARTICLE_DEFAULTS.spawnSector
	},
	spawnStartAngle: {
		type: 'number',
		step: 0.05,
		min: 0,
		max: 1,
		value: PARTICLE_DEFAULTS.spawnStartAngle
	},
	originX: {
		type: 'number',
		step: 0.05,
		min: 0,
		max: 1,
		value: PARTICLE_DEFAULTS.originX
	},
	originY: {
		type: 'number',
		step: 0.05,
		min: 0,
		max: 1,
		value: PARTICLE_DEFAULTS.originY
	},
	baseSpeed: {
		type: 'number',
		step: 0.5,
		min: 0,
		max: 10,
		value: PARTICLE_DEFAULTS.baseSpeed
	},
	rangeSpeed: {
		type: 'number',
		step: 0.5,
		min: 0,
		max: 50,
		value: PARTICLE_DEFAULTS.rangeSpeed
	},
	glow: {
		type: 'boolean',
		value: PARTICLE_DEFAULTS.glow
	}
}

export default class ParticleVisualizer extends CompositeLayer {
	constructor(w, h, options) {
		super(w, h)
		this.options = Object.assign({}, PARTICLE_DEFAULTS, options)
		this.init()
	}
	init() {
		this.normalizedAverageFrequency = 0
		this.particles = new PropsArray(this.options.frequencyCount, [
			'x',
			'y',
			't',
			'vx',
			'vy',
			'r',
			'l',
			'ttl'
		])
		this.particles.forEach(this.initParticle.bind(this))
	}
	initParticle(v, i) {
		let bx, by, x, y, r, t, p, d, nd, vx, vy, l, ttl

		bx = this.options.originX * this.width
		by = this.options.originY * this.height
		p = (this.options.spawnStartAngle * TAU) + rand(this.options.spawnSector * TAU)
		d = rand(this.options.spawnRadius)
		x = bx + d * cos(p)
		y = by + d * sin(p)
		r = this.options.baseSize
		t = angle(bx, by, x, y)
		nd = norm(dist(bx, by, x, y), 0, this.options.spawnRadius)
		vx = cos(t) * nd
		vy = sin(t) * nd
		l = 0
		ttl = this.options.baseTTL + rand(this.options.rangeTTL)

		this.particles.set([x, y, t, vx, vy, r, l, ttl], i)
	}
	setFrequencyCount(frequencyCount) {
		this.frequencyCount = frequencyCount
	}
	setNormalizedAverageFrequency(normalizedAverageFrequency) {
		this.normalizedAverageFrequency = normalizedAverageFrequency
	}
	update() {
		this.buffer.clearRect(0, 0, this.width, this.height)
	}
	render(index, data) {
		let [x, y, t, vx, vy, r, l, ttl] = this.particles.get(index * this.particles.props.length)
		let bx, by, h, a, nd, sv

		bx = this.options.originX * this.width
		by = this.options.originY * this.height
		nd = norm(dist(x, y, bx, by), 0, this.options.spawnRadius)
		h =
			this.options.baseHue +
			this.options.rangeHue * (index / this.options.frequencyCount + (1 - data))
		a = data * fadeInOut(l, ttl)
		r =
			this.options.baseSize +
			pow(data + this.normalizedAverageFrequency, 2) * this.options.rangeSize
		sv =
			this.options.baseSpeed +
			pow(data + this.normalizedAverageFrequency, 2) *
			this.options.rangeSpeed * nd
		vx = cos(t) * sv
		vy = sin(t) * sv
		x = lerp(x, x + vx, 0.15)
		y = lerp(y, y + vy, 0.15)
		l++

		this.buffer.fillStyle = `hsla(${h}, 85%, 50%, ${a})`
		this.buffer.beginPath()
		this.buffer.arc(x, y, r, 0, TAU)
		this.buffer.fill()
		this.buffer.closePath()
		this.particles.set([x, y, t, vx, vy, r, l, ttl], index * this.particles.props.length)

		if (l > ttl || this.checkBounds(x, y, r)) {
			this.initParticle(null, index * this.particles.props.length)
		}
	}
	checkBounds(x, y, r) {
		return x - r > this.width || x + r < 0 || y - r > this.height || y + r < 0
	}
}
