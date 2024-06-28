<script>

  import {goto} from '$app/navigation';
  import {onMount} from 'svelte';
  import {base} from '$app/paths';

  import {fcj} from '$lib/stores';

  onMount(()=>{if (!$fcj) {goto(base + '/upload');}})

</script>

  
<slot/>

  