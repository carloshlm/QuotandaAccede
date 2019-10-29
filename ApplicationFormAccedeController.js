/**
 * Description: ApplicationFormAccede JavaScript controller.
 * Author: Oscar Becerra
 * Company: Quotanda
 * Email: oscar@quotanda.com
 * Created Date: 2018-04-13
**/
({
    init : function(component, event, helper) {
        helper.init(component, event);
    },
    
    setPaymentFrequency : function(component, event, helper) {
        helper.setPaymentFrequency(component);
    },
    
    setContactRelations : function(component, event, helper) {
        helper.setContactRelations(component);
    },
    
    setTotals : function(component, event, helper) {
        helper.setTotals(component);
    },
    
    navigateStatus : function(component, event, helper) {
        helper.navigateStatus(component, event);
    },
    
    navigateStatusCosigner : function(component, event, helper) {
        helper.navigateStatusCosigner(component, event);
    },
    
    toggleAmortization : function(component, event, helper) {
        helper.toggleAmortization(component);
    },
    
    togglePrivacyStatement : function(component, event, helper) {
        helper.togglePrivacyStatement(component, event);
    },
    
    rerender : function(component, event, helper) {
        helper.rerender(component);
    },
    
    onPastDateChange : function(component, event, helper) {
        helper.onPastDateChange(component, event);
    },
    
    onFutureDateChange : function(component, event, helper) {
        helper.onFutureDateChange(component, event);
    },
    
    onUrlBlur : function(component, event, helper) {
        helper.onUrlBlur(component, event);
    },
    
    onCosignerCivilStatusChange : function(component, event, helper) {
        helper.onCosignerCivilStatusChange(component)
    },
    
    addContactRelation : function(component, event, helper) {
        helper.addContactRelation(component, event);
    },

    addContactPublic : function(component, event, helper) {
        helper.addContactPublic(component, event);
    },
    
    removeContactRelation : function(component, event, helper) {
        helper.removeContactRelation(component, event);
    },
    
    addEstimationDetail : function(component, event, helper) {
        helper.addEstimationDetail(component, event);
    },
    
    removeEstimationDetail : function(component, event, helper) {
        helper.removeEstimationDetail(component, event);
    },
    
    addAcademicHistory : function(component, event, helper) {
        helper.addAcademicHistory(component);
    },
    
    removeAcademicHistory : function(component, event, helper) {
        helper.removeAcademicHistory(component, event);
    },
    
    addJobHistory : function(component, event, helper) {
        helper.addJobHistory(component);
    },
    
    removeJobHistory : function(component, event, helper) {
        helper.removeJobHistory(component, event);
    },
    
    addCosignerContactRelation : function(component, event, helper) {
        helper.addCosignerContactRelation(component, event);
    },
    
    removeCosignerContactRelation : function(component, event, helper) {
        helper.removeCosignerContactRelation(component, event);
    },
    
    addCosignerProperty : function(component, event, helper) {
        helper.addCosignerProperty(component, event);
    },
    
    removeCosignerProperty : function(component, event, helper) {
        helper.removeCosignerProperty(component, event);
    },
    
    save : function(component, event, helper) {
        helper.save(component);
    },
    
    submit : function(component, event, helper) {
        helper.submit(component, event);
    },
    
    submitCosigner : function(component, event, helper) {
        helper.submitCosigner(component, event);
    },
    
    navigateToUrl : function(component, event, helper) {
        helper.navigateToUrl(event);
    }
})