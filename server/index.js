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
    console.log("let json_obj = ctx.request.body; json_obj  === ", json_obj);
    try {
        let {type, data_array} = json_obj;
        // let parsed_response = convertToMap(json_obj);
        //
        //
        // let orderedArray = convertToOrderedArray(parsed_response);

        console.log('Got json object: \n', json_obj);
        process_sorting(type, data_array);

        // console.log('Parsed: \n', parsed_response);
        console.log('Ordered: \n', data_array);
        ctx.body = data_array;
    } catch (e) {
        console.error("Error: can't process request, error: ", e);
        ctx.body = [];

    }


});

const TYPE_INTEGER = 'integer';
const TYPE_STRING = 'string';
const TYPE_OBJECT = 'object';

function process_sorting (type, data) {
    console.log("function process_sorting (type, data) { type === ", type);
    console.log("function process_sorting (type, data) { data === ", data);

    // let a = [ 1 , 6 , 5 , 3 , 2 , 4 ] ;
    // console.log(" XX let a = [ 1 , 6 , 5 , 3 , 2 , 4 ] ; let  === ", a);

    // sortFunction( compareNumber , a , 0 , a.length ) ;
    sortFunction( getCompareFunction(type), data , 0 , data.length ) ;
    console.log(" XX let result = sort( compareNumber() , a , 0 , a.length ) ; Changed Data === ", data );


}

function getCompareFunction(type) {
    if (type === TYPE_INTEGER) {
        console.log("if (type === TYPE_INTEGER) {");
        return compareNumber;
    } else if (type === TYPE_STRING) {
        console.log("} else if (type === TYPE_STRING) {");
        return compareString;
    } else if (type === TYPE_OBJECT) {
        console.log("} else if (type === TYPE_OBJECT) {");
        console.log("Error: function 'compare object' is not implemented");
        throw "Compare function TYPE_OBJECT Not Implemented";
    } else {
        console.log("Error: unknown compare type");
        throw "Unknown compare TYPE_OBJECT ";
    }
}


function convertToMap (colorsArray) {
    return colorsArray.reduce((acc, item) => {
        if (acc[item] === undefined) {
            acc[item] = 1;
        } else {
            acc[item] = 1 + acc[item];
        }

        return acc;
    }, {});
}

function convertToOrderedArray (map) {
    return Object.keys(map)
        .map(item => ({color: item, count: map[item]}))
        .sort(
        ({count: count1}, {count: count2}) => {
            if (count1 === count2) {
                return 0;
            } else if (count1 > count2) {
                return -1;
            } else if (count1 < count2) {
                return 1;
            }
        }
    );
}

app.listen(8080); //the server object listens on port 8080
