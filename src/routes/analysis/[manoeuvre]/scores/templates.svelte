<script lang='ts'>

  export let man: Record<string, any> = {};
  import PlotState from '$lib/plots/plot3d.svelte';
  import {coloured_ribbons} from '$lib/plots/traces';
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
<PlotState data={coloured_ribbons(states, 5)}/>