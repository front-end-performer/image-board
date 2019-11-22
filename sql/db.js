const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/imageBoard");

module.exports.selectImages = () => {
    return db.query(
        `SELECT * FROM images 
        ORDER BY id DESC
        LIMIT 3`
    );
};

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images(url, username, title, description)
        VALUES($1, $2, $3, $4)
        RETURNING id`,
        [url, username, title, description]
    );
};

module.exports.getImage = (id) => {
    return db.query(
        `SELECT * FROM images WHERE id = $1`,
        [id]
    ).catch(error => {
        console.log(error);
    });
};

module.exports.addComments = (comment, username, image_id) => {
    return db.query(
        `INSERT INTO comments(comment, username, image_id)
        VALUES($1, $2, $3)
        RETURNING *`,
        [comment, username, image_id]
    ).catch(error => {
        console.log(error);
    });
};

module.exports.getComments = (image_id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1`,
        [image_id]
    ).catch(error => {
        console.log(error);
    });
};

module.exports.addMoreImages = (lowest_id) => {    
    return db.query(
        `SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS lowest_id FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
        [lowest_id]
    );
};

module.exports.deleteImage = (id) => {
    return db.query(
        `DELETE FROM images CASCADE WHERE id = $1`,
        [id]
    );
};

module.exports.deleteComments = (id) => {
    return db.query(
        `DELETE FROM comments CASCADE WHERE image_id = $1`,
        [id]
    );
};
