<script lang='ts'>
  import {Button, Dropdown, DropdownItem, Fileupload} from 'flowbite-svelte';
  import {importAnalysis} from '$lib/analysis';
  import {AnalysisExport} from '$lib/analysis_export';
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();


  let ddopen = false;

	const loadAE = (event) => {
		const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
			const contents = reader.result as string;
      const aE = AnalysisExport.parse(JSON.parse(contents));
			
			dispatch('loaded', {aE});


      importAnalysis(aE);

		};
		reader.readAsText(file);


	};
</script>



<Dropdown  placement="left-start">
	  <DropdownItem>
			<Fileupload on:change={loadAE} accept="json" name="Analysis File" />
		</DropdownItem>
</Dropdown>
