<script lang='ts'>
  import {ManDef, ManInfo, BoxLocation} from '$lib/api_objects';
  import ManInfoEditor from '$lib/api_object_editors/ManInfoEditor.svelte';
  import {ManParm, parse_dict} from '$lib/api_objects';
  import {standard_f3a_mps} from '$lib/api_calls';
	import { onMount } from 'svelte';
  import ManParmEditor from '$lib/api_object_editors/ManParmEditor.svelte';

  export let mdef: ManDef | null = null;

  onMount(()=>{
    if (!mdef) {
      standard_f3a_mps().then(mps=>{
        mdef = new ManDef(
          ManInfo.default(), 
          parse_dict(mps, ManParm.parse), 
          {}
        );
      })
    }
  });

</script>

{#if mdef}
  <div id='container'>
    <div>
      <ManInfoEditor bind:info={mdef.info} />
    </div>
    <div>
      <ManParmEditor bind:mps={mdef.mps}/>
    </div>
  
  </div>
{/if}

<style>

  #container {
    display: grid;
    grid-template-columns:  1fr 1fr 1fr 1fr;
  }
</style>