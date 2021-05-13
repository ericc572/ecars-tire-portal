import { LightningElement } from 'lwc';

const BASE_IMAGE_URL = 'https://sfdc-demo.s3-us-west-1.amazonaws.com/ecars';

export default class Configurator extends LightningElement {
    currentSection = 1;

    ranges = [
        {
            label: 'Buy a new Tire',
            className: 'range-option selected'
        },
        { label: 'Returns and Exchanges', className: 'range-option' },
        { label: 'File Urgent Case', className: 'range-option' }
    ];

    roadsideAssistance = [
        {
            label: 'Yes',
            className: 'roadside-option selected'
        },
        {
            label: 'No',
            className: 'roadside-option'
        },
    ];

    selectedRange = this.ranges[0];
    selectedRoadside = this.roadsideAssistance[0];
    leadRecordId = '';

    get imgUrl() {
        return `https://static.tirerack.com/content/dam/tires/michelin/mi_pilot_super_sport_full.jpg?imwidth=440&impolicy=tow-pdp-main`;
    }

    get imgClass() {
        if (this.currentSection === 2) {
            return 'container-images';
        }
        return 'container-images padded';
    }

    handleRangeChange(event) {
        const rangeLabel = event.currentTarget.dataset.range;
        console.log(rangeLabel);
        let ranges = [];
        this.ranges.forEach((range) => {
            let className = 'range-option';
            if (range.label === rangeLabel) {
                this.selectedRange = range;
                className = className + ' selected';
            }
            ranges.push({
                label: range.label,
                className
            });
        });
        this.ranges = ranges;
        console.log(this.ranges);
        console.log(this.selectedRange);
    }

    handleRoadside(event) {
        // console.log(event.currentTarget.dataset);
        const colorLabel = event.currentTarget.dataset.range;
        console.log(colorLabel);
        let roadsideAssistance = [];
        this.roadsideAssistance.forEach((roadside) => {
            let className = 'roadside-option';
            if (roadside.label === colorLabel) {
                this.selectedRoadside = roadside;
                className = className + ' selected';
            }
            roadsideAssistance.push({
                label: roadside.label,
                className
            });
        });
        this.roadsideAssistance = roadsideAssistance;
        console.log(this.roadsideAssistance);
        console.log(this.selectedRoadside);
    }

    handleLeadChange(event) {
        this.leadRecordId = event.target.value;
    }

    handleNext() {
        this.currentSection = this.currentSection + 1;
    }

    handlePrevious() {
        this.currentSection = this.currentSection - 1;
    }

    get hasNextSection() {
        return this.currentSection < this.numberOfSections;
    }

    get hasPreviousSection() {
        return this.currentSection > 1;
    }

    get isSection1() {
        return this.currentSection === 1;
    }
    get isSection2() {
        return this.currentSection === 2;
    }
    get isSection3() {
        return this.currentSection === 3;
    }
}
