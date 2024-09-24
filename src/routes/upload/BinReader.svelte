<script lang="ts">
	import { Fileupload, Checkbox, Button, Dropdown, DropdownItem, MegaMenu } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import BINWorker from '$lib/JsDataflashParser/parser.js?worker';
	import pkg from 'file-saver';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const { saveAs } = pkg;

	const worker = new BINWorker();

	export let data: Record<string, any>;
	export let bin: File | undefined = undefined;

	let percentage: number;
	let startTime: Date = new Date();
	let ready: boolean = false;
	let availableMessages: Record<string, any>;
	let loadedMessages: Record<string, boolean> = {};
	
	worker.onmessage = (event) => {
		if (event.data.hasOwnProperty('percentage')) {
			percentage = event.data.percentage;
		} else if (event.data.hasOwnProperty('availableMessages')) {
			availableMessages = event.data.availableMessages;
			Object.entries(event.data.availableMessages).forEach(([name, message]) => {
				const lname = name.split('[')[0];
				if (!loadedMessages.hasOwnProperty(lname)) {
					loadedMessages[lname] = false;
				}
			});
		} else if (event.data.hasOwnProperty('metadata')) {
			startTime = new Date(event.data.metadata.startTime);
		} else if (event.data.hasOwnProperty('messageType')) {
			const lname = event.data.messageType.split('[')[0];
			data[event.data.messageType] = event.data.messageList;
			loadedMessages[lname] = true;
		} else if (event.data.hasOwnProperty('messagesDoneLoading')) {
			ready = true;
			dispatch('newBin', { data });
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

	//	function parseFCJ() {
	//		const reader = new FileReader();
	//		reader.onload = (e) => {
	//			fcj = FCJson.parse(JSON.parse(reader.result as string));
	//		};
	//		reader.readAsText(json);
	//	}

	function loadOrDelMsg(load: boolean, name: string) {
		if (load) {
			if (!data[name]) {
				parseMessages([name]);
			}
		} else {
			let names: string[] = [];
			Object.keys(data).forEach((n) => {
				if (n.startsWith(name)) {
					names.push(n);
				}
			});
			names.forEach((n) => {
				if (data[n]) {
					delete data[n];
				}
			});
			loadedMessages[name] = false;
			data = data;
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			bin = input.files[0];
			data = {};
			ready = false;
			loadedMessages = {};
			parseMessages(['POS', 'ATT', 'XKF1', 'XKF2', 'IMU', 'GPS', 'ORGN']);
		}
		ddopen = false;
	}

	function saveData() {
		saveAs(
			new Blob([JSON.stringify(data)], { type: 'application/json' }),
			`${bin!.name.split('.').slice(0, -1).join('.')}.json`
		);
	}
	function clearData() {
    dispatch('clear');
		data = undefined;
		bin = undefined;
	}

	let ddopen = false;
</script>

<Button>{bin ? bin.name : 'Bin'}<ChevronDownOutline /></Button>
<Dropdown bind:open={ddopen}>
	{#if !bin}
		<DropdownItem>
			<Fileupload on:change={handleFileChange} accept=".bin, .BIN" name="BIN file" />
		</DropdownItem>
	{:else}
		<DropdownItem>Select Fields</DropdownItem>
		<MegaMenu>
			<div class="selmsgs">
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
		</MegaMenu>
		<DropdownItem>Show Field Columns</DropdownItem>
		<MegaMenu>
			<div class="minfo">
				<h3>Field</h3>
				<h3>Length</h3>
				<h3>Columns</h3>
				{#each Object.entries(data) as [name, msg]}
					<div>{name}</div>
					<div>{msg.time_boot_s ? msg.time_boot_s.length : 0}</div>
					<div>{Object.keys(msg)}</div>
				{/each}
			</div>
		</MegaMenu>
		<DropdownItem on:click={saveData}>Export Data</DropdownItem>
		<DropdownItem on:click={clearData}>Clear</DropdownItem>
	{/if}
</Dropdown>

<style>
	h3 {
		font-weight: bold;
	}
	.minfo {
		display: grid;
		grid-column-gap: 10px;
		grid-template-columns: max-content max-content 1fr;
	}
	.selmsgs {
		display: grid;
		grid-gap: 5px;
		grid-template-columns: repeat(7, 1fr);
	}
</style>
