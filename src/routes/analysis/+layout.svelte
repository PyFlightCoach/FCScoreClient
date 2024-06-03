<script>

  import {goto} from '$app/navigation';
  import {onMount} from 'svelte';
  import {base} from '$app/paths';

  $: name = flightdata.name;
  import {flightdata} from '$lib/stores';

  onMount(()=>{
    if ($name == null) {
      goto(base + '/upload');
    }
  })


</script>

  
<slot/>

  