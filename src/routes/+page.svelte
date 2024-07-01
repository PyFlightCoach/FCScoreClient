<script lang="ts">
  import {  Heading, AccordionItem, Accordion, A, P } from 'flowbite-svelte'
  import {base} from '$app/paths';
  import {goto} from '$app/navigation';
  import { version, dev } from '$app/environment';
  import {fa_version, server_version, getVersion, loadExample} from '$lib/stores';
 
  
  import {fcj} from '$lib/stores';

  
  $: if ($fcj != null) {
    goto(base + '/analysis');
  }

  

</script>

  <div>
    <Heading>Flight Coach Score</Heading>
    <br/>
    <div>Automatic judging for precision aerobatics based on Flight Coach JSON files</div>    

    <br/>
    <div>Client:{version || 'next'}</div>
    <div>Server:<button on:click={()=>getVersion()}>{$server_version}</button></div>
    <div>Library:<button on:click={()=>getVersion()}>{$fa_version}</button></div>
    <A href="https://github.com/PyFlightCoach/FCScore/blob/main/changelog.md">Version Info</A>
    <br/>
    <br/>
    <div class='text'>
      FCScore consists of this web interface and an analysis server. 
      At the moment you need to run the analysis server on your computer, 
      but you can load an <A on:click={loadExample}>example</A> flight without it.
    </div>
    <br/>
    <div class='text'>
      To run the analysis server first install <A target="_blank" href='https://www.docker.com/products/docker-desktop/'>Docker</A> and start it running,
      then run the following command in a terminal:
    </div>
    <br/>
    <div class='terminal'>docker run -p 5000:5000 thomasdavid/fcs-server:latest</div>
    <br/>
    <div class='text'>
      This will download the latest version of the analysis server and start it running on your computer.
      Refresh this page and the Server and Library version numbers above should be populated. 
    </div>
    <br/>
    <div class='text'>
      FCScore is still in development, but it already covers most of the judging criteria in the F3A sporting code and 
      it should work for any of the sequences available as templates in the Flight Coach Plotter. 
    </div>


    
  </div>


<style>
  div {text-align: center;}
  .text {
    text-align: left;
    margin: 0 auto;
    max-width: 1000px;
  }
  .terminal {
    background-color: black;
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    max-width: 1000px;
    text-align: left;
    margin: 0 auto;
  }

</style>