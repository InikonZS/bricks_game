import { Cell } from "./cell";
import { Stack } from "./stack";

export class StackList {
    public stacks: Array<Stack>;

    constructor(width: number, height: number, colors: number, data:Array<Array<number>>) {
        this.stacks = [];
        const stackCount = (width + height) * 2;
        for (let i = 0; i < stackCount; i++) {
            const direction = this.getDirection(i, width, height);
            const initialPosition = this.getInitial(i, width, height);
            const stack = new Stack(colors, direction, initialPosition, data[i]);
            //const stack = new Stack(colors, direction, initialPosition, Stack.generate(3, colors));
            this.stacks.push(stack);
        }
    }

    static generate(width: number, height: number, colors: number){
        const result: Array<Array<number>> = []
        const stackCount = (width + height) * 2;
        for (let i = 0; i < stackCount; i++) {
            result.push(Stack.generate(3, colors));
        }
        return result;
    }

    private getDirection(index: number, width: number, height: number) {
        if (index < height) { return 1; }
        if (index < width + height) { return 2; }
        if (index < width * 2 + height) { return 3; }
        return 4;
    }

    public getInitial(index: number, width: number, height: number) {
        if (index < height) {
            return {
                x: Math.floor(index % height),
                y: 0
            }
        }
        if (index < width + height) {
            return {
                x: 0,
                y: Math.floor((index - height) % width)
            }
        }
        if (index < width * 2 + height) {
            return {
                x: height - 1,
                y: Math.floor((index - width - height) % width)
            }
        }
        return {
            x: Math.floor((index - width * 2 + height) % height),
            y: width - 1
        }
    }

    public findByCell(cell: Cell) {
        const dir = [0, 4, 3, 2, 1];
        return this.stacks.find(stack => {
            return stack.initialPosition.x == cell.position.x && stack.initialPosition.y == cell.position.y && stack.direction == dir[cell.direction];
        });
    }

    save(){
        return this.stacks.map(it=>it.save())
    }

    /*static load(data:any){
        const stackList = new StackList(1,1,1);
        stackList.stacks = data.stacks.map((it:any)=> Stack.load(it));
        return stackList;
    }*/
}