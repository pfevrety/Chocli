import { Chocli } from "./src/chocli";
import { Store } from "./src/store";


const client = new Chocli();
const store = new Store();

console.log(await store.getTopPackage());