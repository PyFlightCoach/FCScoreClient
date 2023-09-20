<script lang="ts">
  import {  Heading, P } from 'flowbite-svelte'
  import {server_version} from '$lib/api_calls';
  import {onMount} from 'svelte';
  import { A } from 'flowbite-svelte';

  let version: string = 'not connected';

  onMount(()=>{
    server_version().then(v=>{version=v});
  });
      
  import {PUBLIC_VERSION} from '$env/static/public';

</script>

  <div>
    <Heading>Flight Coach Score</Heading>
    <div>WIP example of automatic judging process based on Flight Coach JSON files</div>    

    <br/>
    <div>Client:{PUBLIC_VERSION}</div>
    <div>Server:{version}</div>

    <A href="https://github.com/PyFlightCoach/FCScore/blob/main/changelog.md">Version Info</A>


  </div>





<style>
  div {text-align: center;}
</style>