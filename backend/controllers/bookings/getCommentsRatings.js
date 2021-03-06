const getDB = require('../../bbdd/db');
const { PUBLIC_HOST, UPLOADS } = process.env;

const getCommentsRatings = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idExp } = req.params;
        const [booking] = await connection.query(
            `SELECT comentario , valoracion , e.id , u.id , u.username , u.avatar, fecha_compra FROM bookings b
            inner join experiences e  ON b.id_experience = e.id 
            inner join users u ON b.id_user = u.id 
            where e.id=?;         
            `,
            [idExp]
        );

        const includesAvatar = booking.map((appreciationObject) => {
            return {
                comentario: appreciationObject.comentario,
                valoracion: appreciationObject.valoracion,
                id: appreciationObject.id,
                username: appreciationObject.username,
                avatar:
                    appreciationObject.avatar !== null
                        ? `${PUBLIC_HOST}${UPLOADS}${appreciationObject.avatar}`
                        : null,
                fecha_compra: appreciationObject.fecha_compra,
            };
        });

        res.send({
            status: 200,
            data: {
                appreciations_comments: includesAvatar,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getCommentsRatings;
