<script lang="ts">
	import { States } from '$lib/state';
	import Plot from 'svelte-plotly.js';
	import { ribbon } from '$lib/plots/traces';
	import { layout3d } from '$lib/plots/layouts';
	import { Button, DoubleSlider } from '$lib/components';
	import colddraft from '$lib/plots/colddraft';
	

	export let flst: States;
	export let tpst: States | undefined = undefined;
	export let i: number | undefined = undefined;
	export let controls = [
		'slider',
		'play',
		'scale',
		'speed',
		'projection',
		'modelClick',
		'rangeEndClick',
		'rangeStartClick'
	];

	export let scale: number = 1;
  export let scaleType: string = 'range';
	export let speed = 50;

	export let range = [0, flst.data.length];
  export let fixRange: boolean = false;

  let scale_multiplier = 1;

  $: if (flst && fixRange) { range=[0, flst.data.length]};
  const getRange = (st: States) => {
    const _st = st.slice(range[0], range[1]);
    return Math.max(_st.range("x"), _st.range("y"), _st.range("z"));
  }
  $: rng = getRange(flst);
  $: _scale = scaleType === 'range' ?  rng*0.01*scale : scale ;
  
	const createRibbonTrace = (st: States | undefined, sc: number, min: number, max: number) => {
		if (!st) {
			return { type: 'mesh3d', visible: false };
		} else {
			max = max == -1 ? st.data.length : max;
			return ribbon(new States(st.data.slice(min, max)), sc);
		}
	};

	let layout = structuredClone(layout3d);

	const createModelTrace = (st: States | null, i: number | null, sc: number) => {
		if (st != null && i < st.data.length) {
			const fst = st.data[i];
			return colddraft
				.scale(sc*0.3)
				.to_mesh3d(fst.pos, fst.att, { opacity: 1.0, hoverinfo: 'skip', name: 'fl model' });
		} else {
			return { type: 'mesh3d', visible: false };
		}
	};

	$: fl_ribbon = createRibbonTrace(flst, _scale*scale_multiplier, ...range); //, tp_ribbon, fl_model, tp_model;
	$: tp_ribbon = createRibbonTrace(tpst, _scale*scale_multiplier, ...range);
	$: fl_model = createModelTrace(flst, i, _scale*scale_multiplier);
	$: tp_model = createModelTrace(tpst, i, _scale*scale_multiplier);

	$: traces = [fl_ribbon, tp_ribbon, fl_model, tp_model];

	let player;

	const play = () => {
		player = setInterval(() => {
			i != null && i < flst.data.length ? i++ : (i = 0);
		}, speed);
	};

	const pause = () => {
		clearInterval(player);
		player = undefined;
	};
</script>

<div style:height="100%" id="parent">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		style:height="100%"
		on:mousedown={() => {
			clearInterval(player);
		}}
		on:mouseup={() => {
			if (player) {
				play();
			}
		}}
	>
		{#if traces}
			<Plot
				data={traces}
				{layout}
				fillParent={true}
				on:click={(e) => {
					if (controls.includes('modelClick')) {
						i = range[0] + Math.floor(e.detail.points[0].pointNumber / 2);
					} else if (controls.includes('rangeEndClick')) {
						range[1] = range[0] + Math.floor(e.detail.points[0].pointNumber / 2);
					} else if (controls.includes('rangeStartClick')) {
						range[0] = range[0] + Math.floor(e.detail.points[0].pointNumber / 2);
					}
				}}
			/>
		{/if}
	</div>
	<div id="buttons">
		<div>
			{#if controls.includes('slider')}
				<DoubleSlider
					min={0}
					max={flst.data.length}
					bind:lhandle={range[0]}
					bind:rhandle={range[1]}
				/>
			{/if}
		</div>
		<div>
			{#if controls.includes('play')}
				{#if player}
					<Button on:click={pause}>Pause</Button>
				{:else}
					<Button on:click={play}>Play</Button>
				{/if}
			{/if}
		</div>
		<div>
			{#if controls.includes('scale')}
				<Button
					on:click={() => {
						scale_multiplier = scale_multiplier + 0.1;
					}}>+</Button
				>
			{/if}
		</div>
		<div>
			{#if controls.includes('scale')}
				<Button
					on:click={() => {
						scale_multiplier = Math.max(0.2, scale_multiplier - 0.2);
					}}>-</Button
				>
			{/if}
		</div>
		<div>
			{#if controls.includes('speed')}
				<Button
					on:click={() => {
						speed = Math.min(200, speed * 1.6);
					}}>Slow</Button
				>
			{/if}
		</div>
		<div>
			{#if controls.includes('speed')}
				<Button
					on:click={() => {
						speed = Math.max(20, speed / 1.6);
					}}>Fast</Button
				>
			{/if}
		</div>
		<div>
			{#if controls.includes('perspective')}
				<Button
					on:click={() => {
						layout = structuredClone(layout3d);
						layout.scene.camera.projection.type =
							layout.scene.camera.projection.type == 'perspective' ? 'orthographic' : 'perspective';
						layout = layout;
					}}>{layout.scene.camera.projection.type}</Button
				>
			{/if}
		</div>
	</div>
</div>

<style>
	#parent {
		position: relative;
	}
	#buttons {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr repeat(7, min-content);
	}
</style>
