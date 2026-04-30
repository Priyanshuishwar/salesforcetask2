public with sharing class mohaliClass1 {

    @AuraEnabled(cacheable=true)
    public static List<Exam__c> getExams(String examType, Id parentId){

        if(parentId == null){
            return [
                SELECT 
                    Id,Name,Grade__c,Status__c,student__c,student__r.Name
                    FROM Exam__c
                    WHERE Exam_Type__c = :examType
                    ORDER BY CreatedDate DESC
            ];
        }

        else{
            return [
                SELECT 
                    Id,Name,Grade__c,Status__c,student__c,student__r.Name
                    FROM Exam__c
                    WHERE Exam_Type__c = :examType
                    AND student__c = :parentId
                    ORDER BY CreatedDate DESC
            ];
        }
    }

    @AuraEnabled
    public static Exam__c createExam(String Name,String type,Id parentId){
        Exam__c ex = new Exam__c();
        ex.Name = Name;
        ex.Exam_Type__c = type;
        ex.Status__c = 'Active';
        ex.Student__c = parentId;

        insert ex;
        return ex;
    }
}
