sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'com/UI5Starter/Application/signup/accounts/accountsProcess'
], function(BaseController, accountsProcess) {
    'use strict';

    return BaseController.extend("com.UI5Starter.Application.admin.adminlogin.adminlogin", {
        onInit: function() {

        },
        adminenter: function() {
            adminSearch({ username: oModel.getProperty("/username"), password: oModel.getProperty("/password") }).then(res => {
                if (res.access) {
                    this.getOwnerComponent().getRouter().navTo("admin", {}, true);
                    sap.m.MessageToast.show("giriş yapıldı")
                } else {
                    sap.m.MessageToast.show(res.re)
                }
            })


        }

    })
});