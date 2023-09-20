<script lang="ts">
  import {  Heading, P } from 'flowbite-svelte'
  import {server_version} from '$lib/api_calls';
  import {onMount} from 'svelte';

  let version: string;

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



  </div>





<style>
  div {text-align: center;}
</style>