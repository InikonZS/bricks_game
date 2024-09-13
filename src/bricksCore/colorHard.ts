export function randomizeColors(field: Array<Array<number>>, colors: number){
    const resultField: Array<Array<number>> = new Array(field.length).fill(null).map(row=> new Array(field[0].length).fill(undefined));
    resultField.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            if (field[i][j] == 1){
                const closestColors = [
                    resultField[i-1]?.[j],
                    resultField[i+1]?.[j],
                    resultField[i]?.[j-1],
                    resultField[i]?.[j+1],
                ].filter(it=>it != undefined);
                const remainedColors = new Array(colors).fill(0).map((it, k)=> k).filter(it=>!closestColors.includes(it));
                resultField[i][j] = remainedColors[Math.floor(Math.random() *remainedColors.length)] || 0;
            }
        });
    });
    return resultField;
}