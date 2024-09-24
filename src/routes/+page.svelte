<script lang="ts">
  import {  Heading, A } from 'flowbite-svelte'
  import { version, } from '$app/environment';
  import {fa_version, server_version} from '$lib/stores';  
  
</script>

  <div>
    <Heading>Flight Coach Score</Heading>
    <br/>
    <div>Automatic judging for precision aerobatics based on Flight Coach JSON files</div>    

    <br/>
    <div>Client:{version || 'next'}</div>
    <div>Server:<button>{$server_version}</button></div>
    <div>Library:<button>{$fa_version}</button></div>
    <A href="https://github.com/PyFlightCoach/FCScore/blob/main/changelog.md">Version Info</A>
    <br/>
    <br/>
    <div class='text'>
      FCScore is still in development, but it already covers most of the judging criteria in the F3A sporting code and 
      it should work for any of the sequences available as templates in the Flight Coach Plotter. 
    </div>
    <br/>
    <div class='text'>
      The program consists of this web interface and an analysis server.
      We have a public analysis server running in the UK, but it could get very slow especially at busy times.
      For a better experience and to reduce the load on our server you can run the analysis server on your computer.
      To do this first install <A target="_blank" href='https://www.docker.com/products/docker-desktop/'>Docker</A> and start it running,
      then run the following command in a terminal:
    </div>
    <br/>
    <div class='terminal'>docker run --rm -p 5000:5000 thomasdavid/fcs-server:latest</div>
    <br/>
    <div class='text'>
      This will download the latest version of the server and start it running.
      You can then select the local analysis server under the Options menu.
    </div>
    <br/>


    
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