<script>

  import {goto} from '$app/navigation';
  import {onMount} from 'svelte';
  
  $: name = flightdata.name;
  import {flightdata} from '$lib/stores';

  onMount(()=>{
    if ($name == null) {
      goto('/upload');
    }
  })


</script>

  
<slot id="contents"/>

  
<style >

  #contents {
      height: 100%;
      width: 100%;
  }

</style>