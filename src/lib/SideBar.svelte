
<script lang="ts">
    import { mouse} from '$lib/stores';
    import {Drawer } from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';
    
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
    <slot/>
  </Drawer>
    
      
