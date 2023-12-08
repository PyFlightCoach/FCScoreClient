<script lang='ts'>
  
  import Plotly from '$lib/plots/Plotly.svelte'; 
  import {alignment_traces} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';  
  import {split_states, type State} from '$lib/geometry';
  
  import {BottomNav, Select} from 'flowbite-svelte';
  import {colddraft} from '$lib/stores';
  
  
  export let state: State[];  
  
  export let show_box= false;
  export let nmodels= 3;
  export let highlight: number | null = null;
  export let show_models = false;
  export let show_controls = true;
  
  $: states = split_states(state);

  let element = "select element";
  $: if (highlight!=null) {
    element=Object.keys(states)[highlight]
  };

  
</script>

<div id="parent">
  
  <Plotly 
    data={alignment_traces(states, show_models, show_box, $colddraft, nmodels, highlight)} 
    layout={layout3d}
  />

  {#if show_controls}
    <BottomNav classInner="grid-cols-5" id="adjust-split">
      <Select 
        bind:value={element} 
        items={['Select Element'].concat(...Object.keys(states)).map((el) => {return {value: el, name: el};})}
        on:change={() => {
          if (element == 'Select Element') {
            highlight=null; 
            show_models=false;
          } else {
            highlight=Object.keys(states).indexOf(element); 
            show_models=true;
          }
        }}
      />
      <slot />
    </BottomNav>
  {/if}

</div>



<style>
  #parent {height: 100%; position:fixed}
</style>