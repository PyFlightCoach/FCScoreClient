<script lang="ts">
  import {Origin} from '$lib/api_objects/fcjson';
	import {ButtonGroup, Button, NumberInput, Fileupload, Tooltip, Dropdown, Radio, DropdownItem} from 'flowbite-svelte';
  import {GPS} from '$lib/geometry';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { FCJson, type FCJMan } from '$lib/api_objects/fcjson';
  export let origin: Origin=new Origin(0,0,0,0,0,0);
  export let fcj: FCJson = undefined;
  let file: File;

	let inputStyle: string = 'File';

  const loadBoxFile = (e) => {
    
    file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = reader.result as string;
      

      if (contents.startsWith("Emailed box data for F3A Zone Pro")) {
        const data = contents.split('\n');
        
        origin = Origin.from_centre(
          new GPS(parseFloat(data[2]), parseFloat(data[3]), parseFloat(data[6])),
          new GPS(parseFloat(data[4]), parseFloat(data[5]), parseFloat(data[6]))
        );
         
      } else {
        fcj = FCJson.parse(JSON.parse(contents));
        origin = fcj.origin;
      }
    };
    reader.readAsText(file);
  }
  
  const saveBox = () => {console.log(origin);}

</script>

<div>
  <ButtonGroup>
    <Button>Box <ChevronDownOutline/></Button>
    <Dropdown>
      {#if origin}
        <Radio bind:group={inputStyle} value=File>File</Radio>
        <Radio bind:group={inputStyle} value=pilotHeading>Pilot, Heading</Radio>
        <DropdownItem on:click={saveBox}>Export F3A Zone</DropdownItem>
      
      {/if}
    </Dropdown>
    {#if origin}
      {#if inputStyle=='File'} 
        <Fileupload on:change={loadBoxFile} accept=".F3A, .f3a, .json"/><Tooltip>Select F3A Zone or FC json file</Tooltip>
      {:else if inputStyle.startsWith('pilot')}
          <NumberInput bind:value={origin.lat} step=0.0001 /><Tooltip>Pilot Lat</Tooltip>
          <NumberInput bind:value={origin.lng} step=0.0001/><Tooltip>Pilot Lon</Tooltip>
          <NumberInput bind:value={origin.alt} step=1.0/><Tooltip>Pilot Alt</Tooltip>
        {#if inputStyle.endsWith('Heading')}
          <NumberInput bind:value={origin.heading} step=1.0 /><Tooltip>Direction to Centre</Tooltip>
        {/if}
      {/if}
    {/if}
  </ButtonGroup>

</div>

