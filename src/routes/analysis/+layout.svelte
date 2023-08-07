
<script lang="ts">
  import { goto } from '$app/navigation';
  import {flightdata, mouse} from '$lib/stores';
  import {Drawer, Button, CloseButton } from 'flowbite-svelte';
  import ManSummary from './ManSummary.svelte';
  import { sineIn } from 'svelte/easing';
  
  let mannames = flightdata.mannames;

  let space_show = false; 
  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case " ":
        space_show =! space_show;
        break;
    }
  }

  function onMouse(mx: number) {
    if (hidden && mx < 10) {
      hidden = false;
    } else if (mx>300 && !space_show) {
        hidden = true;
    }
  }

  $: onMouse($mouse.x)

  $: hidden = !space_show


</script>


<svelte:window on:keydown={onKeyDown} />

<Drawer transitionType="fly" transitionParams={{x: -320,duration: 200,easing: sineIn}} bind:hidden={hidden}>
  <div id="table">
      <div>Manoeuvre</div>
      <div>K</div>
      <div>Status</div>
      <div>Score</div>
      {#each $mannames as manname}
        <ManSummary manname={manname}/>
      {/each}
  </div>
</Drawer>
  
<slot id="contents"/>

  
<style >

  #table {
    display: grid; 
    width:100%; 
    height:100%;
    grid-template-columns: auto auto auto auto;

  }
  #contents {
      height: 100%;
      width: 100%;
      background-color: red;
  }
  div {
    text-align: center;
    font-size: medium;
    font-weight: 400;
  }

</style>