export function generateTemplate(count: number){
    const minSize = Math.ceil((count / 4) ** 0.5);
    const minSizeX = minSize * 2;
    const minSizeY  = minSize; //(minSizeY * (minSizeY)*2) <= count /2 ? (minSizeY*2)+2 : (minSizeY)*2;
    const newField = new Array(minSizeY).fill(null).map((row:Array<number>)=>new Array(minSizeX).fill(0));
    const availablePos = new Array(minSizeY * minSizeX).fill(null).map((it, i)=>{
        return {x: i % minSizeX, y: Math.floor(i / minSizeX)}
    });
    for (let i=0; i< Math.floor(count /2); i++){
        const rnd = Math.floor(Math.random() *availablePos.length);
        const item = availablePos[rnd];
        const lastItem = availablePos.pop();
        if (item !== lastItem){
            availablePos[rnd] = lastItem;
        }
        newField[item.y][item.x] = 1;
    }
    console.log(newField);
    const result = reflectField(newField);
    console.log(result);
    return result;
}

export function generateSimpleTemplate(count: number){
    let minSize = Math.ceil((count) ** 0.5);
    if (minSize ** 2 - count < 1) {
        minSize+=1;
    }
    const newField = new Array(minSize).fill(null).map((row:Array<number>)=>new Array(minSize).fill(0));
    const availablePos = new Array(minSize ** 2).fill(null).map((it, i)=>{
        return {x: i % minSize, y: Math.floor(i / minSize)}
    });
    for (let i=0; i< count; i++){
        const rnd = Math.floor(Math.random() *availablePos.length);
        const item = availablePos[rnd];
        const lastItem = availablePos.pop();
        if (item !== lastItem){
            availablePos[rnd] = lastItem;
        }
        newField[item.y][item.x] = 1;
    }
    console.log(newField);
    return newField;
}

export function generateFourTemplate(count: number){
    const part = generateSimpleTemplate(Math.floor(count / 4));
    const result = reflectField4(part);
    console.log(result);
    return result;
}

function reflectField(field: Array<Array<number>>){
    const result = new Array(field.length * 2).fill(null).map((row:Array<number>)=>new Array(field[0].length).fill(0));
    field.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            result[i][j] = cell;
        })
    });
    field.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            result[field.length*2 - i - 1][j] = cell;
        })
    });
    return result;
}

function reflectField4(field: Array<Array<number>>){
    const result = new Array(field.length * 2).fill(null).map((row:Array<number>)=>new Array(field[0].length * 2).fill(0));
    field.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            result[i][j] = cell;
        })
    });
    field.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            result[field.length*2 - i - 1][j] = cell;
        })
    });
    field.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            result[field.length*2 - i - 1][field[0].length*2 - j - 1] = cell;
        })
    });
    field.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            result[i][field[0].length*2 - j - 1] = cell;
        })
    });
    return result;
}