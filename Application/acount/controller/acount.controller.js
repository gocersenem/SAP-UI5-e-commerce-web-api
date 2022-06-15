sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'com/UI5Starter/Application/signup/accounts/accountsProcess',

], function(BaseController, accountProcess) {
    'use strict';

    return BaseController.extend("com.UI5Starter.Application.acount.controller.acount", {
        onInit: function() {


        },
        useraccount: function() {
            var usermail = oModel.getProperty("/email");
            var userpassword = oModel.getProperty("/password");
            var userEnter = { email: usermail, password: userpassword };


            search(userEnter).then(res => {
                if (typeof(res) != String) {
                    if (res.password == userpassword) {
                        this.getOwnerComponent().getRouter().navTo("Dashboard"); //login oldu
                    } else {
                        sap.m.MessageToast.show("Kullanıcı adı veya şifre hatalı")

                    }
                } else {
                    sap.m.MessageToast.show(res)
                }
            })

        },
        register: function() {
            this.getOwnerComponent().getRouter().navTo("signup");

        },
        home: function() {
            this.getOwnerComponent().getRouter().navTo("Dashboard");

        }


    })
});