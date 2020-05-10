// Global app controller, all controllers in this file
// import str from './models/Search';

// import * as searchView from './views/searchView'; //imports everything to an object and can call all the methods
// import {add as a, multiply as m, ID} from './views/searchView'; //have to use the exact same name if we want to use them

// console.log(`Using imported functions! ${a(ID,2)} ${m(ID,3)}. ${str}`);

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';

/***Global state 
 * Search Object (all the data of the search)
 * Once central variable in one controller
 * Current Recipe object
 * Shopping list object
 * Light recipes
*/
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // Get query from the view
    const query = searchView.getInput(); 
    if(query) {
        //New search object and added state
        state.search = new Search(query);

        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //Search for recipes

        try{
            await state.search.getResults(); //await until the promise resolves and comes back with data

            // Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);    

        }catch(error){
            alert("Cannot render this result");
        }
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

/***
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight the current selected item
        if(state.search) searchView.highlightSelected(id);

        //create recipe object
        state.recipe = new Recipe(id);
        window.r = state.recipe;

        try{
            // Get Recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            //render recipe
            clearLoader();
            console.log(state.recipe);
            recipeView.renderRecipe(state.recipe);
        } catch (err){
            alert('Error processing recipe');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1){
        state.recipe.updateServings('dec');
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
    }
    recipeView.updateServingsIngredients(state.recipe);
});

window.l = new List();
// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);