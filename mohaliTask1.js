// import { LightningElement, track, api } from 'lwc';
// import getExams from '@salesforce/apex/mohaliClass1.getExams';
// import createExam from '@salesforce/apex/mohaliClass1.createExam';
// import Name from '@salesforce/schema/Account.Name';

// export default class MohaliTask1 extends LightningElement {

//     @track selectedExamType = 'External Exam';
//     @track data = [];
//     @track parentId;
//     @api recordId;

//     examOptions = [
//         { label: 'External Exam', value: 'External Exam' },
//         { label: 'School Exams', value: 'School Exams' },
//         { label: 'Government Exam', value: 'Government Exams' },
//         { label: 'School Grades', value: 'School Grades' }
//     ];

//     columns = [
//         { label: 'Name', fieldName: 'Name' },
//         { label: 'Grade', fieldName: 'Grade__c' },
//         { label: 'Status', fieldName: 'Status__c' },
//         { label: 'Parent Name', fieldName: 'parentName' }
//     ];

//     connectedCallback() {
//         this.loadData();
//     }

//     loadData() {
//         getExams({
//             examType: this.selectedExamType,
//             parentId: this.recordId
//         })
//         .then(result => {
//             console.log('i am here');
//             console.log('DATA ---> ', JSON.stringify(result));
//             this.data = result.map(item => {
//                 return {
//                     ...item,
//                     parentName: item.Student__r ? item.Student__r.Name : ''
//                 };
//             });
//         })
//         .catch(error => {
//             console.error(error);
//         });
//     }

//     handleChange(event) {
//         this.selectedExamType = event.target.value;
//         this.loadData();
//     }

//     // onParentSelect(event) {
//     //     console.log('EVENT ---> ', event.detail);
//     //         this.parentId = event.detail.recordId;
//     //          this.loadData();
//     // }
//     //     handleManualId(event) {
//     //     this.parentId = event.target.value;
//     //     }

//     handleNew() {
//     const name = prompt('Enter Exam name');

//     if (!name) return;

//     if (!this.parentId) {
//         alert('Assign with parent');
//         return ;
//     }

//     createExam({
//             Name: Name,
//             type: this.selectedExamType,
//             parentId: this.recordId
//         })
//         .then(() => {
//             console.log('Record created');
//             this.loadData();
//         })
//         .catch(error => {
//             console.error('CREATE ERROR ', JSON.stringify(error));
//         });
//     }

//     get buttonLabel() {
//         return "New " + this.selectedExamType;
//     }

//     handleSearch(event) {
//         const keyword = event.target.value.toLowerCase();

//         this.data = this.data.filter(item =>
//             item.Name.toLowerCase().includes(keyword)
//         );
//     }
// }



import { LightningElement, track, api } from 'lwc';
import getExams from '@salesforce/apex/mohaliClass1.getExams';
import createExam from '@salesforce/apex/mohaliClass1.createExam';

export default class MohaliTask1 extends LightningElement {

    @track selectedExamType = 'External Exam';
    @track data = [];
    @track allData = []; // for search
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
        { label: 'Status', fieldName: 'Status__c' },
        { label: 'Parent Name', fieldName: 'parentName' }
    ];

    connectedCallback() {
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
                    parentName: item.Student__r ? item.Student__r.Name : ''
                };
            });

            this.data = [...this.allData];
        })
        .catch(error => {
            console.error('ERROR ---> ', error);
        });
    }

    handleChange(event) {
        this.selectedExamType = event.target.value;
        this.loadData();
    }

    handleNew() {
        const name = prompt('Enter Exam name');

        if (!name) return;

        if (!this.recordId) {
            alert('Parent record not found. Please use this on a record page.');
            return;
        }

        createExam({
            Name: name,
            type: this.selectedExamType,
            parentId: this.recordId
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
