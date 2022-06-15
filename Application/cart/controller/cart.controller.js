sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'com/UI5Starter/Application/database/database',
    'com/UI5Starter/Application/cart/controller/cartProcess'
], function(BaseController, database, cartProcess) {
    'use strict';
    var shopproducts = [];
    var value;
    var total = 0;
    var carttotal = 0;
    return BaseController.extend("com.UI5Starter.Application.cart.controller.cart", {
        onInit: function() {
            oModel.setProperty("/cartTotal", carttotal)
            readCart().then(allitems => {
                shopproducts.length = 0
                allitems.forEach(item => {
                    getProduct(item.id).then(product => {
                        var p = { id: product.id, name: product.name, stock: product.stock, price: product.price, categoryid: product.categoryid, image: product.image, authorid: product.authorid, number: item.count }
                        shopproducts.push(p);
                        oModel.setProperty("/shopproducts", shopproducts);
                        this.getTotal(item.count, product.price)
                        if (carttotal != 0) {
                            this.getView().byId("emptycart").setVisible(false);
                            this.getView().byId("table").setVisible(true);
                        }
                    });

                });
            });

            if (shopproducts.length == 0) {
                this.getView().byId("emptycart").setVisible(true);
                this.getView().byId("table").setVisible(false);
            }
        },
        getTotal: function(v, p) {
            total = 0;
            for (let i = 0; i < Number(v); i++) {
                total += Number(p);
            }
            carttotal += total
            oModel.setProperty("/cartTotal", carttotal)
        },
        onChange: function(oEvent) {
            var item = oEvent.getSource().getParent().getBindingContext().getObject();
            value = Number(oEvent.getParameter("value"))
            if (value == 0) {
                this.deleteshopproduct(oEvent);
            }
            this.getTotal(value, item.price)
            updateCart(Number(value), item.id).then(res => {
                carttotal = 0;
                for (let i = 0; i < shopproducts.length; i++) {
                    this.getTotal(shopproducts[i].number, shopproducts[i].price)
                }
                oModel.setProperty("/cartTotal", carttotal)
            });
        },
        home: function() {
            this.getOwnerComponent().getRouter().navTo("Dashboard");
        },

        deleteshopproduct: function(oEvent) {
            var sPath = oEvent.getSource().getBindingContext().getPath();
            var item = oEvent.getSource().getParent().getBindingContext().getObject();
            var index = sPath.slice(14);
            shopproducts.splice(index, 1);
            oModel.setProperty("/shopproducuts", shopproducts)
            delToCart(item.id).then(res => {})
            if (shopproducts.length == 0) {
                carttotal = 0;
                oModel.setProperty("/cartTotal", carttotal)
            } else {
                carttotal = 0;
                for (let i = 0; i < shopproducts.length; i++) {
                    this.getTotal(shopproducts[i].number, shopproducts[i].price)
                }
                oModel.setProperty("/cartTotal", carttotal)
            }
        },
        buyButton: function() {
            // purchased
            var oDefaultDialog = new sap.m.Dialog({
                title: "Your Order",
                content: [
                    new sap.m.Table("purchased", {
                        columns: [
                            new sap.m.Column({
                                header: [
                                    new sap.m.Label({
                                        text: "Name"
                                    })
                                ]
                            }), new sap.m.Column({
                                header: [
                                    new sap.m.Label({
                                        text: "Quantity"
                                    })
                                ]
                            }), new sap.m.Column({
                                header: [
                                    new sap.m.Label({
                                        text: "Price per Piece"
                                    })
                                ]
                            }), new sap.m.Column({
                                header: [
                                    new sap.m.Label({ text: "Image" })
                                ]
                            })
                        ],
                        items: "{/shopproducts}",
                        items: []
                    })
                ],
                beginButton: new sap.m.Button({
                    text: "BUY",
                    press: function() {
                        shopproducts.forEach(p => {
                            getProduct(p.id).then(t => {
                                t = { id: p.id, name: t.name, authorid: t.authorid, categoryid: t.categoryid, price: t.price, stock: Number(t.stock) - Number(p.number), image: t.image }
                                updateProduct(t).then(r => {})
                            });
                            getAuthor(p.authorid).then(t => {
                                var author = {
                                    name: t.name,
                                    stock: Number(t.stock) - Number(p.number),
                                    id: p.authorid
                                };
                                updateAuthor(author).then(d => {

                                })
                            })
                            getCategory(Number(p.categoryid)).then(t => {
                                var category = {
                                    name: t.name,
                                    stock: Number(t.stock) - Number(p.number),
                                    id: p.categoryid
                                };
                                updateCategory(category).then(d => {})
                            });
                        });
                        sap.m.MessageToast.show("Your order has been placed!")
                        shopproducts.length = 0;
                        this.getView().getModel().setProperty("/shopproducts", shopproducts)
                        dropCart()
                        this.getView().byId("emptycart").setVisible(true);
                        this.getView().byId("table").setVisible(false);
                        oDefaultDialog.close();
                    }.bind(this)
                }),
                endButton: new sap.m.Button({
                    text: "Close",
                    press: function() {
                        oDefaultDialog.close();
                    }.bind(this)
                }),
                afterClose: function() {
                    oDefaultDialog.destroy();
                }
            });
            sap.ui.getCore().byId('purchased').bindItems("/shopproducts", new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({
                        text: "{name}"
                    }),
                    new sap.m.Text({
                        text: "{number}"
                    }), new sap.m.Text({
                        text: "{price} $"
                    }),
                    new sap.m.Image({ src: "{image}", width: "7rem" })
                ]
            }));
            this.getView().addDependent(oDefaultDialog);
            oDefaultDialog.open();
        }

    })
});