<script lang='ts'>

  export let man: Record<string, any> = {};
  import Plotly from '$lib/plots/Plotly.svelte'; 
  import {coloured_ribbons, vectors} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';    

  import {Checkbox} from 'flowbite-svelte';

  let states:Record<string, any>={};
  let fl=true; let intended=true; let corrected=true;
  $: {
    states = {}
    if (fl) {states['flown'] = man.al };
    if (intended) {states['intended'] = man.intended_template };
    if (corrected) {states['corrected'] = man.corrected_template };
  }
  
</script>

<Checkbox bind:checked={fl}>Flown</Checkbox>
<Checkbox bind:checked={intended}>intended</Checkbox>
<Checkbox bind:checked={corrected}>corrected</Checkbox>
<Plotly data={coloured_ribbons(states, 5)} layout={layout3d}/>