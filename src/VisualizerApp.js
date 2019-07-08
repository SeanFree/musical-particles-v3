import {
	MIN_DB,
	MAX_DB
} from '@/constants'
import { clone } from '@/common/util'
import VisualizerController from '@/controllers/VisualizerController'
import SpectrumVisualizer, { SPECTRUM_CONFIG } from '@/controllers/SpectrumVisualizer'
import ParticleVisualizer, { PARTICLE_CONFIG } from '@/controllers/ParticleVisualizer'

export default class VisualizerApp {
	constructor(app, canvas, analyser) {
		this.controller = new VisualizerController(
			canvas,
			0,
			0,
			window.innerWidth,
			window.innerHeight,
			analyser,
			{
				minDb: MIN_DB,
				maxDb: MAX_DB
			}
		)

		this.layerControls = {}

		this.layerControls.spectrum = new SpectrumVisualizer(window.innerWidth, window.innerHeight, {
			frequencyCount: analyser.frequencyBinCount
		})
		this.controller.addLayer(this.layerControls.spectrum)
		app.addLayerControl('spectrum', 'bar_chart', clone(SPECTRUM_CONFIG))

		this.layerControls.particles = new ParticleVisualizer(window.innerWidth, window.innerHeight, {
			frequencyCount: analyser.frequencyBinCount
		})
		this.controller.addLayer(this.layerControls.particles)
		app.addLayerControl('particles', 'bubble_chart', clone(PARTICLE_CONFIG))

		app.eventHub.$on('layerUpdate', data => {
			this.layerControls[data.name].options[data.key] = data.value
			data.init && this.layerControls[data.name].init()
		})
	}
	init() {
		this.resize()
		window.addEventListener('resize', this.resize.bind(this))
		this.run()
	}
	resize() {
		const { innerWidth, innerHeight } = window

		this.controller.resize(innerWidth, innerHeight)
	}
	async run() {
		await this.controller.update()
		window.requestAnimationFrame(this.run.bind(this))
	}
}
