
<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

  import {mans} from '$lib/stores';

</script>


<div class="sidebar">
  <Sidebar class="sidebar__sidebar">

    <SidebarGroup>
      {#each Object.keys($mans) as man}
        <SidebarItem href={'/analysis/' + man} label={man}></SidebarItem>
      {/each}

    </SidebarGroup>
      
  </Sidebar>  

  <slot class="sidebar__main"/>

</div>
  
<style >
  
  .sidebar {display: flex;}
  .sidebar__sidebar {width: 10%;}
  .sidebar__main {
      flex: 1;/* Take the remaining width */
      overflow: auto;       /* Make it scrollable */
  }

</style>