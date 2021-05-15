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
                    this.subscribeToSalesforceMessages();
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

    handleCaseUpdated(status) {
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

    subscribeToSalesforceMessages() {
        console.log("LISTENING TO STREAM!")
        const connect = () => {
          // Server-Sent Events (SSE) handler to receive messages
          // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
          const eventSource = new EventSource("http://eric-salesforce-stream.herokuapp.com/stream/messages");
    
          // event: salesforce
          // id: ce4ccabd-6359-466d-886a-730689685b0b-27
          // data: {"schema":"njzr4yOHFi71zZhlyqhWXA","payload":{"StatusChanged__c":"Escalated","CreatedById":"0055e0000019yDJAAY","CreatedDate":"2021-05-14T22:02:47.144Z"},"event":{"replayId":2259041},"context":{}}
    
          // Receive Salesforce change events as they occur.
          eventSource.addEventListener("salesforce", event => {
            const message = JSON.parse(event.data);
            console.log("received message!", message)
            this.handleCaseUpdated(message.payload.StatusChanged__c)
          }, false);
        }
    
        connect();
      }
    
    unsubscribeFromSalesforceMessages = () => {
        eventSource.close();
    }
}
