sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
], function(BaseController) {
    'use strict';
    return BaseController.extend("com.UI5Starter.Application.signup.controller.signup", {
        onInit: function() {



        },
        userAdd: function() {

            var username = oModel.getProperty("/username");

            var usermail = oModel.getProperty("/email");
            var userpassword = oModel.getProperty("/password");
            var mailSplit = usermail.split(".");

            if (mailSplit[0].length >= 2 & mailSplit[1].includes("com") & mailSplit[0].includes("@") & userpassword !== undefined & username !== undefined) {
                var user = { name: username, email: usermail, password: userpassword };
                addUser(user).then(res => {
                    sap.m.MessageToast.show("Kaydın başarıyla oluşturuldu sevgili " + username);
                    this.getOwnerComponent().getRouter().navTo("Dashboard");

                })
            } else {
                sap.m.MessageToast.show("Lütfen kaydınızı tekrar düzenleyiniz");


            }

        },
        home: function() {
            this.getOwnerComponent().getRouter().navTo("Dashboard");

        },
        routelogin: function() {
            this.getOwnerComponent().getRouter().navTo("acount");

        }


    })
});