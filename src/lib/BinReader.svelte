<script lang="ts">
	import { Fileupload, ButtonGroup, Checkbox, MegaMenu, Button, Label } from 'flowbite-svelte';
	import BINWorker from '$lib/JsDataflashParser/parser.js?worker';

	const worker = new BINWorker();

  export let data: Record<string, any> = {};
	export let bin: File|undefined=undefined;
	let percentage: number;
	let startTime: Date = new Date();
	let ready: boolean = false;
	let availableMessages: Record<string, any>;
	let loadedMessages: Record<string, boolean> = {};
  let showmessages:boolean = false;
  let showinfo: boolean = false;

	worker.onmessage = (event) => {
		if (event.data.hasOwnProperty('percentage')) {
			percentage = event.data.percentage;
		} else if (event.data.hasOwnProperty('availableMessages')) {
      availableMessages = event.data.availableMessages;
			Object.entries(event.data.availableMessages).forEach(([name, message]) => {
        const lname = name.split("[")[0];
        if (!loadedMessages.hasOwnProperty(lname)) {loadedMessages[lname] = false;}        
			});
		} else if (event.data.hasOwnProperty('metadata')) {
			startTime = new Date(event.data.metadata.startTime);
		} else if (event.data.hasOwnProperty('messageType')) {
      const lname = event.data.messageType.split("[")[0]
			data[event.data.messageType] = event.data.messageList;
			loadedMessages[lname] = true;
		} else if (event.data.hasOwnProperty('messagesDoneLoading')) {
			ready = true;
		}
	};

	function parseMessages(msgs: string[]) {
		let reader = new FileReader();
		reader.onload = (e) => {
			let data = reader.result;
			worker.postMessage({
				action: 'parse',
				file: data,
				msgs: msgs
			});
		};
		reader.readAsArrayBuffer(bin);
	}

	function loadOrDelMsg(load: boolean, name: string) {
		if (load) {
			if (!data[name]) {
				parseMessages([name]);
			}
		} else {
      let names: string[] = [];
      Object.keys(data).forEach(n=>{if(n.startsWith(name)) {names.push(n)}})
      names.forEach(n=>{if (data[n]) {delete data[n];}})
			loadedMessages[name] = false;
      data=data;
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			bin = input!.files![0];
			data = {};
			ready = false;
			loadedMessages = {};
			parseMessages(['POS', 'ATT', 'XKF1', 'RCIN', 'XKQ', 'XKQ1']);
		}
	}
</script>

<div >
	
  <ButtonGroup>
		<Fileupload on:change={handleFileChange} accept=".bin, .BIN" name="BIN file" />
    {#if bin}
	    <Button on:click={()=>{showmessages = !showmessages;}}>Messages</Button>
      <Button on:click={()=>{showinfo = !showinfo;}}>Info</Button>
      <p id='timeinfo'>Start Time = {startTime.toLocaleDateString()}, {startTime.toLocaleTimeString()}</p>
      {:else}
      <p id='timeinfo'>Select an Ardupilot BIN file</p>
    {/if}
	</ButtonGroup>

  {#if showmessages}
    <div class='popover selmsgs' >
      {#each Object.entries(loadedMessages) as [name, loaded]}
        <div>
          <Checkbox
            bind:checked={loaded}
            on:change={(e) => {
              loadOrDelMsg(e.target.checked, name);
            }}
          >
            {name}
          </Checkbox>
        </div>
      {/each}
    </div>
  {/if}
	{#if showinfo}
    <div class='popover'>
      {#each Object.entries(data) as [name, msg]}
        <div>
          {name}[{msg.time_boot_ms.length}]: {Object.keys(msg)}
        </div>
      {/each}
    </div>
  {/if}
    
</div>

<style>
	.popover {
    background-color: white;
    border-width: 1px;
	}
  .selmsgs {
		display: grid;
    grid-gap: 5px;
		grid-template-columns: repeat(7, 1fr);

  }

  #timeinfo {
    font-size: small;
    white-space: nowrap;
    align-self: center;
  }

</style>
