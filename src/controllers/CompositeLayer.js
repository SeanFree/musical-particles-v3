export default class CompositeLayer {
	constructor(w, h) {
		this.frame = document.createElement('canvas')
		this.buffer = this.frame.getContext('2d')
		this.dimensions = [w, h]
		this.center = [0.5 * w, 0.5 * h]
		this.frame.width = w
		this.frame.height = h
	}
	get width() {
		return this.dimensions[0]
	}
	get height() {
		return this.dimensions[1]
	}
	set width(w) {
		this.dimensions[0] = w
		this.frame.width = w
	}
	set height(h) {
		this.dimensions[1] = h
		this.frame.height = h
	}
	get centerX() {
		return this.center[0]
	}
	get centerY() {
		return this.center[1]
	}
	resizeFrame(w, h) {
		this.width = this.frame.width = w
		this.height = this.frame.height = h

		this.center[0] = 0.5 * w
		this.center[1] = 0.5 * h
	}
}
