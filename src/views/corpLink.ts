import Control from '../control/control';
import { localize } from '../localization/localization';
import './corpLink.css';
  
export class CorpLink extends Control{
    constructor(parentNode: HTMLElement){
        super(parentNode, 'div', 'copr_logo');
        this.node.innerHTML = `
        <div class="corp_block">
            <div class="corp_link">
                <div class="demo_a">
                    <span class="demo_s">De</span>mo</div>by Inikon
                </div>
            <div class="corp_site">
                demo.inikon.online
            <div>
        <div>
        `;
    }
}