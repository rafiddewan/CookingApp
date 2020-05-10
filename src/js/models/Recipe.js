import axios from "axios";

export default class Recipe {
  //each recipe identified by an ID
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      console.log(res);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.url = res.data.recipe.source_url;
      this.img = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch {
      console.log(error);
    }
  }

  calcTime() {
    //Assuming that we need 15 minutes for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoon",
      "tablespoons",
      "tbsps",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "tsps",
      "cups",
      "pounds",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      //Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });
      //Remove parantheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); //regular expression
      //Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        //There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> 4 + 1/2
        // Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex); // 4 1/2 cups, arrCount is [4, 1/2]
        let count;

        if(arrCount.length > 1) count = eval(arrCount[arrCount.length -1]); //for things like sticks
        else if (arrCount.length == 1) count = eval(arrIng[0].replace("-", "+"));
        else count = eval(arrIng.slice(0, unitIndex).join("+"));

        if (arrCount[0] === "" ) count = 1.00;
        objIng = {
          count: count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        }
        }
        else if (parseInt(arrIng[0], 10)) {
        //There is NO unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      }
      else if (unitIndex === -1) {
        //There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }
      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    //Servings
    const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;

    //Ingredients
    this.ingredients.forEach(ing => {
      ing.count = ing.count * (newServings / this.servings);
    });
    this.servings = newServings;
  }
}
