import { LightningElement, track, api } from 'lwc';
import getExams from '@salesforce/apex/mohaliClass1.getExams';
import createExam from '@salesforce/apex/mohaliClass1.createExam';

export default class MohaliTask1 extends LightningElement {

    @track selectedExamType = '';
    @track data = [];
    @track allData = []; 
    @api recordId;

    examOptions = [
        { label: 'External Exam', value: 'External Exam' },
        { label: 'School Exams', value: 'School Exams' },
        { label: 'Government Exam', value: 'Government Exam' },
        { label: 'School Grades', value: 'School Grades' }
    ];

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Grade', fieldName: 'Grade__c' },
        { label: 'status', fieldName: 'status__c' },
        { label: 'Feedback', fieldName: 'Feedback__c'},
        { label: 'Parent Name', fieldName: 'parentName' }
    ];

    connectedCallback() {
        console.log( this.recordId);
        this.loadData();
    }

    loadData() {
        getExams({
            examType: this.selectedExamType,
            parentId: this.recordId
        })
        .then(result => {
            this.allData = result.map(item => {
                return {
                    ...item,
                    parentName: item.student__r ? item.student__r.Name : ''
                };
            });

            this.data = [...this.allData];
        })
        .catch(error => {
            console.error( error);
        });
    }

    handleChange(event) {
        this.selectedExamType = event.target.value;
        this.loadData();
    }

    handleNew() {
        const name = prompt('Enter Exam name');
        if (!name) return;

        const marksInput = prompt('Enter a marks');
        if(!marksInput) return ;
        const marks = parseInt(marksInput,10);

        if (!this.recordId) {
            alert('Parent record not found. Please use this on a record page.');
            return;
        }

        createExam({
            Name: name,
            type: this.selectedExamType,
            parentId: this.recordId,
            marks:marks
        })
        .then(() => {
            this.loadData();
        })
        .catch(error => {
            console.error('CREATE ERROR ', error);
        });
    }

    get buttonLabel() {
        return "New " + this.selectedExamType;
    }

    handleSearch(event) {
        const keyword = event.target.value.toLowerCase();

        this.data = this.allData.filter(item =>
            item.Name && item.Name.toLowerCase().includes(keyword)
        );
    }
}
