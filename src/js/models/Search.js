// export default 'I am an exported string.';
//const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
import axios from 'axios'; //must be the name in the package.kson

export default class Search{
    constructor(query){
        this.query = query;
    }


    async getResults(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;
        }
        catch (error) {
            alert(error);
        }
    }
}