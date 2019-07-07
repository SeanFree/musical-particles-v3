import CanvasCompositer from '@/controllers/CanvasCompositer'
import AudioFrequencyReader from '@/controllers/AudioFrequencyReader'

export const VISUALIZER_DEFAULTS = {
	minDb: 0,
	maxDb: 0,
	analyserType: 'int'
}

export default class VisualizerController extends CanvasCompositer {
	constructor(el, x, y, w, h, analyser, options) {
		super(el, x, y, w, h)

		this.options = Object.defineProperties(
			VISUALIZER_DEFAULTS,
			Object.getOwnPropertyDescriptors(options)
		)

		this.frequencyReader = new AudioFrequencyReader(
			analyser,
			this.options.analyserType,
			this.options.minDb,
			this.options.maxDb
		)
	}
	async updateCompositeLayers() {
		let index, layer, data

		for await (layer of this.compositeLayers) {
			index = 0

			layer.update()

			for await (data of this.frequencyReader.readNormalizedValues()) {
				layer.setNormalizedAverageFrequency(
					this.frequencyReader.normalizedAverageFrequency
				)
				layer.render(index, data)
				index++
			}
		}
	}
	async update() {
		this.frequencyReader.update()
		await this.frequencyReader.normalize()
		await this.updateCompositeLayers()
		await this.render()
	}
}
