sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'com/UI5Starter/Application/database/database',
    'com/UI5Starter/Application/cart/controller/cartProcess',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox',
], function(BaseController, database, cartProcesss, Filter, FilterOperator, MessageBox) {
    'use strict';
    var categories = [];
    var products = [];
    var productCount = 0;
    var shopproducts = [];
    var count = 1;
    return BaseController.extend("com.UI5Starter.Application.Dashboard.controller.Dashboard", {
        onInit: function() {
            getTable()
            oModel.setProperty("/productCount", productCount.toString());
            readProducts().then(res => {
                res.forEach(pro => {
                    var categoryname, authorname;
                    getCategory(pro.categoryid).then(r => {
                        categoryname = r.name;
                    })
                    getAuthor(pro.authorid).then(r => {
                        authorname = r.name;
                        products.push({
                            id: pro.id,
                            name: pro.name,
                            price: pro.price,
                            stock: pro.stock,
                            image: pro.image,
                            authorid: pro.authorid,
                            categoryid: pro.categoryid,
                            category: categoryname,
                            author: authorname
                        });
                        oModel.setProperty("/products", products)
                    })

                });
            });
            readCategories().then(res => {
                res.forEach(cat => {
                    categories.push(cat);
                    oModel.setProperty("/categories", categories)

                });
            })
            this.readCart();
        },
        readCart: function() {
            return new Promise(function(resolve, reject) {
                readCart().then(allitems => {
                    allitems.forEach(p => {
                        shopproducts.push(p);
                        productCount = allitems.length;
                        oModel.setProperty("/productCount", productCount);
                    });

                });
                resolve(true)
            })
        },

        selectedCategory: function() {
            var tablo = this.getView().byId("categoriesList");
            var selected = tablo.getSelectedItem();
            var sPath = selected.getBindingContext().getPath();
            var item = this.getView().getModel().getProperty(sPath);
            var aFilters = [];
            var sQuery = item.id;
            var filter = new Filter("categoryid", FilterOperator.Contains, sQuery);
            aFilters.push(filter);
            var oList = this.byId("table");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);

        },
        onSearch: function(oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            var filter = new Filter("name", FilterOperator.Contains, sQuery);
            aFilters.push(filter);
            var oList = this.byId("table");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },
        onChange: function(oEvent) {
            count = parseInt(oEvent.getParameter("value"));
        },
        addCart: function(oEvent) {
            var item = oEvent.getSource().getParent().getBindingContext().getObject();

            this.readCart().then(r => {
                var added = shopproducts.find(function(a) { if (a.id === item.id) { return true } });
                if (added) {
                    getToCart(item.id).then(t => {
                        count += t.count;
                        updateCart(count, item.id).then(t => {})
                    });

                } else {
                    oModel.setProperty("/productCount", productCount);
                    addToCart(item.id, count).then(res => {

                        location.reload(); //aynı ürünü iki kez ekkledikten sonra diziye eklendiğini algılıyor bunun için readcart yapması için promise kullandım ama iki kez eklendikten sonra algılıyor
                    })
                }
                sap.m.MessageToast.show("Product added your cart!")
                productCount = oModel.getProperty("/productCount");
            })


        },
        showCart: function() {
            this.getOwnerComponent().getRouter().navTo("cart", {}, true);
            location.reload()
        },
        routelogin: function() {

            this.getOwnerComponent().getRouter().navTo("acount", {}, true);


        }
    })
});