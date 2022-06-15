sap.ui.define([
    'com/UI5Starter/Application/Base/BaseController',
    'com/UI5Starter/Application/database/database',
    'com/UI5Starter/Application/signup/accounts/accountsProcess',
    'sap/ui/core/Fragment'
], function(BaseController, database, accountsProcess, Fragment) {
    'use strict';
    var categories = [];
    var authors = [];
    var products = [];
    var image;
    var stock = 0; //stock eklenecek kategori ve yazara
    return BaseController.extend("com.UI5Starter.Application.admin.controller.admin", {
        onInit: function() {

            readAuthors().then(res => {
                res.forEach(aut => {
                    authors.push(aut);
                });
                oModel.setProperty("/authors", authors)
            });
            readCategories().then(res => {
                res.forEach(cat => {
                    categories.push(cat);
                });
                oModel.setProperty("/categories", categories)
            })
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
                            categoryname: categoryname,
                            authorname: authorname
                        });
                        oModel.setProperty("/products", products)
                    })
                });
            });
        },

        show: function() {
            this.getView().byId("adminPanel").setVisible(true);
            this.getView().byId("adminPanel3").setVisible(false);
            this.getView().byId("adminPanel2").setVisible(false);
            this.getView().byId("adminPanel4").setVisible(false);
        },
        onEditAuthor: function() {
            var tablo = this.getView().byId("AuthorsTable")
            var selected = tablo.getSelectedItem();
            var sPath = selected.getBindingContext().getPath();
            var item = this.getView().getModel().getProperty(sPath);
            var oDefaultDialog = new sap.m.Dialog({
                title: "Edit Author",
                content: [
                    new sap.m.Label({
                        text: 'Rename Author'
                    }),
                    new sap.m.Input({
                        value: '{/reAuthorName}'
                    }), new sap.m.Label({
                        text: 'Stock'
                    }),
                    new sap.m.Input({
                        value: '{/reAuthorStock}'
                    }), new sap.m.Button({
                        text: "Delete",
                        press: function() {
                            deleteAuthor(item.id).then(res => {
                                var index = sPath.slice(9);
                                authors.splice(index, 1);
                                oModel.setProperty("/authors", authors)
                                sap.m.MessageToast.show("Author deleted");
                                oDefaultDialog.close();
                            })
                        }
                    }),
                ],
                beginButton: new sap.m.Button({
                    text: "OK",
                    press: function() {
                        var index = sPath.slice(9);
                        var author = { id: item.id, name: this.getView().getModel().getProperty("/reAuthorName"), stock: this.getView().getModel().getProperty("/reAuthorStock") };
                        updateAuthor(author).then(res => {
                            authors.splice(index, 1, author)
                            oModel.setProperty("/authors", authors)
                            oDefaultDialog.close();
                        })
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
            this.getView().addDependent(oDefaultDialog);
            oModel.setProperty("/reAuthorName", item.name);
            oDefaultDialog.open();
        },
        onEdit: function() {
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "com.UI5Starter.Application.admin.view.edit",
                    controller: "com.UI5Starter.Application.admin.controller.edit"
                }).then((pDialog) => {
                    this.getView().addDependent(pDialog);
                    return pDialog
                })
            }
            var select = this.changeSelect();
            oModel.setProperty("/Name2", select.name)
            oModel.setProperty("/Stock", select.stock)
            oModel.setProperty("/Price", select.price)
            this.pDialog.then(function(pDialog) {
                pDialog.open();
            });
        },
        onSave: function() {
            var item = this.changeSelect();
            var tablo = this.getView().byId("ProductsTable")
            var selected = tablo.getSelectedItem();
            var sPath = selected.getBindingContext().getPath();
            var index = sPath.slice(10);
            var product = { id: item.id, name: oModel.getProperty("/Name2"), authorid: this.getView().byId("AuthorASelectList").getSelectedItem().getKey(), authorname: item.authorname, categoryname: item.categoryname, categoryid: this.getView().byId("CategoryASelectList").getSelectedItem().getKey(), price: parseInt(oModel.getProperty("/Price")), stock: parseInt(oModel.getProperty("/Stock")), image: item.image };
            updateProduct(product).then(res => {
                sap.m.MessageToast.show("Product updated!")
                products.splice(index, 1, product);
                oModel.setProperty("/products", products)
            })
            this.onCloseDialog();
        },
        onDelete: function() {
            var item = this.changeSelect();
            var tablo = this.getView().byId("ProductsTable")
            var selected = tablo.getSelectedItem();
            var sPath = selected.getBindingContext().getPath();
            var index = sPath.slice(10);
            deleteProduct(item.id).then(res => {
                getCategory(Number(item.categoryid)).then(t => {
                    var category = {
                        name: t.name,
                        stock: (Number(t.stock) - item.stock),
                        id: item.categoryid
                    };
                    updateCategory(category).then(d => {})

                });
                getAuthor(item.authorid).then(t => {
                    var author = {
                        name: t.name,
                        stock: (Number(t.stock) - item.stock),
                        id: item.authorid
                    };
                    updateAuthor(author).then(d => {
                        sap.m.MessageToast.show("Product Added!")
                        products.splice(index, 1);
                        oModel.setProperty("/products", products)
                    })
                })
                sap.m.MessageToast.show("Product deleted")
            })
            this.onCloseDialog()
        },
        changeSelect: function() {
            var tablo = this.getView().byId("ProductsTable");
            var selected = tablo.getSelectedItem();
            var sPath = selected.getBindingContext().getPath();
            var item = this.getView().getModel().getProperty(sPath);
            return item;
        },
        onCloseDialog: function() {
            this.pDialog.then(function(pDialog) {
                pDialog.close();
            });
        },
        addBook: function() {
            if (oModel.getProperty("/name") == null) {
                this.getView().byId("nameError").setVisible(true)
            }
            var product = { id: Math.floor(Math.random() * 100), name: oModel.getProperty("/name"), price: oModel.getProperty("/price"), stock: oModel.getProperty("/stock"), authorid: this.getView().byId("AuthorSelectList").getSelectedItem().getKey(), authorname: this.getView().byId("AuthorSelectList").getSelectedItem().getText(), categoryname: this.getView().byId("CategorySelectList").getSelectedItem().getText(), categoryid: this.getView().byId("CategorySelectList").getSelectedItem().getKey(), image: image }
            addProduct(product).then(res => {

                stock += Number(product.stock);
                getCategory(Number(product.categoryid)).then(t => {
                    var category = {
                        name: t.name,
                        stock: (Number(t.stock) + stock),
                        id: product.categoryid
                    };
                    updateCategory(category).then(d => {

                    })
                });
                getAuthor(product.authorid).then(t => {
                    var author = {
                        name: t.name,
                        stock: (Number(t.stock) + stock),
                        id: product.authorid
                    };
                    updateAuthor(author).then(d => {
                        sap.m.MessageToast.show("Product Added!")
                        products.push(product)
                        oModel.setProperty("/products", products)
                    })
                })
            })
        },
        onMsgStripClose: function(oEvent) {
            oEvent.getSource().setVisible(false);
        },
        downloadImage: function(oEvent) {
            const reader = new FileReader();
            reader.onload = function() {
                image = reader.result;
            };
            reader.readAsDataURL(oEvent.getParameter("files")[0]);
        },
        home: function() {
            this.getOwnerComponent().getRouter().navTo("Dashboard");
        },
        onEditCategory: function() {
            var tablo = this.getView().byId("CategoriesTable")
            var selected = tablo.getSelectedItem();
            var sPath = selected.getBindingContext().getPath();
            var item = this.getView().getModel().getProperty(sPath);
            var oDefaultDialog = new sap.m.Dialog({
                title: "Edit Category",
                content: [
                    new sap.m.Label({
                        text: 'Rename Category'
                    }),
                    new sap.m.Input({
                        value: '{/reCategoryName}'
                    }),
                    new sap.m.Label({
                        text: 'Stock'
                    }),
                    new sap.m.Input({
                        value: '{/reCategoryStock}'
                    }),
                    new sap.m.Button({
                        text: "Delete",
                        press: function() {
                            deleteCategory(item.id).then(res => {
                                var index = sPath.slice(12);
                                categories.splice(index, 1);
                                oModel.setProperty("/categories", categories)
                                oDefaultDialog.close();
                                sap.m.MessageToast.show("Category deleted")
                            })
                        }
                    })
                ],
                beginButton: new sap.m.Button({
                    text: "OK",
                    press: function() {
                        var index = sPath.slice(10);
                        var category = { id: item.id, name: this.getView().getModel().getProperty("/reCategoryName"), stock: this.getView().getModel().getProperty("/reCategoryStock") };
                        updateCategory(category).then(res => {
                            categories.splice(index, 1, category)
                            oModel.setProperty("/categories", categories)
                        })
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
            this.getView().addDependent(oDefaultDialog);
            oModel.setProperty("/reCategoryName", item.name);
            oDefaultDialog.open();
        },
        onSaveCategory: function() {},
        onCancelCategory: function() {},
        showCategory: function() {
            this.getView().byId("tables").setVisible(true)
            this.getView().byId("adminPanel3").setVisible(true);
            this.getView().byId("adminPanel2").setVisible(false);
            this.getView().byId("adminPanel4").setVisible(false);
        },
        showAuthor: function() {;
            this.getView().byId("tables").setVisible(true);
            this.getView().byId("adminPanel4").setVisible(true);
            this.getView().byId("adminPanel2").setVisible(false);
            this.getView().byId("adminPanel3").setVisible(false);
        },
        onAuthorDialogPress: function() {
            var oDefaultDialog = new sap.m.Dialog({
                title: "Book",
                content: [
                    new sap.m.Label({
                        text: 'Author Add'

                    }),
                    new sap.m.Input('authorInput', {
                        value: '{/authorname}'
                    })
                ],
                beginButton: new sap.m.Button({
                    text: "OK",
                    press: function() {
                        var newA = { name: sap.ui.getCore().getModel().getProperty("/authorname"), id: Math.floor(Math.random() * 100), stock: 0 };
                        addAuthor(newA).then(res => {
                            authors.push(newA);
                            oModel.setProperty("/authors", authors)
                            sap.m.MessageToast.show("Author added!")
                        })
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
            this.getView().addDependent(oDefaultDialog);
            oDefaultDialog.open();
        },
        showStock: function() {
            this.getView().byId("tables").setVisible(true);
            this.getView().byId("adminPanel2").setVisible(true);
            this.getView().byId("adminPanel3").setVisible(false);
            this.getView().byId("adminPanel4").setVisible(false);
        },
        onCategoryDialogPress: function() {
            var oDefaultDialog = new sap.m.Dialog({
                title: "Category",
                content: [
                    new sap.m.Label({
                        text: 'Category Add'
                    }),
                    new sap.m.Input('categoryInput', {
                        value: '{/categoryname}'
                    })
                ],
                beginButton: new sap.m.Button({

                    text: "OK",
                    press: function() {
                        var newC = { name: oModel.getProperty("/categoryname"), id: Math.floor(Math.random() * 100), stock: 0 };
                        addCategory(newC).then(res => {

                            categories.push(newC);
                            oModel.setProperty("/categories", categories)
                            sap.m.MessageToast.show("Category added!")
                        })
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
            this.getView().addDependent(oDefaultDialog);
            oDefaultDialog.open();
        },
        cancel: function() {
            this.getView().byId("tables").setVisible(false);
            this.getView().byId("adminPanel").setVisible(false);
        }
    })
});