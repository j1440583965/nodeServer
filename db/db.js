var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
});



function querySql(str, cb, errcb) {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query(str, function(error, results, fields) {
            // When done with the connection, release it.
            connection.release();

            // Handle error after the release.
            if (error) {
                errcb(error)

            } else {
                cb(results)

            };

            // Don't use the connection here, it has been returned to the pool.
        });
    });
}



module.exports = querySql