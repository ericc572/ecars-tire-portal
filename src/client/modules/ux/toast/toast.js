import { LightningElement, api } from 'lwc';

export default class Toast extends LightningElement {
    @api message;
    @api variant;
    @api mode;

    get cssToastTheme() {
        return `slds-notify slds-notify_toast slds-theme_${this.variant}`;
    }
}
