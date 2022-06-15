sap.ui.define([
  "sap/ui/core/mvc/Controller",
], function (Controller) {
  "use strict";
  var base;
  return Controller.extend("com.UI5Starter.Application.App.RootApp", {
    onInit: function () {
      base = this;
      base.getView().setModel(oModel);
    },

  });
});
