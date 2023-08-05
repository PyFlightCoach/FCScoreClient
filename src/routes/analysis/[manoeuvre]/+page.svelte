

<script lang="ts">

  import { flightdata } from '$lib/stores.js';
  import {page} from '$app/stores';
  import {align} from '$lib/api_calls';
  import PlotState from '$lib/plotState.svelte';

  $: manname = $page.params['manoeuvre'];
  $: man = flightdata.man(manname);
    
  $:if (('fl' in $man) && !$man['busy']) {
    $man['busy'] = true;
    align($man['mdef'], $man['fl'])
    .then((res: Record<string, any>) => {
      man.update((data) => {
        data['al'] = res;
        delete data['fl'];
        data['busy'] = false;
        return data;
      });
    });
    
  }; 

</script>

{#if 'fl' in $man}
  <div>Preparing alignment for {$man['mdef']['info']['short_name']}</div>
{:else if 'al' in $man}
  <PlotState state={$man['al']}/>
{/if}

