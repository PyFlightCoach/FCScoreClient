<script lang="ts">
	import { Fileupload, Label, Button, P } from 'flowbite-svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
  import BINWorker from '$lib/JsDataflashParser/parser.js?worker';
	
  const worker = new BINWorker();

  let binFile: File;

  let percentage: number;
  let startTime: string;
  let ready: boolean;

	let messages = ['POS', 'ATT', 'XKF', 'XKF1', 'XKF2', 'RCIN', 'XKQ', 'XKQ1', 'XKQ2'];
  let data: Record<string, any> = {};
  let availableMessages: Record<string, boolean> = {};
  let loadedMessages: Record<string, boolean> = {};

	// output messages from worker
	worker.onmessage = (event) => {
		if (event.data.hasOwnProperty('percentage')) {
			percentage = event.data.percentage;
		} else if (event.data.hasOwnProperty('availableMessages')) {
      availableMessages = event.data.availableMessages;

      loadedMessages = Object.fromEntries(Object.keys(event.data.availableMessages).map((name) => [name, messages.includes(name.split('[')[0])]));

    } else if (event.data.hasOwnProperty('metadata')) {
      startTime = event.data.metadata.startTime;
		} else if (event.data.hasOwnProperty('messageType')) {
      data[event.data.messageType] = event.data.messageList; 
		} else if (event.data.hasOwnProperty('messagesDoneLoading')) {
			ready = true;
		}
	};

  function parseMessages(msgs: string[]) {
    let reader = new FileReader();
		reader.onload = function (e) {
			let data = reader.result;
			worker.postMessage({
				action: 'parse',
				file: data,
        msgs: msgs
			});
		};
		reader.readAsArrayBuffer(binFile);  
  }

	function loadBin(event) {
    ready = false;
		binFile = event.target.files[0];
    parseMessages(messages);
	}

  function loadOrDelMsg(v, name: string) {
    if (v?.target?.checked) {
      if (!messages.includes(name)) {
        messages.push(name);
        parseMessages([name]);
      }
      
    } else {
      delete data[name];
      data=data;
      loadedMessages[name] = false;
      const index = messages.indexOf(name);
      if (index > -1) {
        messages.splice(index, 1);
      } 
    }
  }

</script>
<div class="centered">
	<div>
		<Fileupload on:change={loadBin} accept=".bin, .BIN" name="BIN file" />
	</div>

  {#if percentage && percentage < 100} {percentage} {/if}
	{#if ready}
  <div>Loaded Log, Start time = {startTime}</div>
  <Accordion multiple=true>

    <AccordionItem>
      <span slot="header">Select Messages</span>
      <div id='fieldselect'> 
      {#each Object.keys(availableMessages) as name}
        
        <label><input type='checkbox' bind:checked={loadedMessages[name]} on:change={e=>{loadOrDelMsg(e, name)}} > {name}</label>
      {/each}
    </div>
    </AccordionItem>  

    <AccordionItem>
      <span slot="header">Loaded Messages</span>
      {#each Object.entries(data) as [name, message]}
        <div>{name}[{message ? message.time_boot_ms.length: ''}]: {message ? Object.keys(message): ''}</div>
      {/each}
    </AccordionItem>
  </Accordion>
	{/if}
</div>


<style> 
  #fieldselect {display:grid; grid-template-columns: repeat(7, 1fr); }


</style>