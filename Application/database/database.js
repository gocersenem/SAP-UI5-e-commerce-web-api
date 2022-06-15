let db = openDatabase("accountsDb", "1.0", "accountsDB", 2 * 1024 * 1024);

db.transaction(function(a) {
    // a.executeSql("drop table Products")
    a.executeSql("CREATE TABLE IF NOT EXISTS Products (id ,name,authorid,categoryid , price NUMERIC, stock NUMERIC , image )", [], result => {});
});
db.transaction(function(a) {
    // a.executeSql("drop table Categories")
    a.executeSql("CREATE TABLE IF NOT EXISTS Categories (categoryid unique,name ,stock NUMERIC)", [], result => {});
});
db.transaction(function(a) {
    // a.executeSql("drop table Authors")
    a.executeSql("CREATE TABLE IF NOT EXISTS Authors (authorid unique,name,stock NUMERIC)", [], result => {});

});

function readProducts() {
    return new Promise((resolve, reject) => {
        db.transaction((e) => {

            e.executeSql("select * from Products ", [], (e, result) => {
                var products = [];
                for (var i = 0; i < result.rows.length; i++) {
                    var e = {
                        id: result.rows.item(i).id,
                        name: result.rows.item(i).name,
                        price: result.rows.item(i).price,
                        stock: result.rows.item(i).stock,
                        image: result.rows.item(i).image,
                        authorid: result.rows.item(i).authorid,
                        categoryid: result.rows.item(i).categoryid,
                    }
                    products.push(e);
                }
                resolve(products);
            }, function() {
                reject(console.error("data okunurken hata oluştu"));
            })
        })

    })

}

function readCategories() {
    return new Promise((resolve, reject) => {
        db.transaction((e) => {
            e.executeSql("select * from Categories ", [], (e, result) => {
                var categories = [];
                for (var i = 0; i < result.rows.length; i++) {
                    var e = {
                        id: result.rows.item(i).categoryid,
                        name: result.rows.item(i).name,
                        stock: result.rows.item(i).stock,
                    }
                    categories.push(e);
                }
                resolve(categories);
            }, function() {
                reject(console.error("data okunurken hata oluştu"));
            })
        })
    })
}

function getCategoryBooks(id) {
    return new Promise((resolve, reject) => {
        db.transaction((e) => {
            e.executeSql("select * from Products where categoryid=?", [id], (e, result) => {
                resolve(result);
            }, function() {
                reject(console.error("data okunurken hata oluştu"));
            })
        })
    })
}

function readAuthors() {
    return new Promise((resolve, reject) => {
        db.transaction((e) => {

            e.executeSql("select * from Authors ", [], (e, result) => {
                var authors = [];
                for (var i = 0; i < result.rows.length; i++) {
                    var e = {
                        id: result.rows.item(i).authorid,
                        name: result.rows.item(i).name,
                        stock: result.rows.item(i).stock,
                    }
                    authors.push(e);
                }
                resolve(authors);
            }, function() {
                reject(console.error("data okunurken hata oluştu"));
            })
        })
    })
}

function addAuthor(author) {
    return new Promise((resolve, reject) => {
        db.transaction(function(e) {
            e.executeSql("Insert into Authors (authorid,name,stock) values (?,?,?)", [author.id, author.name, author.stock], (e) => {
                resolve("başarılı")
            }, () => {
                reject("başarısız")
            })
        })
    })
}

function addProduct(product) {
    return new Promise((resolve, reject) => {
        db.transaction(function(e) {
            e.executeSql("Insert into Products (id,name,authorid,categoryid,price,stock,image ) values (?,?,?,?,?,?,?)", [product.id, product.name, product.authorid, product.categoryid, product.price, product.stock, product.image], (e) => {
                resolve("başarılı")

            }, () => {
                reject("başarısız")
            })

        })
    })
}



function deleteProduct(id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("DELETE FROM Products WHERE id=?", [id], function(e, result) {
                resolve(result);
            }, function() {
                reject(console.log("Error Delete"))
            })
        })
    })
}

function deleteAuthor(id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("DELETE FROM Authors WHERE authorid=?", [id], function(e, result) {
                resolve(result);
            }, function() {
                reject(console.error("Error Delete"))
            })
        })
    })
}

function deleteCategory(id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("DELETE FROM Categories WHERE categoryid=?", [id], function(e, result) {
                resolve(result);
            }, function() {
                reject(console.error("Error Delete"))
            })
        })
    })
}

function updateProduct(product) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("UPDATE Products SET name =?, authorid =?, categoryid =?, price =?, stock=?, image=? WHERE id =?", [product.name, product.authorid, product.categoryid, product.price, product.stock, product.image, product.id], function(e, result) {
                resolve(result);
            }, function() {
                reject("başarısız")
            })
        })
    })
}

function updateCategory(category) {
    //bak 
    var stock = category.stock;
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("UPDATE Categories SET name =? ,stock=? WHERE categoryid =?", [category.name, stock, Number(category.id)], function(e, result) {
                resolve(result);
            }, function() {
                reject("başarısız")
            })
        })
    })


}

function updateAuthor(author) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("UPDATE Authors SET name =?,stock=? WHERE authorid =?", [author.name, author.stock, Number(author.id)], function(e, result) {
                resolve(result);
            }, function() {
                reject("başarısız")
            })
        })
    })
}


function getProduct(id) {
    var product;
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("select * from Products where id= (?)", [id], (e, result) => {
                product = result.rows.item(0);
                resolve(product);
            }, () => {
                reject(console.error("hata"))
            })
        })
    })
}

function getCategory(id) {
    var category
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("SELECT * FROM Categories WHERE categoryid=?", [Number(id)], function(e, result) {
                category = {
                    name: result.rows.item(0).name,
                    id: result.rows.item(0).categoryid,
                    stock: result.rows.item(0).stock,

                }
                resolve(category);
            }, function() {
                reject(console.error("Somethings wrong!"))
            })
        })
    })
}


function getAuthor(id) {
    var author;
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("SELECT * FROM Authors where authorid = (?)", [Number(id)], (e, result) => {
                author = {
                    name: result.rows.item(0).name,
                    stock: result.rows.item(0).stock,
                    id: result.rows.item(0).authorid
                };
                resolve(author);
            }, () => {
                reject(console.error("hata"))
            })
        })
    })
}

function addCategory(category) {
    return new Promise((resolve, reject) => {
        db.transaction(function(e) {
            e.executeSql("insert into Categories (categoryid,name,stock) values (?,?,?)", [category.id, category.name, category.stock], (e) => {
                resolve("başarılı")

            }, () => {
                reject("başarısız")
            })

        })
    })

}