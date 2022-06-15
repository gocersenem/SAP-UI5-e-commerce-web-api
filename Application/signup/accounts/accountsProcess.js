let db = openDatabase("accountsDb", "1.0", "accountsDB", 2 * 1024 * 1024);

db.transaction(function(a) {
    a.executeSql("CREATE TABLE IF NOT EXISTS Accounts (email unique, name,password )", [], result => {});

});
db.transaction(function(a) {
    a.executeSql("CREATE TABLE IF NOT EXISTS Admins (username,password )", [], result => {});

});

function addAdmin() {
    return new Promise((resolve, reject) => {
        db.transaction(function(e) {
            e.executeSql("Insert into Admins (username,password ) values (?,?)", ["admin01", "2555"], (e, result) => {
                resolve("başarılı")

            }, () => {
                reject("başarısız")
            })

        })
    })
}

function addUser(user) {
    return new Promise((resolve, reject) => {
        db.transaction(function(e) {
            e.executeSql("Insert into Accounts (email,name,password ) values (?,?,?)", [user.email, user.name, user.password], (e, result) => {
                resolve("başarılı")

            }, () => {
                reject("başarısız")
            })

        })
    })
}

function adminSearch(user) {
    var account = {};
    return new Promise((resolve, reject) => {

        db.transaction(function(e) {

            e.executeSql("Select * from Admins WHERE (username) =? ", [user.username], (e, result) => {
                    debugger
                    if (result.rows.length === 0) {
                        resolve({ access: false, re: "kullanıcı bulunamadı" })
                    } else {
                        if (user.password !== result.rows.item(0).password) {
                            resolve({ access: false, re: "Şifre hatalı" })
                        } else {
                            var username = result.rows.item(0).username;
                            var name = result.rows.item(0).name;
                            var password = result.rows.item(0).password; // account = result.rows.item;
                            account = { name: name, username: username, password: password }
                            resolve({ access: true, re: account })
                        }
                    }

                },
                function() {
                    reject(console.error("hata oluştu "))


                })

        })
    })
}

function search(user) {
    var account = {};
    return new Promise((resolve, reject) => {

        db.transaction(function(e) {
            e.executeSql("Select * from Accounts WHERE (email) =? ", [user.email], (e, result) => {
                    console.log(result.rows)
                    if (result.rows.lenght == 0) {
                        resolve("kullanıcı bulunamadı")
                    } else if (user.password != result.rows.item(0).password) {
                        resolve("şifre hatalı")
                    } else {
                        var email = result.rows.item(0).email;
                        var name = result.rows.item(0).name;
                        var password = result.rows.item(0).password; // account = result.rows.item;
                        account = { name: name, email: email, password: password }
                            // user = { name = result.rows.item(0).name, email = result.rows.item(0).email, password = result.rows.item(0).password };
                            // console.log(res.rows.item(0))

                        resolve(account)
                    }

                },
                function() {
                    reject(console.error("hata oluştu "))


                })

        })
    })
}