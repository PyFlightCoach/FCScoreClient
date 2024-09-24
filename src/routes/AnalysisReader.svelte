<script lang='ts'>
  import {Button, Dropdown, DropdownItem, Fileupload} from 'flowbite-svelte';
  import {importAnalysis} from '$lib/analysis';
  import {AnalysisExport} from '$lib/analysis_export';
  import {createEventDispatcher} from 'svelte';
  import {goto} from '$app/navigation';
  import {base} from '$app/paths';
  const dispatch = createEventDispatcher();

	const loadAE = (event) => {
		const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
			const contents = reader.result as string;
      importAnalysis(AnalysisExport.parse(JSON.parse(contents)));
      goto(base + '/analysis');
			dispatch('loaded');
		};
		reader.readAsText(file);


	};
</script>



<Dropdown  placement="left-start">
	  <DropdownItem>
			<Fileupload on:change={loadAE} accept="json" name="Analysis File" />
		</DropdownItem>
</Dropdown>
