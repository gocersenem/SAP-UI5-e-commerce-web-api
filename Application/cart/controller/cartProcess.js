let db = openDatabase("accountsDb", "1.0", "accountsDB", 2 * 1024 * 1024);

function getTable() {
    db.transaction(function(a) {
        a.executeSql("CREATE TABLE IF NOT EXISTS Cartitems (productid unique ,productnumber NUMERIC)", [], result => {});
    });

}

function dropCart() {
    db.transaction(function(a) {
        a.executeSql("DROP TABLE Cartitems");
    });
}

function readCart() {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            var items = [];
            e.executeSql("select * from Cartitems ", [], (e, result) => {
                for (var i = 0; i < result.rows.length; i++) {
                    var e = {
                        id: result.rows.item(i).productid,
                        count: parseInt(result.rows.item(i).productnumber)
                    }
                    items.push(e);
                }
                resolve(items);
            }, function() {
                reject(console.error("data okunurken hata oluştu"));
            })
        })
    })
}

function updateCart(count, id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("UPDATE Cartitems SET (productnumber)=(?) WHERE (productid) =(?)", [parseInt(count), id], (e, result) => {
                resolve("başarılı")
            }, () => {
                reject("başarısız")
            });
        });
    });
}

function addToCart(id, productCount) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("INSERT INTO Cartitems (productid, productnumber) VALUES (?,?)", [id, productCount], (e, result) => {
                resolve("başarılı")
            }, () => {
                reject("başarısız")
            });
        });
    });
}

function delToCart(id) {
    return new Promise(function(resolve, reject) {
        db.transaction(function(e) {
            e.executeSql("DELETE FROM Cartitems WHERE (productid) = (?)", [id], (e, result) => {
                resolve("başarılı")
            }, () => {
                reject("başarısız")
            });
        });
    });
}

function getToCart(id) {
    return new Promise(function(resolve, reject) {
        var product = {};
        db.transaction(function(e) {
            e.executeSql("select * FROM Cartitems WHERE (productid) = (?)", [id], (e, result) => {
                product = {
                    id: result.rows.item(0).productid,
                    count: result.rows.item(0).productnumber
                }
                resolve(product)
            }, () => {
                reject("başarısız")
            });
        });
    });
}