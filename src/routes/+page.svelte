<script lang="ts">
  import {  Heading, P } from 'flowbite-svelte'
  import {server_version} from '$lib/api_calls';

  let version: string = 'no connection';
  server_version().then(v=>{version=v});
  let client_version: string = '0.0.1';
  
</script>

  <div>
    <Heading>Flight Coach Score</Heading>
    <div>WIP example of automatic judging process based on Flight Coach JSON files</div>    

    <br/>
    <div>Client:{client_version}</div>
    <div>Server:{version}</div>
    


  </div>





<style>
  div {text-align: center;}
</style>