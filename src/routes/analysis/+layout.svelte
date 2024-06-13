<script>

  import {goto} from '$app/navigation';
  import {onMount} from 'svelte';
  import {base} from '$app/paths';

  $: fcj = flightdata.fcj;
  import {flightdata} from '$lib/stores';

  onMount(()=>{
    if ($fcj === null) {
      goto(base + '/upload');
    }
  })


</script>

  
<slot/>

  