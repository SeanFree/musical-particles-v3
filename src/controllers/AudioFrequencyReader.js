import {
	norm,
	clamp
} from '@/common/util'

export default class AudioFrequencyReader {
	constructor(analyser, type = 'float', minDb = 0, maxDb = 0) {
		if (!(analyser instanceof AnalyserNode)) {
			throw new TypeError('Provided value is not of type AnaylserNode')
		}
		this.analyser = analyser
		this.frequencyCount = analyser.frequencyBinCount
		this.type = type
		this.minDb = minDb
		this.maxDb = maxDb
		this.frequencyData =
			type === 'float'
				? new Float32Array(this.frequencyCount)
				: new Uint8Array(this.frequencyCount)
		this.normalizedFrequencyData = new Float32Array(this.frequencyCount)
		this.min = type === 'float' ? minDb : 0
		this.max = type === 'float' ? maxDb : 256
		this.updateFn =
			type === 'float' ? 'getFloatFrequencyData' : 'getByteFrequencyData'
	}
	update() {
		this.analyser[this.updateFn](this.frequencyData)
		this.averageFrequency =
			this.frequencyData.reduce((a, b) => a + b, 0) / this.frequencyCount
		this.normalizedAverageFrequency = norm(
			this.averageFrequency,
			this.min,
			this.max
		)
	}
	async *readValues() {
		let i = 0
		for (; i < this.frequencyCount; i++) {
			yield this.frequencyData[i]
		}
	}
	async *readNormalizedValues() {
		let i = 0

		for (; i < this.frequencyCount; i++) {
			yield this.normalizedFrequencyData[i]
		}
	}
	async normalize() {
		let f
		let i = 0

		for await (f of this.readValues()) {
			this.normalizedFrequencyData[i] = clamp(norm(f, this.min, this.max), 0, 1)

			i++
		}
	}
}
