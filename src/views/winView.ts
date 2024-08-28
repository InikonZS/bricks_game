import Control from '../control/control';

export class WinView extends Control {
    onClose: ()=>void;
    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'combo_view', 'Level completed');
    }

    animate() {
        const cellView = this;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            setTimeout(() => {
                console.log('234567');
                cellView.node.remove();
                this.onClose?.();
            }, 2500);
        }))
    }
}