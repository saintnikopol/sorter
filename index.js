import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

var app = new Koa();
app.use(bodyParser());

app.use(async ctx => {
    // the parsed body will store in ctx.request.body
    // if nothing was parsed, body will be an empty object {}
    var json_obj = ctx.request.body;
    let parsed_response = convertToMap(json_obj);

    let orderedArray = convertToOrderedArray(parsed_response);
    console.log('Got json object: \n', json_obj);
    console.log('Parsed: \n', parsed_response);
    console.log('Parsed: \n', orderedArray);
    ctx.body = orderedArray;
});

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
