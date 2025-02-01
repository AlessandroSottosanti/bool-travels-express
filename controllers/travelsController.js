import connection from "../data/dbConnection.js";

const index = (req, res, next) => {
    let sql = "SELECT * FROM `Viaggi` ";
    const filters = req.query;

    console.log(filters);

   

    connection.query(sql, (err, results) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(200).json({
                status: "success",
                data: results,
            });
        }
    });


};


export default {index};