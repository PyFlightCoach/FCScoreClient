<script lang='ts'>

  export let man: Record<string, any> = {};
  import PlotState from '$lib/plots/plot3d.svelte';

  $: states = {flown: man.al, intended: man.intended_template, corrected: man.corrected_template}

</script>


<PlotState states={states}/>