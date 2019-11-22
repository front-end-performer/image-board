const express = require('express');
const app = express();
const db = require('./sql/db');
const s3 = require('./s3');
const { s3Url } = require('./config');

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static('./public'));
app.use(express.static('./sql'));
app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.get('/images', (req, res) => {
    db.selectImages().then(result => {
        res.json(result.rows);
    }).catch(error => {
        console.log(error);
    });
});

app.get('/moreImages', (req, res) => {
    let { id } = req.query;
    db.addMoreImages(id).then(result => {
        res.json(result.rows);
    });
});

app.get('/modal', (req, res) => {
    let { id } = req.query;
    db.getImage(id).then(result => {
        res.json(result.rows[0]);
    }).catch(error => {
        console.log(error);
    });
});

app.get('/comments', (req, res) => {
    let { id } = req.query;
    db.getComments(id).then(result => {
        res.json(result.rows);
    });
});

app.post('/comments', (req, res) => {
    let { comment, username, image_id } = req.body;
    db.addComments(comment, username, image_id).then(result => {
        res.json(result.rows);
    }).catch(error => {
        console.log(error);
    });
});

app.post('/upload', uploader.single('image'), s3.upload, (req, res) => {
    const { username, title, description } = req.body;
    const url = `${s3Url}${req.file.filename}`;
    db.addImage(url, username, title, description).then(({ rows }) => {
        let id = rows[0].id;
        res.json({
            url, username, title, description, id
        });
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    });
});

app.post('/delete/:id', (req, res) => {
    let { id } = req.params; 
    db.deleteImage(id).then((result) => {
        db.selectImages().then(result => {
            res.json(result.rows);
        });
    }).catch(error => {
        console.log(error);

    });

    app.post('/comments/:id', (req, res) => {
        let { id } = req.params;
        db.deleteComments(id);
    });
});

app.listen(8080, () => console.log('imageBoard listening...'));