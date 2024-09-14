import { manNames } from "$lib/stores";
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { get } from "svelte/store";

export async function load() {
  if (!get(manNames)) {
    goto(base + "/");
  }
}