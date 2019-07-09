<template lang="pug">
	.v-layer-menu
		.v-layer-menu__container(
			:class="{ 'v-layer-menu__container--open': layer.open }"
			:key="name"
			v-for="(layer, name) in layers"
		)
			span.v-layer-menu__toggle(@click="toggleOpen(name)")
				i.material-icons {{ layer.icon }}
			ul.v-layer-menu__list
				li.v-layer-menu__item(v-for="(item, key) in layer.options" :key="key")
					vDropdown(
						v-if="item.type === 'string'"
						:id="`${name}-${key}`"
						:label="key"
						:options="item.options"
						:value="item.value"
						@change="onChange(name, key, item, $event)"
					)
					vCheckbox(
						v-if="item.type === 'boolean'"
						:id="`${name}-${key}`"
						:label="key"
						:checked="item.value"
						:value="item.value"
						@change="onChange(name, key, item, $event)"
					)
					vRange(
						type="range"
						v-model="item.value"
						v-if="item.type === 'number'"
						:id="`${name}-${key}`"
						:label="key"
						:value="item.value"
						:min="item.min"
						:max="item.max"
						:step="item.step"
						@change="onChange(name, key, item, $event)"
					)
</template>

<script>
import { vEvents } from '@/mixins'
import {
	E_CLOSE_MENUS,
	E_LAYER_UPDATE
} from '@/mixins/events/events.type'
import vDropdown from '@/components/vDropdown'
import vCheckbox from '@/components/vCheckbox'
import vRange from '@/components/vRange'

export default {
	name: 'vLayerMenu',
	mixins: [vEvents],
	components: {
		vDropdown,
		vCheckbox,
		vRange
	},
	props: {
		layers: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			open: false
		}
	},
	methods: {
		toggleOpen(layerName) {
			Object.keys(this.layers).forEach(key => {
				this.layers[key].open = this.layers[key].open
					? !this.layers[key].open
					: this.layers[key].open = key === layerName
			})
			this.$forceUpdate()
		},
		closeAll() {
			Object.keys(this.layers).forEach(key => {
				this.layers[key].open = false
			})
			this.$forceUpdate()
		},
		onChange(name, key, item, value) {
			this.eventHub.$emit(E_LAYER_UPDATE, {
				...item,
				name,
				key,
				value
			})
		}
	},
	created() {
		this.eventHub.$on(E_CLOSE_MENUS, this.closeAll.bind(this))
	}
}
</script>

<style lang="scss" scoped>
.v-layer-menu {
	display: flex;
	align-items: center;
	z-index: z("interface");

	&__container {
		position: relative;
	}

	&__container--open &__list {
		opacity: 1;
		transform: translatex(0);
		pointer-events: auto;
	}

	&__container--open &__toggle {
		opacity: 0.9;
	}

	&__toggle {
		opacity: 0.3;
		transition: opacity $transition-duration-s;
		cursor: pointer;
		margin-left: $space-s;

		.material-icons:active {
			transform: scale(0.85);
		}

		&:hover {
			opacity: 0.9;
		}
	}

	&__list {
		position: absolute;
		right: 0;
		max-height: 50vh;
		border-radius: 4px;
		font-size: $size-s;
		opacity: 0;
		transform: translatey($space-s);
		pointer-events: none;
		overflow-y: scroll;
		transition: opacity $transition-duration-s, transform $transition-duration-s;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__item {
		background-color: $gray-10;
		opacity: 0.7;

		&:hover {
			opacity: 0.9;
		}

		&:not(:last-child) {
			border-bottom: 1px solid $gray-9;
		}
	}
}
</style>
