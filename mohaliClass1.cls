
public with sharing class mohaliClass1 {

    @AuraEnabled(cacheable=true)
    public static List<Exam__c> getExams(String examType, Id parentId){

        if(parentId == null){
            return [
                SELECT 
                    Id,Name,Grade__c,Status__c,student__c,Feedback__c,student__r.Name
                    FROM Exam__c
                    WHERE Exam_Type__c = :examType
                    ORDER BY CreatedDate DESC
            ];
        }

        else{
            return [
                SELECT 
                    Id,Name,Grade__c,Status__c,student__c,Feedback__c,student__r.Name
                    FROM Exam__c
                    WHERE Exam_Type__c = :examType
                    AND student__c = :parentId
                    ORDER BY CreatedDate DESC
            ];
        }

    }

    @AuraEnabled
    public static Exam__c createExam(String Name,String type,Id parentId, Integer marks){
        Exam__c ex = new Exam__c();
        ex.Name = Name;
        ex.Exam_Type__c = type;
        ex.status__c = 'Active';
        ex.student__c = parentId;
        ex.Grade__c = marks;

        if(marks < 33){
            ex.Feedback__c = 'Fail';
        }
        else if(marks >= 33 && marks < 70){
            ex.Feedback__c = 'Average';
        }
        else{
            ex.Feedback__c = 'Good';
        }

        insert ex;
        return ex;
    }
}
