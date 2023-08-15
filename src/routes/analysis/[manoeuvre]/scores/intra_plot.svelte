<script lang='ts'>
	import type {Result} from '$lib/api_objects';
    import type {State} from '$lib/geometry';
    import PlotState from '$lib/plots/plot3d.svelte';
    export let result: Result;
    export let flown: State[];
    export let template: State[];


</script>


<div>{result.name} downgrades for {flown[0].element}, value={result.value}</div>
<PlotState states={{flown, template}} span={3}/>
