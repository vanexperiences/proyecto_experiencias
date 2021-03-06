const getDB = require('../../bbdd/db');

const { formatDate, validate } = require('../../helpers');
const { newSchemaResetPassword } = require('../../validations/newSchemaResetPassword');

const resetUserPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        await validate(newSchemaResetPassword, req.body);

        const { recoverCode, newPassword } = req.body;

        if (!recoverCode) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT id FROM users WHERE recoverCode = ?;`,
            [recoverCode]
        );

        if (user.length < 1) {
            const error = new Error(
                'Código de recuperación incorrecto , intentalo de nuevo'
            );
            error.httpStatus = 404;
            throw error;
        }

        await connection.query(
            `UPDATE users SET pwd = SHA2(?, 512), recoverCode = NULL, modifiedAt = ? WHERE id = ?;`,
            [newPassword, formatDate(new Date()), user[0].id]
        );

        res.send({
            status: 200,
            message: 'Contraseña actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = resetUserPassword;
