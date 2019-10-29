/**
 * Description: ApplicationFormAccede JavaScript helper.
 * Author: Oscar Becerra
 * Company: Quotanda
 * Email: oscar@quotanda.com
 * Created Date: 2018-04-13
**/
({
    init : function(component, event) {
        if(event.getType() === 'c:SObjectTreeEvent' && event.getParam('params').type !== 'postUpsert') return;
        this.setFields(component);
        this.setEstimationDetails(component);
        this.setContactRelations(component);
        this.setApplicationRelations(component);
        this.setAcademicHistories(component);
        this.setJobHistories(component);
        this.setCosignerContactRelations(component);
        this.setBalances(component);
        this.setTotals(component);
    },
    
    setFields : function(component) {
        var application = component.get('v.application');
        var applicationId = application.Id;
        component.set('v.application.Id', null);
        component.set('v.application.Id', applicationId);
        component.set('v.params.status', application.Status__c);
    },
    
    setEstimationDetails : function(component) {
        var application = component.get('v.application');
        if(application.Status__c === 'NEW - PRE APPROVED' || application.EstimationDetails__r) {
            var label = component.get('v.label');
            var estimationDetails = [{
                concepts: [label.ce1, label.ce2, label.ce3, label.ce4, label.ce5],
                type: 'Expense'
            }, {
                concepts: [label.ci1, label.ci2, label.ci3],
                type: 'Payment Source'
            }];
            if(!application.EstimationDetails__r) {
                application.EstimationDetails__r = [];
                estimationDetails.forEach(function(estimationDetail) {
                    estimationDetail.concepts.forEach(function(concept) {
                        application.EstimationDetails__r.push({
                            CurrencyIsoCode: application.CurrencyIsoCode,
                            Concept__c: concept,
                            Type__c: estimationDetail.type
                        });
                    });
                });
            }  else {
                var concepts = estimationDetails[0].concepts.concat(estimationDetails[1].concepts);
                for(var i=0; i<concepts.length; i++) application.EstimationDetails__r[i].Concept__c = concepts[i];
            }
        }
    },
    
	setContactRelations : function(component) {
        var application = component.get('v.application');
        if(application.Status__c === 'NEW - PRE APPROVED') {
            if(!application.Contact__r.ContactRelations__r) application.Contact__r.ContactRelations__r = [];
            ['', '', 'Father', 'Mother'].forEach(function(relationship) {
                if(application.Contact__r.ContactRelations__r.length < 2 || (relationship !== '' && !application.Contact__r.ContactRelations__r.filter(function(contactRelation) {
                    return contactRelation.Relationship__c === relationship;
                }).length)) application.Contact__r.ContactRelations__r.push({
                    CurrencyIsoCode: application.CurrencyIsoCode,
                    Relationship__c: relationship,
                    RelatedContact__r: {
                        AccountId: application.Account__c,
                        CurrencyIsoCode: application.CurrencyIsoCode,
                        LastName: '',
                        Language__c: application.Contact__r.Language__c
                    }
                });
            });
            if(application.Contact__r.ContactRelations__r.length > 2) for(var i=0; i<2; i++) for(var j=2; j<application.Contact__r.ContactRelations__r.length; j++) if(['Father', 'Mother'].indexOf(application.Contact__r.ContactRelations__r[i].Relationship__c) > -1 && application.Contact__r.ContactRelations__r[i].Relationship__c === application.Contact__r.ContactRelations__r[j].Relationship__c) application.Contact__r.ContactRelations__r.splice(j--, 1);
            component.set('v.application', application);
        }
    },
    
    setApplicationRelations : function(component) {
        var application = component.get('v.application');
        if(application.Status__c === 'NEW - PRE APPROVED' && !application.ApplicationRelations__r) {
            application.ApplicationRelations__r = [];
          //  ['Co-signer', 'Co-debtor'].forEach(function(type) {
			  ['Co-debtor'].forEach(function(type) {
                application.ApplicationRelations__r.push({
                    CurrencyIsoCode: application.CurrencyIsoCode,
                    Application__c: application.Id,
                    Type__c: type,
                    Contact__r: {
                        AccountId: application.Account__c,
                        CurrencyIsoCode: application.CurrencyIsoCode,
                        LastName: '',
                        CosignerRole__c: type,
                        Language__c: application.Contact__r.Language__c,
                        MagentrixUserRole__c: 'Cosigner'
                    }
                });
            });
        }
    },
    
    setAcademicHistories : function(component) {
        var application = component.get('v.application');
        if(application.Status__c === 'NEW - PRE APPROVED' && !application.Contact__r.AcademicHistory__r) application.Contact__r.AcademicHistory__r = [{
            CurrencyIsoCode: application.CurrencyIsoCode
        }];
    },
    
    setJobHistories : function(component) {
        var application = component.get('v.application');
        if(application.Status__c === 'NEW - PRE APPROVED' && !application.Contact__r.JobHistory__r) application.Contact__r.JobHistory__r = [{
            CurrencyIsoCode: application.CurrencyIsoCode
        }];
        if(application.ApplicationRelations__r) application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(component.get('v.contactId') === applicationRelation.Contact__c && !applicationRelation.Contact__r.JobHistory__r) applicationRelation.Contact__r.JobHistory__r = [{
                CurrencyIsoCode: application.CurrencyIsoCode
            }];
        });
    },
    
    setCosignerContactRelations : function(component) {
        var application = component.get('v.application');
        if(application.ApplicationRelations__r) application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__c === component.get('v.contactId') && !applicationRelation.Contact__r.ContactRelations__r) {
                applicationRelation.Contact__r.ContactRelations__r = [];
                ['Professional Reference', 'Personal Reference', 'Personal Reference'].forEach(function(relationship) {
                    applicationRelation.Contact__r.ContactRelations__r.push({
                        CurrencyIsoCode: application.CurrencyIsoCode,
                        Relationship__c: relationship,
                        RelatedContact__r: {
                            AccountId: application.Account__c,
                            CurrencyIsoCode: application.CurrencyIsoCode,
                            LastName: '',
                            Language__c: application.Contact__r.Language__c
                        }
                    });
                });
            }
        });
    },
    
    setBalances : function(component) {
        var application = component.get('v.application');
        if(application.ApplicationRelations__r) application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(component.get('v.contactId') === applicationRelation.Contact__c) {
                var label = component.get('v.label');
                var balanceDetails = [{
                    concepts: [label.ba1, label.ba2, label.ba3, label.ba4, label.ba5],
                    type: 'Asset'
                }, {
                    concepts: [label.bl1, label.bl2, label.bl3, label.bl4, label.bl5, label.bl6],
                    type: 'Liability'
                }];
                if(!applicationRelation.Contact__r.Balances__r) {
                    applicationRelation.Contact__r.Balances__r = [{
                        CurrencyIsoCode: application.CurrencyIsoCode,
                        Application1__c: application.Id,
                        BalanceDetails__r: []
                    }];
                    balanceDetails.forEach(function(balanceDetail) {
                        balanceDetail.concepts.forEach(function(concept) {
                            applicationRelation.Contact__r.Balances__r[0].BalanceDetails__r.push({
                                CurrencyIsoCode: application.CurrencyIsoCode,
                                Concept__c: concept,
                                Type__c: balanceDetail.type,
                                Value__c: 0
                            });
                        });
                    });
                } else {
                    var concepts = balanceDetails[0].concepts.concat(balanceDetails[1].concepts);
                    for(var i=0; i<concepts.length; i++) applicationRelation.Contact__r.Balances__r[0].BalanceDetails__r[i].Concept__c = concepts[i];
                }
            }
        });
    },
    
    setTotals : function(component) {
        var application = component.get('v.application');
        var params = component.get('v.params');
        application.InterestRate__c = params.TIIE91+params.TEMInterestRatePolitical;
        if(application.EstimationDetails__r && application.EstimationDetails__r.length) {
            var totalExpense = 0;
            var totalIncome = 0;
            application.EstimationDetails__r.forEach(function(estimationDetail) {
                var value = estimationDetail.Value__c ? Number(estimationDetail.Value__c) : 0;
                if(estimationDetail.Type__c === 'Expense') totalExpense += value;
                else totalIncome += value;
            });
            application.OriginalLoanAmount__c = application.EstimationDetails__r[0].Value__c ? application.EstimationDetails__r[0].Value__c*0.6 : 0;
            if(application.OriginalLoanAmount__c > 500000) application.OriginalLoanAmount__c = 500000;
            if(application.OriginalLoanAmount__c > totalExpense-totalIncome) application.OriginalLoanAmount__c = totalExpense-totalIncome;
            if(application.OriginalLoanAmount__c < 0) application.OriginalLoanAmount__c = 0;
            application.InsuranceFee__c = application.OriginalLoanAmount__c*0.6*0.025*1.16;
            application.OriginationFee__c = application.OriginalLoanAmount__c*0.05*1.16;
            //application.LoanAmount__c = application.OriginalLoanAmount__c+application.InsuranceFee__c+application.OriginationFee__c;
            component.set('v.label.originalLoanAmountUSD', application.OriginalLoanAmount__c/params.USDMXN);
            component.set('v.label.totalExpense', totalExpense);
            component.set('v.label.totalIncome', totalIncome);
            component.set('v.label.stillNeed', totalExpense-totalIncome-application.OriginalLoanAmount__c > 0 ? totalExpense-totalIncome-application.OriginalLoanAmount__c : 0);
        }
        if(application.ApplicationRelations__r && application.ApplicationRelations__r.length) application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__r && applicationRelation.Contact__r.Balances__r && applicationRelation.Contact__r.Balances__r.length && applicationRelation.Contact__r.Balances__r[0].BalanceDetails__r) {
                ['Asset', 'Liability'].forEach(function(type) {
                    var total = 0;
                    applicationRelation.Contact__r.Balances__r[0].BalanceDetails__r.filter(function(balanceDetail) {
                        return balanceDetail.Type__c === type;
                    }).forEach(function(balanceDetail) {
                        total += parseFloat(balanceDetail.Value__c);
                    });
                    component.set('v.label.'+type, total);
                });
            }
        });
        component.set('v.application', application);
    },
    
    setPaymentFrequency : function(component) {
        var application = component.get('v.application');
        if(application.DurationProgram__c && application.NumberOfDisbursements__c) component.set('v.label.disbursementFrequency', parseFloat((application.DurationProgram__c/application.NumberOfDisbursements__c).toFixed(2).toString()));
    },
    
    navigateStatus : function(component, event) {
        var application = component.get('v.application');
        var newStatus = event.getParam('detail').value;
        var oldStatus = component.get('v.params').status;
        var statusArr = ['NEW - ENTERED', 'NEW - PRE APPROVED', 'NEW - IN REVIEW', 'APPROVED - APPROVED', 'APPROVED - DOCUMENT CHECK', 'APPROVED - CONTRACT SIGNATURE REQUEST', 'APPROVED - CONVERTED TO CONTRACT'];
        application.Status__c = statusArr.indexOf(newStatus) > statusArr.indexOf(oldStatus) ? oldStatus : newStatus;
        component.set('v.params.readOnly', statusArr.indexOf(newStatus) < statusArr.indexOf(oldStatus));
        component.set('v.params.isSubmitted', false);
        component.set('v.application', application);
    },
    
    navigateStatusCosigner : function(component, event) {
        var application = component.get('v.application');
        var applicationRelation = application.ApplicationRelations__r.filter(function(applicationRelation) {
            return applicationRelation.Contact__c === component.get('v.contactId');
        })[0];
        component.set('v.params.readOnly', component.get('v.params').readOnly || applicationRelation.Contact__r.IsDataSubmitted__c);
        if(component.get('v.params').readOnly) applicationRelation.Contact__r.IsDataSubmitted__c = event.getParam('detail').value === 'APPROVED - APPROVED';
        component.set('v.application', application);
    },
    
    toggleAmortization : function(component) {
        $A.util.toggleClass(component.find('amortization'), 'slds-hide');
    },
    
    togglePrivacyStatement : function(component, event) {
        $A.util.toggleClass(component.find('privacyStatement'), 'slds-hide');
    },
    
    rerender : function(component) {
        component.set('v.application', component.get('v.application'));
    },
    
    onPastDateChange : function(component, event) {
        var source = event.getSource();
        var value = source.get('v.value');
        if(value && /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(value)) {
            value = value.split('-');
            source.setCustomValidity(new Date() < new Date(value[0], value[1]-1, value[2]) ? component.get('v.label').m2 : '');
        }
        source.reportValidity();
    },
    
    onFutureDateChange : function(component, event) {
        var source = event.getSource();
        var value = source.get('v.value');
        if(value && /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(value)) {
            value = value.split('-');
            source.setCustomValidity(new Date() > new Date(value[0], value[1]-1, value[2]) ? component.get('v.label').m3 : '');
        }
        source.reportValidity();
    },
    
    onUrlBlur : function(component, event) {
        var source = event.getSource();
        var value = source.get('v.value');
        if(value && value.indexOf('http') < 0) source.set('v.value', 'http://'+value);
        source.showHelpMessageIfInvalid();
    },
    
    onCosignerCivilStatusChange : function(component) {
        var application = component.get('v.application');
        application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__c === component.get('v.contactId')) {
                if(applicationRelation.Contact__r.CivilStatus__c === 'Married') applicationRelation.Contact__r.ContactRelations__r.push({
                    CurrencyIsoCode: application.CurrencyIsoCode,
                    Relationship__c: 'Spouse',
                    RelatedContact__r: {
                        AccountId: application.Account__c,
                        CurrencyIsoCode: application.CurrencyIsoCode,
                        LastName: '',
                        Language__c: application.Contact__r.Language__c
                    }
                });
                else applicationRelation.Contact__r.ContactRelations__r = applicationRelation.Contact__r.ContactRelations__r.filter(function(contactRelation) {
                    return contactRelation.Relationship__c !== 'Spouse';
                });
            }
        });
        component.set('v.application', application);
    },
    
    addContactRelation : function(component, event) {
        var application = component.get('v.application');
        if(!application.Contact__r.ContactRelations__r) application.Contact__r.ContactRelations__r = [];
        application.Contact__r.ContactRelations__r.push({
            CurrencyIsoCode: application.CurrencyIsoCode,
            Relationship__c: event.getSource().get('v.value'),
            RelatedContact__r: {
                AccountId: application.Account__c,
                CurrencyIsoCode: application.CurrencyIsoCode,
                LastName: '',
                Language__c: application.Contact__r.Language__c
            }
        });
        component.set('v.application', application);
    },

    addContactPublic : function(component, event) {
        var application = component.get('v.application');
        if(!application.Contact__r.ContactRelations__r) application.Contact__r.ContactRelations__r = [];
        application.Contact__r.ContactRelations__r.push({
            CurrencyIsoCode: application.CurrencyIsoCode,
            RelationType__c: event.getSource().get('v.value'),
            RelatedContact__r: {
                AccountId: application.Account__c,
                CurrencyIsoCode: application.CurrencyIsoCode,
                LastName: '',
                Language__c: application.Contact__r.Language__c
            }
        });
        component.set('v.application', application);
    },
    
    removeContactRelation : function(component, event) {
        var application = component.get('v.application');
        application.Contact__r.ContactRelations__r.splice(parseInt(event.getSource().get('v.value')), 1);
        component.set('v.application', application);
    },
    
    addEstimationDetail : function(component, event) {
        var application = component.get('v.application');
        application.EstimationDetails__r.push({
            CurrencyIsoCode: application.CurrencyIsoCode,
            Type__c: event.getSource().get('v.value')
        });
        component.set('v.application', application);
        this.setTotals(component);
    },
    
    removeEstimationDetail : function(component, event) {
        var application = component.get('v.application');
        application.EstimationDetails__r.splice(parseInt(event.getSource().get('v.value')), 1);
        component.set('v.application', application);
        this.setTotals(component);
    },
    
    addAcademicHistory : function(component) {
        var application = component.get('v.application');
        application.Contact__r.AcademicHistory__r.push({
            CurrencyIsoCode: application.CurrencyIsoCode
        });
        component.set('v.application', application);
    },
    
    removeAcademicHistory : function(component, event) {
        var application = component.get('v.application');
        application.Contact__r.AcademicHistory__r.splice(parseInt(event.getSource().get('v.value')), 1);
        component.set('v.application', application);
    },
    
    addJobHistory : function(component) {
        var application = component.get('v.application');
        application.Contact__r.JobHistory__r.push({
            CurrencyIsoCode: application.CurrencyIsoCode
        });
        component.set('v.application', application);
    },
    
    removeJobHistory : function(component, event) {
        var application = component.get('v.application');
        application.Contact__r.JobHistory__r.splice(parseInt(event.getSource().get('v.value')), 1);
        component.set('v.application', application);
    },
    
    addCosignerContactRelation : function(component, event) {
        var application = component.get('v.application');
        application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__c === component.get('v.contactId')) {
                if(!applicationRelation.Contact__r.ContactRelations__r) applicationRelation.Contact__r.ContactRelations__r = [];
                applicationRelation.Contact__r.ContactRelations__r.push({
                    CurrencyIsoCode: application.CurrencyIsoCode,
                    Relationship__c: event.getSource().get('v.value'),
                    RelatedContact__r: {
                        AccountId: application.Account__c,
                        CurrencyIsoCode: application.CurrencyIsoCode,
                        LastName: '',
                        Language__c: application.Contact__r.Language__c
                    }
                });
            }
        });
        component.set('v.application', application);
    },
    
    removeCosignerContactRelation : function(component, event) {
        var application = component.get('v.application');
        application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__c === component.get('v.contactId')) applicationRelation.Contact__r.ContactRelations__r.splice(parseInt(event.getSource().get('v.value')), 1);
        });
        component.set('v.application', application);
    },
    
    addCosignerProperty : function(component) {
        var application = component.get('v.application');
        application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__c === component.get('v.contactId')) applicationRelation.Contact__r.Balances__r[0].BalanceDetails__r.push({
                CurrencyIsoCode: application.CurrencyIsoCode,
                Type__c: 'Asset',
                Value__c: 0
            });
        });
        this.setTotals(component);
        component.set('v.application', application);
    },
    
    removeCosignerProperty : function(component, event) {
        var application = component.get('v.application');
        application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__c === component.get('v.contactId')) applicationRelation.Contact__r.Balances__r[0].BalanceDetails__r.splice(parseInt(event.getSource().get('v.value')), 1);
        });
        this.setTotals(component);
        component.set('v.application', application);
    },
    
    save : function(component) {
        if(!this.validate(component, false)) return;
        var application = component.get('v.application');
        if(application.ApplicationRelations__r && application.Contact__c === component.get('v.contactId')) application.ApplicationRelations__r.forEach(function(applicationRelation, index) {
            application.Contact__r.ContactRelations__r[index].RelatedContact__c = applicationRelation.Contact__c;
            Object.assign(applicationRelation.Contact__r, application.Contact__r.ContactRelations__r[index].RelatedContact__r);
            delete application.Contact__r.ContactRelations__r[index].RelatedContact__r;
        });
        if(application.BankAccounts__r && application.BankAccounts__r.length && Object.keys(application.BankAccounts__r[0]).length === 0 && application.BankAccounts__r[0].constructor === Object) delete application.BankAccounts__r;
        console.log('doss');
        if(application.ApplicationRelations__r && application.ApplicationRelations__r.length) application.ApplicationRelations__r.forEach(function(applicationRelation) {
            console.log('doss1');
            if(applicationRelation.Contact__r && applicationRelation.Contact__r.JobHistory__r && applicationRelation.Contact__r.JobHistory__r.length && Object.keys(applicationRelation.Contact__r.JobHistory__r[0]).length === 0 && applicationRelation.Contact__r.JobHistory__r[0].constructor === Object) delete applicationRelation.Contact__r.JobHistory__r;
        });
        console.log('doss2');
        $A.get('e.c:SObjectTreeEvent').setParams({
            params: {
                type: 'upsert'
            }
        }).fire();
        if(application.ApplicationRelations__r && application.Contact__c === component.get('v.contactId')) application.ApplicationRelations__r.forEach(function(applicationRelation, index) {
            application.Contact__r.ContactRelations__r[index].RelatedContact__r = applicationRelation.Contact__r;
        });
    },
    
    submit : function(component, event) {
        console.log('un1');
        if(!this.validate(component, true)) return;
        console.log('un2');
        var application = component.get('v.application');
        //var originationProcess = component.get('v.originationProcess');
        var previousStatus = application.Status__c;
        
        //application.OriginationProcess__c = originationProcess.Id;

        console.log('un22');
        application.Status__c = event.getSource().get('v.value');
        
        
        application.Contact__r.MagentrixUser__c = true;
        application.Contact__r.MagentrixUserRole__c = 'Student Borrower';
        application.Contact__r.LastName = application.Contact__r.PaternalSurname__c+' '+application.Contact__r.MaternalSurname__c;
        application.RecordTypeId = component.get('v.describe.Application__c.recordTypes.Lead');
        
        
        
        if(application.Status__c === 'APPROVED - DOCUMENT CHECK') {
            var applicationUpsertTree = component.get('v.applicationUpsertTree');
            delete applicationUpsertTree.ApplicationRelations__r;
            component.set('v.applicationUpsertTree', applicationUpsertTree);
        }
        component.set('v.params.isSubmitted', true);
        console.log('un3');
        this.save(component);
        console.log('un4');
        application.Status__c = previousStatus;
        console.log('un5');
        component.set('v.application', application);
        console.log('un6');
    },
    
    submitCosigner : function(component, event) {
        if(!this.validate(component, true)) return;
        var application = component.get('v.application');
        var that = this;
        application.ApplicationRelations__r.forEach(function(applicationRelation) {
            if(applicationRelation.Contact__c === component.get('v.contactId')) {
                applicationRelation.Contact__r.IsDataSubmitted__c = true;
                if(event.getSource().get('v.value') !== 'true') that.save(component);
                else component.set('v.params.isCosignerSubmitted', true);
            }
        });
    },
    
    validate : function(component, validate) {
        var valid = true;
        var f = component.find('f');
        if(f) f.reverse().forEach(function(f) {
            if(validate || f.get('v.value')) {
                f.showHelpMessageIfInvalid();
                if(!f.get('v.validity').valid) valid = f.focus();
            }
        });
        return valid;
    },
    
    navigateToUrl : function(event) {
        var url = event.getSource().get('v.value');
        window.location.href = url.indexOf('http') === 0 ? url : window.location.href.substring(0, window.location.href.indexOf('?')+1).replace('/Application', '/Loan')+url;
    }
})