import Koa from 'koa';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import quicksort from './quicksort';

let {sortFunction, compareString, compareNumber} = quicksort;

var app = new Koa();
app.use(cors());
app.use(bodyParser());

app.use(async ctx => {
    // the parsed body will store in ctx.request.body
    // if nothing was parsed, body will be an empty object {}
    let json_obj = ctx.request.body;
    try {
        // console.log('Got json object: \n', json_obj);
        let {type, data_array} = json_obj;
        let response_data = process_sorting(type, data_array);
        // console.log('Parsed: \n', parsed_response);
        // console.log('Ordered: \n', response_data);
        ctx.body = response_data;
    } catch (e) {
        console.error('Error: can\'t process request, error: ', e);
        ctx.body = [];

    }

});

const TYPE_INTEGER = 'integer';
const TYPE_STRING = 'string';
const TYPE_OBJECT = 'object';

function process_sorting (type, data) {

    let responseData = null;
    if (type === TYPE_INTEGER || type === TYPE_STRING) {
        sortFunction(getCompareFunction(type), data, 0, data.length);
        responseData = data;
    } else if (type === TYPE_OBJECT) {
        /**
         * NOTE: where is no good way to compare object in general.
         * But it's possible to compare strings,
         * For performance optimisation JSON.stringify operation is called only once per item,
         * not per each comparision
         */
        let objectStringArray = data.map(JSON.stringify);
        sortFunction(getCompareFunction(TYPE_STRING), objectStringArray, 0, data.length);
        responseData = objectStringArray.map(JSON.parse);
    }

    return responseData;
}

function getCompareFunction (type) {
    if (type === TYPE_INTEGER) {
        return compareNumber;
    } else if (type === TYPE_STRING) {
        return compareString;
    } else if (type === TYPE_OBJECT) {
        console.log('Error: function \'compare object\' is not implemented');
        throw 'Compare function TYPE_OBJECT Not Implemented';
    } else {
        console.log('Error: unknown compare type', type);
        throw 'Unknown compare type ';
    }
}

app.listen(8080); //the server object listens on port 8080
