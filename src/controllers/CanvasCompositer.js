import CompositeLayer from '@/controllers/CompositeLayer'

export default class CanvasCompositer extends CompositeLayer {
	constructor(el, x, y, w, h) {
		super(w, h)
		this.el = el
		this.ctx = this.el.getContext('2d')
		this.el.width = w
		this.el.height = h
		this.position = [x, y]
		this.compositeLayers = []
	}
	addLayer(layer) {
		this.compositeLayers.push(layer)
	}
	resize(w, h) {
		this.el.width = w
		this.el.height = h
		this.resizeFrame(w, h)
		this.resizeLayers(w, h)
	}
	resizeLayers(w, h) {
		this.compositeLayers.forEach(layer => layer.resizeFrame(w, h))
	}
	drawGlow(frame) {
		this.buffer.save()
		this.buffer.filter = 'blur(6px) brightness(150%)'
		this.buffer.globalCompositeOperation = 'lighter'
		this.buffer.drawImage(frame, 0, 0)
		this.buffer.restore()
	}
	async render() {
		this.buffer.clearRect(0, 0, this.width, this.height)
		this.ctx.clearRect(0, 0, this.width, this.height)

		await Promise.all(
			this.compositeLayers.map(async layer => {
				layer.options.glow && this.drawGlow(layer.frame)

				this.buffer.drawImage(layer.frame, 0, 0, this.width, this.height)
			})
		)

		this.ctx.drawImage(this.frame, 0, 0)
	}
}
