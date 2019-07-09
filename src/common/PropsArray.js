export default class PropsArray {
	constructor(count = 0, props = []) {
		this.count = count
		this.props = props
		this.spread = props.length
		this.values = new Float32Array(count * props.length)
	}
	get length() {
		return this.values.length
	}
	set(a = [], i = 0) {
		this.values.set(a, i)
	}
	setMap(o = {}, i = 0) {
		this.set(Object.values(o), i)
	}
	get(i = 0) {
		return this.values.get(i, this.props.length)
	}
	getMap(i = 0) {
		return this.get(i).reduce(
			(r, v, i) => ({
				...r,
				...{ [this.props[i]]: v }
			}),
			{}
		)
	}
	forEach(cb) {
		let i = 0

		for (; i < this.length; i += this.props.length) {
			cb(this.get(this, i), i, this)
		}
	}
	map(cb) {
		let i = 0

		for (; i < this.length; i += this.props.length) {
			this.set(cb(this.get(this, i), i, this), i)
		}
	}
	async* read() {
		let i = 0

		for (; i < this.length; i += this.props.length) {
			yield this.get(i)
		}
	}
}
