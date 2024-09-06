<script lang="ts">
	import type { Origin } from '$lib/api_objects/fcjson';
	import Plot from 'svelte-plotly.js';
	import { GPS, Point, Quaternion } from '$lib/geometry';
	
	export let binData: Record<string, any>;
	export let binOrigin: Origin;

	$: origin = new GPS(binOrigin.lat, binOrigin.lng, binOrigin.alt);
	$: rotation = Quaternion.parse_euler(new Point(Math.PI, 0, binOrigin.heading * Math.PI / 180 + Math.PI / 2));
	$: centre = origin.offset(rotation.transform_point(new Point(0, 300, 0)));
</script>

<Plot
	data={[
		{
			lat: binData.POS?.Lat,
			lon: binData.POS?.Lng,
			type: 'scattermap',
			mode: 'lines',
			hovermode: false,
			showlegend: false
		},
		{
			lat: [binOrigin.lat],
			lon: [binOrigin.lng],
			type: 'scattermap',
			mode: 'markers',
			showlegend: false,
			marker: {
				size: 10,
				color: 'red'
			}
		},
		{
			lat: [binOrigin.lat, centre.lat],
			lon: [binOrigin.lng, centre.lon],
			type: 'scattermap',
			mode: 'lines',
			showlegend: false,
			line: {
				color: 'black',
        dash: 'dot',
        width: 1
			}
		}
	]}
	layout={{
		map: {
			bearing: 0,
			center: {
				lat: binData.POS?.Lat[0],
				lon: binData.POS?.Lng[0]
			},
			pitch: 0,
			zoom: 13,
      style: 'satellite',
		},
		margin: {l: 0, r: 0, t: 0, b: 0}
	}}
	fillParent={true}
/>
