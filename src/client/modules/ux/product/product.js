import { LightningElement, api } from 'lwc';
import { subscribe, unsubscribe, isSubscribed } from 'ux/push';

export default class Product extends LightningElement {
    @api selectedRange;
    @api selectedRoadside;

    hasSubscription = isSubscribed();
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
            subscribe(
                {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    mobilePhone: this.cellPhone,
                    description: this.description,
                    company: 'Private',
                    leadSource: 'Web'
                },
                {
                    name: 'New Case:',
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
                                message: 'Thank you for your subscription!'
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
                                message: `Your subscription failed. (${err.message})`
                            }
                        })
                    );
                })
                .finally(() => {
                    this.hasSubscription = isSubscribed();
                });
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

    handleUnsubscribe() {
        unsubscribe()
            .then(() => {
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
            })
            .catch((err) => {
                this.dispatchEvent(
                    new CustomEvent('showtoast', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            variant: 'error',
                            message: `Your unsubscription failed. (${err.message})`
                        }
                    })
                );
            })
            .finally(() => {
                this.hasSubscription = isSubscribed();
            });
    }

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }
}
