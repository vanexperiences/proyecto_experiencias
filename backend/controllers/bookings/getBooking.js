const getDB = require('../../bbdd/db');

const getBooking = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idBooking } = req.params;
        const { idUser } = req.userAuth;
        if (req.userAuth.idUser !== Number(idUser)) {
            const error = new Error('No tienes permisos para ver esta reserva');
            error.httpStatus = 403;
            throw error;
        }

        const [booking] = await connection.query(
            `SELECT *
             FROM bookings
             WHERE id = ?;
            `,
            [idBooking]
        );

        res.send({
            status: 200,
            data: {
                ...booking[0],
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getBooking;
