
<script lang="ts">
  import { BottomNav, BottomNavItem } from "flowbite-svelte"
  import {mans} from '$lib/stores';

</script>

<slot/>


<BottomNav>
  {#each Object.keys($mans) as man}
    <BottomNavItem btnName={man}></BottomNavItem>
  {/each}
</BottomNav>


{#each Object.keys($mans) as man}
    <p>{man}</p>
{/each}