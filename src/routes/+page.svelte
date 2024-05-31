<script lang="ts">
  import {  Heading, P } from 'flowbite-svelte'
  import {server_version} from '$lib/api_calls';
  import {onMount} from 'svelte';
  import { A } from 'flowbite-svelte';
  
  let version = 'not connected';

  const getVersion = async () => {version = await server_version()};

  onMount(getVersion);
      
  import {PUBLIC_VERSION} from '$env/static/public';


</script>

  <div>
    <Heading>Flight Coach Score</Heading>
    <div>WIP example of automatic judging for precision aerobatics based on Flight Coach JSON files</div>    

    <br/>
    <div>Client:{PUBLIC_VERSION}</div>
    <div>Server:<button on:click={()=>getVersion()}>{version}</button></div>

    <A href="https://github.com/PyFlightCoach/FCScore/blob/main/changelog.md">Version Info</A>


  </div>





<style>
  div {text-align: center;}
</style>