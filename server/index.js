const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');
const {response} = require("express");

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'game_store_db',
    multipleStatements: true
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.get('/customers', (req, res) => {
    const sql = "SELECT * FROM `user` INNER JOIN customer ON user.id = customer.id";
    db.query(sql, (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    });
});

app.get('/customers/:customerId', (req, res) => {
    const sql = "select * from user inner join customer on user.id = customer.id where user.id = ?";
    db.query(sql, [req.params.customerId], (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    });
});

app.get('/customers/email/:email', (req, res) => {
    const sql = "select * from user inner join customer on user.id = customer.id where email = ?";
    db.query(sql, [req.params.email], (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    });
});

app.put('/customers', (req, res) => {
    const sql = `
        insert into user (name, email, password) values (?, ?, ?);
        insert into customer (id) values (last_insert_id());
    `
    db.query(sql, [req.body.name, req.body.email, req.body.password], (err, response) => {
        res.send(err);
        res.end();
    })
});

app.post('/customers/:customerId', (req, res) => {
    const sql = "update user set name = ?, email = ?, password = ? where id = ?;";
    db.query(sql, [req.body.name, req.body.email, req.body.password, req.params.customerId], (err, response) => {
        res.end();
    });
});

app.post('/customer_data/:customerId', (req, res) => {
    const sql = "update user set name = ?, email = ? where id = ?;";
    db.query(sql, [req.body.name, req.body.email, req.params.customerId], (err, response) => {
        res.send(err);
        res.end();
    });
});

app.post('/update_password/:customerId', (req, res) => {
    const sql = "update user set password = ? where id = ?;";
    db.query(sql, [req.body.password, req.params.customerId], (err, response) => {
        res.send(err);
        res.end();
    });
});

app.delete('/customers/:customerId', (req, res) => {
    const sql = `
        delete from purchase where buyer_id = ?;

        delete \`key\` from \`key\`
        join offer on \`key\`.offer_id = offer.id
        where offer.seller_id = ?;
               
        delete from offer where offer.seller_id = ?;
               
        delete from customer where id = ?;
        delete from user where id = ?;
    `
    db.query(sql, [req.params.customerId, req.params.customerId, req.params.customerId, req.params.customerId, req.params.customerId], (err, response) => {
        res.end();
    });
});

app.get('/offers', (req, res) => {
    const sql = `
        SELECT offer.id, user.id as 'seller_id', user.\`name\` AS 'seller', offer.title, offer.price_usd, offer.discount,
               COUNT(\`key\`.code) AS 'key_count', count(case when purchase.\`key\` is null then \`key\`.code end) AS 'available_keys', image_url FROM offer 
        INNER JOIN \`user\` ON offer.seller_id = \`user\`.id 
        LEFT JOIN \`key\` ON offer.id = \`key\`.offer_id 
        LEFT JOIN purchase ON \`key\`.code = purchase.\`key\` 
        GROUP BY offer.id 
        ORDER BY offer.id;
    `
    db.query(sql, (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    });
});

app.get('/offers/:offerId', (req, res) => {
    const sql = `
        SELECT offer.id, offer.title, \`user\`.id AS 'seller_id', \`user\`.name AS 'seller', \`user\`.email AS 'seller_email', offer.developer, 
                offer.publisher, DATE_FORMAT(offer.release_date, '%Y-%m-%d') as 'release_date', offer.price_usd, offer.discount, 
                count(case when purchase.\`key\` is null then \`key\`.code end) AS 'available_keys', offer.image_url FROM offer 
        INNER JOIN \`user\` ON offer.seller_id = \`user\`.id 
        LEFT JOIN \`key\` ON offer.id = \`key\`.offer_id 
        LEFT JOIN purchase ON \`key\`.code = purchase.\`key\` 
        WHERE offer.id = ?;
    `
    db.query(sql, [req.params.offerId], (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    })
});

app.get('/offers/:offerId/:userId', (req, res) => {
    const sql = `
        SELECT offer.id, offer.title, \`user\`.id AS 'seller_id', \`user\`.name AS 'seller', \`user\`.email AS 'seller_email', offer.developer, 
        offer.publisher, DATE_FORMAT(offer.release_date, '%Y-%m-%d') as 'release_date', offer.price_usd, offer.discount, count(case when purchase.\`key\` is null then \`key\`.code end) AS 'available_keys', offer.image_url FROM offer 
        INNER JOIN \`user\` ON offer.seller_id = \`user\`.id 
        LEFT JOIN \`key\` ON offer.id = \`key\`.offer_id 
        LEFT JOIN purchase ON \`key\`.code = purchase.\`key\` 
        WHERE offer.id = ? AND user.id = ?;
    `
    db.query(sql, [req.params.offerId, req.params.userId], (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    })
});

app.put('/offers', (req, res) => {
    const sql = `
        insert into offer (seller_id, title, developer, publisher, release_date, price_usd, discount, image_url) 
        values (?, ?, ?, ?, ?, ?, ?, ?);
    `
    db.query(sql, [req.body.seller_id, req.body.title, req.body.developer, req.body.publisher, req.body.release_date, req.body.price_usd, req.body.discount, req.body.image_url], (err, response) => {
        if (err)
            console.log(err)
        res.send(response);
        res.end();
    })
});

app.post('/offers/:offerId', (req, res) => {
    const sql = "update offer set seller_id=?, title=?, developer=?, publisher=?, release_date=?, price_usd=?, discount=?, image_url=? where id=?;";
    db.query(sql, [req.body.seller_id, req.body.title, req.body.developer, req.body.publisher, req.body.release_date, req.body.price_usd, req.body.discount, req.body.image_url, req.body.id], (err, response) => {
        res.send(err);
        res.end();
    });
});

app.delete('/offers/:offerId', (req, res) => {
    const sql = `
        DELETE FROM purchase WHERE \`key\` IN (SELECT \`code\` FROM \`key\` WHERE offer_id = ?);
        DELETE FROM \`key\` WHERE offer_id = ?; 
        DELETE FROM offer WHERE id = ?;
    `
    db.query(sql, [req.params.offerId, req.params.offerId, req.params.offerId], (err, response) => {
        res.send(err);
        res.end();
    })
});

app.get('/user_offers/:seller_id', (req, res) => {
    const sql = "select id, title, price_usd, discount from offer where seller_id = ?;";
    db.query(sql, [req.params.seller_id], (err, response) => {
        if (err)
            console.log(err)
        res.send(response);
        res.end();
    });
})

app.get('/available_keys/:offerId', (req, res) => {
    const sql = "select `key`.code from `key` left join purchase on `key`.code = purchase.`key` where purchase.`key` is null and offer_id = ?;";
    db.query(sql, [req.params.offerId], (err, response) => {
        if (err)
            console.log(err)
        res.send(response);
        res.end();
    });
});

app.get('/keys', (req, res) => {
    const sql = "select code from `key`;"
    db.query(sql, (err, response) => {
        if (err)
            console.log(err)
        res.send(response);
        res.end();
    });
});

app.get('/available_keys', (req, res) => {
    const sql = `select code from \`key\` left join purchase on \`key\`.code = purchase.\`key\` where purchase.id is null;`
    db.query(sql, (err, response) => {
        if (err)
            console.log(err)
        res.send(response);
        res.end();
    });
});

app.get('/keys/:offerId', (req, res) => {
    const sql = "select `code`, if(EXISTS(select * from purchase where purchase.`key` = `key`.code), true, false) as 'sold' from `key` where offer_id = ?;"
    db.query(sql, [req.params.offerId], (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    });
});

app.put('/keys', (req, res) => {
    const sql = 'insert into `key` (code, offer_id) values (?, ?);'
    db.query(sql, [req.body.code, req.body.offerId], (err, response) => {
        res.send(err);
        res.end();
    })
})

app.put('/keys/:offerId', (req, res) => {
    const sql = 'insert into `key` (code, offer_id) values ?;'
    db.query(sql, [req.body.keys], (err, response) => {
        res.send(err);
        res.end();
    })
})

app.delete('/keys/:keyCode', (req, res) => {
    const sql = 'delete from `key` where code = ?';
    db.query(sql, [req.params.keyCode], (err, response) => {
        res.send(err);
        res.end();
    })
})

app.get('/key/:keyCode', (req, res) => {
    const sql = "select `code`, offer_id, if(EXISTS(select * from purchase where purchase.`key` = `key`.code), true, false) as 'sold' from `key` where `key`.code = ?;"
    db.query(sql, [req.params.keyCode], (err, response) => {
        if (err)
            console.log(err)

        res.send(response);
        res.end();
    });
});

app.get('/employees/:email', (req, res) => {
    const sql = "select user.name, employee.surname, email, password from user inner join employee on user.id = employee.id where email = ?";
    db.query(sql, [req.params.email], (err, response) => {
        res.send(response);
        res.end();
    });
});

app.get('/employees', (req, res) => {
    const sql = "select user.*, employee.surname as 'surname' from user inner join employee on user.id = employee.id";
    db.query(sql, (err, response) => {
        res.send(response);
        res.end();
    });
});

app.get('/purchases', (req, res) => {
    const sql = `
        select purchase.*, buyer.name as 'buyer', seller.id as 'seller_id', 
                seller.name as 'seller', offer.title, date_format(purchase_time, '%Y-%m-%d') as 'date', date_format(purchase_time, '%H:%i:%S') as 'time'  
        from purchase 
        join user buyer on purchase.buyer_id = buyer.id 
        join \`key\` on purchase.\`key\` = \`key\`.code 
        join offer on \`key\`.offer_id = offer.id 
        join user seller on offer.seller_id = seller.id;
    `
    db.query(sql, (err, response) => {
        if (err)
            throw err
        res.send(response);
        res.end();
    });
});

app.get('/purchases/:purchaseId', (req, res) => {
    const sql = `
        select purchase.*, date_format(purchase_time, '%Y-%m-%d') as 'date', date_format(purchase_time, '%H:%i:%S') as 'time', 
                buyer.name as 'buyer', seller.id as 'seller_id' , seller.name as 'seller', offer.id as 'offer_id', offer.title
        from purchase
        join user buyer on purchase.buyer_id = buyer.id
        join \`key\` on purchase.\`key\` = \`key\`.code
        join offer on \`key\`.offer_id = offer.id
        join user seller on offer.seller_id = seller.id
        where purchase.id = ?;
    `
    db.query(sql, [req.params.purchaseId], (err, response) => {
        if (err)
            throw err
        res.send(response);
        res.end();
    });
});

app.get('/user_purchases/:buyerId', (req, res) => {
    const sql = `
        select offer.id as 'offer_id', offer.title, purchase.*, date_format(purchase_time, '%Y-%m-%d') as 'date', 
                date_format(purchase_time, '%H:%i:%S') as 'time'
        from purchase 
        join \`key\` on purchase.\`key\` = \`key\`.code 
        join offer on \`key\`.offer_id = offer.id 
        where buyer_id = ?;
    `
    db.query(sql, [req.params.buyerId], (err, response) => {
        if (err)
            console.log(err)
        res.send(response);
        res.end();
    });
})

app.delete('/purchases/:purchaseId', (req, res) => {
    const sql = `delete from purchase where id = ?;`
    db.query(sql, [req.params.purchaseId], (err, response) => {
        res.send(err);
        res.end();
    });
});

app.put('/purchases', (req, res) => {
    const sql = `insert into purchase (\`key\`, buyer_id, purchase_time, purchase_price) values (?, ?, ?, ?)`
    const purchaseTime = req.body.date + " " + req.body.time;
    db.query(sql, [req.body.key, req.body.buyer_id, purchaseTime, req.body.purchase_price], (err, response) => {
        res.send(err);
        res.end();
    })
});

app.post('/purchases/:purchaseId', (req, res) => {
    const sql = 'update purchase set `key` = ?, buyer_id = ?, purchase_time = ?, purchase_price = ? where id = ?'
    const purchaseTime = req.body.date + " " + req.body.time;
    db.query(sql, [req.body.key, req.body.buyer_id, purchaseTime, req.body.purchase_price, req.params.purchaseId], (err, response) => {
        res.send(err);
        res.end();
    })
});

app.put('/init', (req, res) => {
    const sql = fs.readFileSync('init.sql').toString();
    db.query(sql, (err, response) => {
        if (err) {
            res.end(err.message);
        }
        else
            res.end('database initialised');
    });
});

const port = 3001;
app.listen(port, () => {
    console.log("listening on port " + port);
});