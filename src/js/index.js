// Global app controller, all controllers in this file
// import str from './models/Search';

// import * as searchView from './views/searchView'; //imports everything to an object and can call all the methods
// import {add as a, multiply as m, ID} from './views/searchView'; //have to use the exact same name if we want to use them

// console.log(`Using imported functions! ${a(ID,2)} ${m(ID,3)}. ${str}`);

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';

/***Global state 
 * Search Object (all the data of the search)
 * Once central variable in one controller
 * Current Recipe object
 * Shopping list object
 * Light recipes
*/
const state = {};

const controlSearch = async () => {
    // Get query from the view
    const query = searchView.getInput(); 
    console.log(query);
    if(query) {
        //New search object and added state
        state.search = new Search(query);

        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //Search for recipes
        await state.search.getResults(); //await until the promise resolves and comes back with data

        // Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchRes.addEventListener('click', e=> {
    const btn = e.target.closest(`.${elementStrings.searchPage}`);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

const search = new Search('chicken');
search.getResults();
