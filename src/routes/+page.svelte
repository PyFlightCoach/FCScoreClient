<script lang="ts">
  import {  Heading, P } from 'flowbite-svelte'
  import { A } from 'flowbite-svelte';
  import {base} from '$app/paths';
  import {goto} from '$app/navigation';
  import {PUBLIC_VERSION} from '$env/static/public';
  import {fa_version, server_version, getVersion} from '$lib/stores';
 
  
  import {fcj} from '$lib/stores';

  
  $: if ($fcj != null) {
    goto(base + '/analysis');
  }

  

</script>

  <div>
    <Heading>Flight Coach Score</Heading>
    <div>WIP example of automatic judging for precision aerobatics based on Flight Coach JSON files</div>    

    <br/>
    <div>Client:{PUBLIC_VERSION || 'next'}</div>
    <div>Server:<button on:click={()=>getVersion()}>{$server_version}</button></div>
    <div>Library:<button on:click={()=>getVersion()}>{$fa_version}</button></div>

    <A href="https://github.com/PyFlightCoach/FCScore/blob/main/changelog.md">Version Info</A>

  </div>





<style>
  div {text-align: center;}
</style>