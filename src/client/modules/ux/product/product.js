import { LightningElement, api } from 'lwc';
import { createCase } from 'ux/push';

export default class Product extends LightningElement {
    @api selectedRange;
    @api selectedRoadside;

    showToast = false;

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleCellPhoneChange(event) {
        this.cellPhone = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    handleSubscribe() {
        if (this.firstName && this.lastName) {
            createCase(
                {
                    name: 'New Case:',                    
                    firstName: this.firstName,
                    lastName: this.lastName,
                    contactemail: this.email,
                    priority: "High",
                    contactPhone: this.cellPhone,
                    description: this.description,
                    company: 'Private',
                    leadSource: 'Web',
                    range: this.selectedRange.replace(/ /, '_'),
                    roadside: this.selectedRoadside.replace(/ /, '_'),
                }
            )
                .then(() => {
                    this.dispatchEvent(
                        new CustomEvent('showtoast', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                variant: 'success',
                                message: 'Your case has been received!'
                            }
                        })
                    );
                })
                .catch((err) => {
                    this.dispatchEvent(
                        new CustomEvent('showtoast', {
                            bubbles: true,
                            composed: true,
                            detail: {
                                variant: 'error',
                                message: `New case generation failed. (${err.message})`
                            }
                        })
                    );
                })
        } else {
            this.dispatchEvent(
                new CustomEvent('showtoast', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        variant: 'error',
                        message:
                            'Please provide data for your first and lastname.'
                    }
                })
            );
        }
    }

    handleCaseCased(status) {
        this.dispatchEvent(
            new CustomEvent('showtoast', {
                bubbles: true,
                composed: true,
                detail: {
                    variant: 'success',
                    message:
                        `Your case status has been changed to: ${status}`
                }
            })
        );
    }

    handleUnsubscribe() {
        this.dispatchEvent(
            new CustomEvent('showtoast', {
                bubbles: true,
                composed: true,
                detail: {
                    variant: 'success',
                    message: 'Your unsubscription is registered.'
                }
            })
        );
    }

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }
}
