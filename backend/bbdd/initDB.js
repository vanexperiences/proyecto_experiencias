'use strict';
require('dotenv').config();

const getDB = require('./db');

let connection;

const initDB = async () => {
    try {
        connection = await getDB();
        await connection.query('DROP DATABASE IF EXISTS VAN_Experience');
        await connection.query('CREATE DATABASE VAN_Experience;');
        await connection.query('USE VAN_Experience;');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        await connection.query('DROP TABLE IF EXISTS users;');
        await connection.query('DROP TABLE IF EXISTS experiences;');
        await connection.query('DROP TABLE IF EXISTS bookings;');
        await connection.query('DROP TABLE IF EXISTS photos;');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

        console.log('Tablas eliminadas');

        await connection.query(`
        CREATE TABLE IF NOT EXISTS users(
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(30) NOT NULL UNIQUE,
            pwd VARCHAR(200) NOT NULL,
            rol ENUM('regular', 'admin') NOT NULL,
            email VARCHAR(75) NOT NULL UNIQUE,
            dni VARCHAR(15) UNIQUE,
            ccc VARCHAR(40),
            direccion VARCHAR(50),
            telefono VARCHAR(20) UNIQUE ,
            bio TEXT,
            nombre VARCHAR(30) NOT NULL,
            apellidos VARCHAR(50) NOT NULL,
            cp VARCHAR(20),
            avatar VARCHAR(200),
            registrationCode VARCHAR(100),
            recoverCode VARCHAR(100),
            active BOOLEAN default 0,
            deleted BOOLEAN default 0,
            createdAt DATETIME,
            modifiedAt DATETIME

        );
        `);

        await connection.query(`
        CREATE TABLE IF NOT EXISTS experiences(
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            descripcion TEXT NOT NULL,
            nombre VARCHAR(150) NOT NULL,
            ciudad VARCHAR(50) NOT NULL,
            precio DECIMAL(5, 2) NOT NULL,
            categoria VARCHAR(25) NOT NULL,
            num_participantes INT NOT NULL,
            disp BOOLEAN DEFAULT 1 NOT NULL,
            fecha_inicio DATE NOT NULL,
            fecha_fin DATE NOT NULL,
            modifiedAt DATETIME
        );
        `);

        await connection.query(`
        CREATE TABLE IF NOT EXISTS bookings(
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            cantidad TINYINT NOT NULL,
            fecha_reserva DATE NOT NULL,
            fecha_compra DATETIME,
            precio_total DECIMAL(5, 2) NOT NULL,
            estado BOOLEAN DEFAULT 1 NOT NULL,
            valoracion TINYINT,
            comentario TEXT,
            id_user INT UNSIGNED,
                FOREIGN KEY (id_user) REFERENCES users (id),
            id_experience INT UNSIGNED,
                FOREIGN KEY (id_experience) REFERENCES experiences (id) ON DELETE CASCADE ON UPDATE CASCADE
        );
        `);

        await connection.query(`
        CREATE TABLE IF NOT EXISTS photos(
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            alt VARCHAR(100),
            url VARCHAR(200),
            id_experience INT UNSIGNED,
                FOREIGN KEY (id_experience) REFERENCES experiences (id) ON DELETE CASCADE ON UPDATE CASCADE 
        );
        `);

        console.log('Tablas creadas');

        await connection.query(`
        INSERT INTO users (id, username, pwd,rol, email,  ccc, direccion, telefono, bio, nombre, apellidos, cp, active) VALUES 
        (1, 'admin1', SHA2("${process.env.ADMIN_PASSWORD}", 512),'admin',  'alejandromf_199@hotmail.com',  'DE64 7032 9119 6174 2043 34', '71 Doe Crossing Avenue', '9213721676', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Usuario', 'Administrador', null, true),
        (2, 'admin2', SHA2("${process.env.ADMIN_PASSWORD}", 512),'admin',  'vaszm1996@gmail.com',  'LI23 7479 62SC RO3M FPZW M', '52 Raven Park', '1647303010', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Usuario', 'Administrador', '3246', true),
        (3, 'admin3', SHA2("${process.env.ADMIN_PASSWORD}", 512),'admin', 'nachorsanz@gmail.com',  'IE46 BCHL 2574 9664 4665 62', '7029 Grasskamp Point', '2798027245', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Usuario', 'Administrador', null, true),
        (4, 'vmcauliffe3', SHA2("${process.env.GENERIC_PASSWORD}", 512),'regular', 'vmcauliffe3@theatlantic.com',  'BH74 XBKG LIJO O5GO 3BFG 0P', '7 Jay Court', '1776315145', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Vanny', 'McAuliffe', '89129', true),
        (5, 'mdwyer4', SHA2("${process.env.GENERIC_PASSWORD}", 512), 'regular','mdwyer4@toplist.cz',  'CH05 6034 2YHC 7LUB IXW7 A', '48023 Melby Road', '2301555176', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Modestine', 'Dwyer', '4824', true);
        `);

        console.log('Usuarios administradores insertados');

        await connection.query(`
        INSERT INTO experiences(id, descripcion, nombre, ciudad, precio, categoria, num_participantes, disp, fecha_inicio, fecha_fin) VALUES
    (1, 
    '??Te gustar??a ser piloto por un d??a? ??En Madrid? ??Ahora es m??s f??cil que nunca, da el paso!

    En 1903 los c??lebres y pioneros en la historia de la aviaci??n hermanos Wright lograron su primer vuelo. En 1908 patentaron su invento, el aeroplano. M??s de un siglo despu??s de este aut??ntico hito en la historia de la humanidad poder convertirte en piloto est?? al alcance de tus manos. Te invitamos a surcar el cielo y sentir que eres libre como un p??jaro.

    Tienes la posibilidad de realizar vuelos de 30, 45, 60 y 120 minutos. Siempre y cuando se ajuste a estas restricciones temporales puedes proponer la ruta de vuelo que m??s se ajuste a tus preferencias. El inicio y el final, esto s??, tendr??n que ser en el aer??dromo de Casarrubios.

    En la modalidad de media hora, por ejemplo, podr??s disfrutar sobrevolando el pantano de San Juan y en la de una hora el maravilloso Monasterio de el Escorial.

    No dejes escapar esta oportunidad ??nica. ??S?? piloto por un d??a en Madrid!',
    'Piloto por un D??a',
    'Madrid',80.00,'Vuelo',1,true,'2021-01-01','2022-12-31'),
    (2, 
    'Seguro que alguna vez has so??ado que volabas... ??es cierto, verdad? Pues deja ya de so??ar y convi??rtelo en realidad con este vuelo en parapente biplaza en Miraflores de la Sierra, Madrid.

    El parapente es un deporte nacido a finales del siglo XX y confundido muchas veces con el paracaidismo. La diferencia fundamental entre estos dos deportes es que mientras el paraca??das est?? dise??ado para caer lentamente, el parapente est?? hecho para volar. S??, literalmente, volar.

    Este es el motivo por el que no es necesario saltar des de una monta??a o un avi??n, sino que es suficiente con encontrarse en un punto con un cierto desnivel que permita alcanzar corrientes de viento que pueden prolongar el vuelo durante horas. El despegue se hace lentamente des del suelo.

    La zona donde se realiza el vuelo, la Sierra del Guadarrama, te permite avistar una gran cantidad de buitres, ??guilas y halcones gracias a su proximidad a la mayor reserva europea de aves rapaces. Y por si la experiencia de volar fuera poco, los paisajes, impresionantes, te dejar??n sin palabras.

    Durante el vuelo, f??cil y seguro, ser??s el pasajero de un piloto experto. Adem??s, los puntos de encuentro est??n cuidadosamente elegidos y son zonas de alto inter??s tur??stico para que puedas pasar el d??a en grande con quien quiera acompa??arte.

    ??Vive esta gran experiencia!',
    'Vuelo en Parapente Biplaza',
    'Aviles',85.00,'Vuelo',2,true,'2021-05-01','2022-10-31'),
    (3, 
    'Vive una experiencia inolvidable volando en el T??nel de Viento de Windobona, frente al Centro Comercial Islazul en Madrid.

    Experimentar??s la sensaci??n de volar gracias al aire del t??nel de viento que te har?? flotar simulando que est??s en plena ca??da libre. Te permitir?? practicar el paracaidismo interior y saber qu?? se siente al volar con un aire libre de turbulencias.

    Nada m??s llegar te registrar??s en el centro y acto seguido conocer??s a tu instructor, que te acompa??ar?? a lo largo de toda la actividad. Te har?? una breve introducci??n a las posiciones correctas y otras pautas para que una vez dentro del t??nel lo disfrutes al m??ximo sin preocuparte de nada.

    ??Atr??vete a volar!',
    'Alas para Uno: T??nel de Viento',
    'A Coru??a',50.00,'Vuelo',1,true,'2021-02-01','2022-09-30'),
    (4, 
    'Vuela en globo con un grupo de entre 7 y 10 personas por encima del Parque Regional del R??o de Guadarrama. ??Vive una experiencia ??nica desde las alturas con este paseo en globo! Disfruta de esta experiencia en la zona de vuelo m??s cercana a Madrid, a tan s??lo 20 minutos de la capital

    La actividad empieza por la ma??ana, cuando los participantes se re??nen para iniciar el montaje e inflado del globo. Se empieza a volar al empezar el d??a, que es cuando el viento est?? m??s calmado y la atm??sfera m??s fr??a y estable.El itinerario depender?? del viento. Los globos s??lo se pueden dirigir verticalmente y el piloto aprovechar?? las corrientes de aire para elegir una direcci??n. El equipo de tierra os estar?? esperando cuando descend??is con un 4x4 para dirigiros al tentempi??.

    Volar en globo es, por encima de todo, sentir. Arriba, s??lo se oye el silencio. Suspendido en el aire, se tiene la sensaci??n de que quien se mueve no eres t??, sino la tierra, que parece alejarse bajo tus pies. Volar en globo es sentir lo que nunca has sentido. Es vivir el momento, es vivir la emoci??n. Es dejarse llevar. Suave, ligera e imperceptiblemente.

    ??No te lo pienses m??s!',
    'Vuelo en Globo, Fotos, V??deo, Almuerzo y Cava',
    'San Sebastian',160.00,'Vuelo',4,true,'2021-04-01','2022-09-30'),
    (5, 
    'Experimentad la sensaci??n de volar con este vuelo en paramotor para dos personas. Una experiencia, en Guadalix de la Sierra (Madrid), gracias al cual podr??is ver el mundo a vista de p??jaro.

    ??Nunca hab??is volado en paramotor? Aqu?? llega vuestra oportunidad. Disfrutad de un d??a de vuelo junto a un piloto experimentado. Sentid el viento en la cara, relajaos, dejaos llevar... por unos instantes dejar??is atr??s todos vuestros problemas. El vuelo en parapente biplaza es la manera m??s f??cil y segura de iniciarse en este deporte.

    Para el despegue es necesario dar cuatro pasos y, siguiendo los consejos del piloto, notar??is como os elev??is descubriendo la magia del vuelo. Disfrutad de unas esplendidas vistas del Valle de Guadalix, el Pantano del Vell??n y la Sierra Norte.

    El vuelo se realiza por separado: primero lo lleva a cabo una persona con el instructor y a continuaci??n el acompa??ante junto al instructor.

    Teng??is o no experiencia y, sea cual sea vuestra edad, ??volad!',
    'Vuelo Paramotor para dos',
    'Valencia',150.00,'Vuelo',2,false,'2021-02-15','2022-06-30'),
    (6,
    '??Quieres disfrutar de un d??a lleno de emociones? Divi??rtete con una Excursi??n en Moto Acu??tica por la Catedral de Palma o en la Reserva Natural "Los Deltas" de Mallorca.

    Siente la velocidad a flor de piel y vive una jornada ??nica gracias a Mallorca On Jetski. Con esta experiencia podr??s ponerte a los mandos de una moto de agua y navegar por una de las dos rutas a escoger. Si te decides por la Catedral de Palma podr??s navegar hasta este edificio tan emblem??tico y despu??s probar la moto en mar abierto. Ser?? el momento en el que podr??s descargar toda la adrenalina que llevas dentro.

    Si prefieres navegar por aguas cristalinas y disfrutar de acantilados y cuevas, la ruta de la Reserva Natural de ???Los Deltas??? te encantar??. Adem??s, podr??s refrescarte con un ba??o en sus preciosas aguas de color turquesa.

    ??A qu?? est??s esperando?',
    'Excursi??n en Moto Acu??tica',
    'Palma de Mallorca',75.00,'Acu??tica',2,true,'2021-06-10','2022-10-02'),
    (7,
    'Vive una nueva aventura con esta experiencia de Bautismo de Buceo con Fotos y V??deos en Vilagarc??a de Arousa, Pontevedra.

    ??Has estado alguna vez bajo el mar? Ahora tienes la oportunidad de sumergirte en las aguas del Vilagarc??a de Arousa y descubrir los peces y la flora que habita. Da el paso y disfruta como nunca antes lo hab??as hecho. Ad??ntrate en el maravilloso mundo del submarinismo. ??Seguro que querr??s repetir! Con esta experiencia tendr??s una primera toma de contacto con el medio subacu??tico. En todo momento estar??s acompa??ado de un instructor profesional que velar?? por tu seguridad y har?? que este momento sea inolvidable.

    Siente la sensaci??n de estar respirando bajo el agua, desplazarte como un pez y contemplar la vida marina que hay en el mar. Adem??s, para que te lleves un bonito recuerdo y revivas este d??a tantas veces como quieras se te entregar??n fotos y v??deos de la actividad.

    ??Equ??pate y l??nzate al agua!',
    'Bautismo de Buceo',
    'Vilagarc??a de Arousa', 60.00,'Acu??tica',4,true,'2021-06-15','2022-09-20'),
    (8,
    'Disfruta de una aut??ntica aventura con una jornada de Rafting en Cantabria, una oportunidad ??nica para sentir la emoci??n y la adrenalina en tu cuerpo practicando un aut??ntico deporte.

    El Rafting es una actividad deportiva y recreativa que consiste en recorrer el cauce de los r??os en la direcci??n de la corriente, r??o abajo, sobre una embarcaci??n. Realizar??s el rafting en el tramo de Arroyo a Aldea de Ebro. Una experiencia de pura diversi??n, emoci??n y trabajo en equipo, en unas aguas rodeadas de un entorno espectacular. Una embarcaci??n neum??tica (raft) y un grupo de personas dispuestas a disfrutar con la experiencia son los elementos necesarios para pasar una buena experiencia.

    Adem??s, el nivel de la actividad se adapta a las caracter??sticas del grupo, por lo que tanto debutantes como practicantes pueden gozar de una jornada ??nica. Con el descenso disfrutar??s de los r??pidos m??s fuertes del r??o Ebro.

    ??No te lo pienses m??s y atr??vete con esta divertida aventura!',
    'Rafting (Arroyo, Cantabria)','Arroyo', 35.00, 'Acu??tica',6,true,'2021-06-20','2022-09-15'),
    (9,
    'Vive un d??a diferente en la isla con esta Excursi??n en Barco y Avistamiento de Cet??ceos en Tenerife.

    Sube a bordo de una Goleta Portuguesa y prep??rate para vivir una aventura en alta mar. Esta maravillosa experiencia empieza en el puerto de los Cristianos, al sur de la isla canaria, desde donde zarpar??s y disfrutar??s de una navegaci??n a vela. Siente el suave vaiv??n de las olas y la brisa en tu rostro. Poco a poco te ir??s adentrando en el oc??ano en busca de ballenas pilotos y delfines. Disfrutar??s de un espect??culo natural ??nico. Tendr??s el privilegio de poder ver a estos animales en su h??bitat natural en libertad.

    Despu??s pondr??s rumbo hacia la reserva marina de La Caleta o Palm-Mar. Ah?? har??s un alto en el camino y podr??s lanzarte al agua y refrescarte con un ba??o en las aguas cristalinas.

    ??La diversi??n est?? asegurada! ??Te apuntas?',
    'Excursi??n en Barco y Avistamiento de Cet??ceos',
    'Los Cristianos',25.00,'Acu??tica',12, true, '2021-06-15','2022-08-27'),
    (10,
    'Si est??s pensando en pasar un d??a diferente y no sabes que hacer, esta experiencia de excursi??n en barco con comida en Valencia es la opci??n perfecta.

    La actividad comenzar?? en el puerto de Valencia. All?? te subir??s al catamar??n que te llevar?? al mar. Poco a poco ver??s como os ir??is alejando de la costa y una vez est??is en alta mar el barco fondear??.

    La embarcaci??n dispone de una red ubicada sobre el mar en la que podr??s admirar la costa de Valencia sentado o tumbado. Durante el recorrido tendr??s la oportunidad de darte un ba??o, tomar el sol, o simplemente relajarte lejos de las abarrotadas playas. Con esta experiencia se incluye una comida que consiste en ensalada, paella, pan y fruta . Para beber podr??s escoger entre refresco o sangr??a. Despu??s de unas horas en el mar el catamar??n se pondr?? en marcha y volver??is a la costa.

    ??Vive una experiencia inolvidable con esta excursi??n al mar!',
    'Excursi??n en Catamar??n',
    'Valencia',42.00,'Acu??tica',4,true,'2021-06-20','2022-07-30'),
    (11, 
    'Ap??ntate a la Ruta en Segway por Santa Pau y conoce la zona volc??nica de La Garrotxa de una forma diferente en Girona.

    Disfruta de un paseo por la Villa Medieval y su entorno. Rodea la muralla y desl??mbrate con las espectaculares vistas de los miradores. Sin olvidarnos de los volcanes dormidos desde hace millones de a??os, las ermitas, los saltos de agua y mucho m??s. Descubre las maravillas que esta zona esconde de una forma muy din??mica y divertida.

    Antes de empezar la ruta dispondr??s de tiempo ilimitado de entrenamiento con el Segway, para aprender a manejarlo con comodidad y confianza. Y durante todo el trayecto dispondr??s de un gu??a en el grupo que te ir?? ofreciendo explicaciones sobre lo que vayas visitando para que no pierdas detalle.

    ??Disfruta de una nueva forma de hacer turismo en una hermosa zona del Pirineo Oriental!',
    'Tour en Segway por los volcanes de la Garrotxa',
    'Girona',30.00,'Aventura',10,true,'2021-01-01','2022-12-31'),
    (12, 
    'Descubre de lo que eres capaz haciendo un salto de Puenting en Monistrol de Montserrat. ??La adrenalina estar?? asegurada!

    Si quieres sentir c??mo la energ??a recorre todo tu cuerpo, hacer puenting es sin duda el plan perfecto. Si te consideras una persona que le gusta vivir al l??mite, con este salto vivir??s sensaciones inexplicables que te dejar??n con ganas de repetir. A los pies de la imponente monta??a de Montserrat, tu cuerpo experimentar?? algo inexplicable.

    Una vez llegues a la localizaci??n del puente, un t??cnico experto te indicar?? todos los pasos y movimientos que debes hacer antes y durante el salto. Con sus consejos te relajar??s y sentir??s totalmente seguro para empezar la aventura. Abr??chate, cierra los ojos, respira hondo y salta. Aunque el momento dure escasos segundos, lo que sentir??s ser?? muy intenso.

    ??Seguro que lo recordar??s toda la vida!',
    'Puenting',
    'Barcelona',35.00,'Aventura',12,true,'2021-02-01','2022-11-30'),
    (13, 
    'Este Paseo a Caballo por el Montseny os har?? sentir totalmente libres. Un plan ideal si siempre hab??ais querido aprender a montar a caballo.

    La nobleza que caracteriza al caballo es de sobras conocida. Descubrid el encanto de estos animales y compartid un momento ??nico con ellos en plena naturaleza. Un paseo por el Parque Natural del Montseny que jam??s querr??is olvidar.

    Primero de todo recibir??is una breve clase para aprender las nociones b??sicas de la monta a caballo y para familiarizaros con estos incre??bles animales. Ver??is como os compenetr??is a la perfecci??n con estos asombrosos animales y cre??is un gran v??nculo con ellos.

    Pasear??is subidos a caballo por el parque natural m??s antiguo de Catalu??a. Un mosaico de paisajes del mediterr??neo y del centro de Europa que ha servido de inspiraci??n a artistas e intelectuales. Un para??so natural en el que respirar??is aire puro y en el que su gran variedad de especies animales y vegetales os dejar??n asombrados. Subir??is monta??as, podr??is cruzar alg??n riachuelo, disfrutar??is de la naturaleza y vivir??is una aventura inolvidable subidos a caballo.

    ??Un paseo para recordar!',
    'Paseo a Caballo por la monta??a',
    'Tarragona',60.00,'Aventura',15,true,'2021-03-01','2022-09-30'),
    (14, 
    '??Quieres introducirte en un nuevo deporte de aventura? Con este barranquismo en Sadernes (Huesca) descubrir??s una de las experiencias m??s divertidas que existen.

    El barranquismo es una actividad que se practica en los barrancos de un r??o. Esta actividad se realizar?? en el barranco de Estrets de Sant Aniol en Sadernes, dentro del Espacio Natural de la Alta Garrotxa. Un barranco, caracterizado por sus aguas de color turquesa, ideal para iniciarte en esta nueva aventura.

    En este tramo de barranquismo pasar??s por diferentes r??peles, nadar??s en aguas cristalinas y realizar??s diferentes saltos de entre 2 y 7 metros de altura. Una actividad que la realizar??s junto a un instructor experto, que te explicar?? la mejor manera para superar cada tramo. ??Divi??rtete en familia o con amigos!

    Y para que guardes un recuerdo de este d??a, con esta experiencia recibir??s un reportaje fotogr??fico.

    ??Descubre uno de los mejores lugares para iniciarte en esta actividad',
    'Iniciaci??n al Barranquismo',
    'Huesca',40.00,'Aventura',8,true,'2021-05-15','2022-10-11'),
    (15, 
    'Conoce un lugar muy especial en la isla de Mallorca. Descubre uno de sus principales atractivos tur??sticos con esta Entrada a las Cuevas dels Hams, situadas en Porto Cristo.

    La historia de estas cuevas se remonta hasta 10 millones de a??os. En el a??o 1905 el espele??logo Don Pedro Caldentey Santandreu las descubri?? mientras realizaba excavaciones en la zona. Las Cuevas dels Hams son una obra de arte de la naturaleza y ahora tendr??s la oportunidad de visitarlas. Iniciar??s la experiencia descendiendo hacia la Cueva Redonda, que alberga un inmenso jard??n bot??nico, verde y lleno de vida.

    Despu??s continuar??s por la Cueva Azul, donde conocer??s la historia de Mallorca a trav??s de un documental. Adem??s, tambi??n podr??s admirar la nueva y espectacular iluminaci??n led, las ???Columnas de Sanson???, las ???Llanuras de Fra Mauro??? y el ???Foso del Infierno???, un auditorio donde se presentar?? una proyecci??n gigante sobre una roca milenaria de la Cueva. Seguidamente pasar??s a la Cueva Cl??sica, con 12 galer??as impresionantes y el lago subterr??neo Mar de Venecia, donde se ofrece un espect??culo musical.

    D??jate llevar por la magia de estas cuevas de Mallorca. ??Vis??talas!',
    'Entrada a Cuevas dels Hams',
    'Palma de Mallorca',20.00,'Aventura',20,false,'2021-02-15','2022-05-30'),
    (16,
    'Adentraos en un spa japon??s en pleno centro de Madrid: Esenzias Spa. Cuidad vuestro bienestar de una forma original y que os dejar?? totalmente renovados.

    Tendr??is la oportunidad de entrar en su circuito onsen, en el que encontrar??is cuidadas instalaciones pensadas para vuestro disfrute. Empezad a relajaros en el jacuzzi y en la sala de vapor. Activad vuestra circulaci??n pasando por la piscina de agua fr??a. Descubrid un relax sin igual y eliminad toxinas en el Ofuro, una piscina de madera japonesa con agua muy caliente. Acabad en la tranquila sala de descanso en la que podr??is reconfortaros con un t??.

    Despu??s os esperar?? un masaje para relajaros en cuerpo y mente. Podr??is elegir entre un masaje relajante, descontracturante, sensitivo, de cabeza y pies o uno con t??cnicas orientales. Aliviar??is tensiones musculares y eliminar??is el estr??s.

    ??Elegid esta experiencia de relax diferente y especial!',
    'Circuito Onsen Spa y Masaje para dos en Esenzias',
    'Madrid', 108.00, 'Relax', 2,true,'2021-02-10','2022-05-30'),
    (17,
    'Si quer??is pasar un rato relajados y disfrutar en pareja de un masaje estad atentos a esta experiencia que os proponemos. Alejaos del estr??s con estos Ba??os Termales y Masaje Relajante en Aire Ancient Baths Barcelona.

    Dejaos llevar por el recorrido que empezar?? en el agua templada del tepidarium (36??), la caliente del caldarium (40??) y la fr??a del frigidarium (16??). Seguidamente os beneficiar??is de un ba??o de vapor en el Hammam y podr??is sentir el roce del agua en el ba??o de mil chorros. Deshaceos del estr??s y del cansancio y ayudaos a mejorar el sue??o.

    Mientras est??is realizando el recorrido os llamar??n para daros un masaje relajante. Tumbaos en la camilla y dejad que los profesionales os vayan eliminando la tensi??n muscular.

    Disfrutad con vuestra pareja de una sesi??n de relax y sent??os mejor.',
    'Ba??os Termales con Aromaterapia y Masaje Relajante',
    'Barcelona',134.00,'Relax',2,true,'2021-01-13','2022-11-30'),
    (18,
    '??Busc??is alejaros de la rutina y vivir un momento de paz y tranquilidad? Entonces haced un hueco en la agenda y relajaos con un Circuito Spa en Estepona . Una experiencia ideal para desconectar y alcanzar el bienestar total de vuestro cuerpo y mente.

    Descubrid este lugar destinado al bienestar, la salud y la belleza. Dejaos llevar e iniciad el recorrido disfrutando de 3 piscinas climatizadas de agua salada donde podr??is relajaros y liberar el cuerpo de todo el cansancio. A continuaci??n podr??is masajear vuestro cuerpo con las burbujas de los jacuzzis y cuidar vuestra piel, dej??ndola limpia y suave, en la saunas y en el hammam. Adem??s, tambi??n tendr??is acceso a las duchas de contraste e hidromasaje, perfectas para destensar la musculatura, y al recorrido de piedras.

    Aprovechad esta oportunidad para cuidar vuestro cuerpo con agua reci??n extra??da del Mediterr??neo y ya ver??is qu?? r??pido descubr??s los m??ltiples beneficios que tiene el agua para relajar y mimar nuestro cuerpo.

    No os lo pens??is m??s y animaos a vivir un momento de bienestar total.',
    'Circuito Spa para dos en Elba Estepona Gran Hotel 5*',
    'M??laga',60.00,'Relax',3,true,'2021-01-15','2022-10-20'),
    (19,
    'Dejad que la calma os invada con una experiencia de bienestar que os encantar??. Disfrutad de un Circuito Spa con Masaje para dos en San Sebasti??n, Guip??zcoa y olvidaos del estr??s diario.

    El Hotel Catalonia Donosti 4*, situado en un mirador natural sobre el cerro de San Bartolom??, os abre sus puertas y os invita a disfrutar de sus m??s de 350m2 dedicados al relax. Podr??is desconectar en un espacio acogedor en el que encontrar??is todo lo que necesit??is para pasar unos minutos de evasi??n. Desde una piscina de agua fr??a, una piscina de chorros, un ba??o de vapor, duchas de sensaciones y una zona de relax. ??No os faltar?? de nada!

    Adem??s, esta experiencia tambi??n incluye un masaje relajante con el que podr??is aliviar las tensiones y salir totalmente renovados. Recargad las pilas y no pens??is en nada m??s que en vosotros.

    El relax os est?? llamando. ??Os apetece?',
    'Circuito Spa y Masaje para dos en Hotel Catalonia Donosti 4*',
    'San Sebastian',148.00,'Relax', 2,true,'2021-01-20','2022-12-20'),
    (20,
    'No te pierdas esta chocolaterapia si eres una aut??ntica chocoadicta. Todos los beneficios del chocolate sin ning??n remordimiento en Valladolid. Y despu??s, un relajante ba??o en el jacuzzi. ??Saldr??s como nueva!

    El chocolate es una sustancia estimulante por naturaleza, reactiva la circulaci??n, relaja la musculatura y tiene unos estupendos efectos antioxidantes. Adem??s el aroma de cacao fomenta la liberaci??n de endorfinas, procur??ndonos sensaciones de placer, relajaci??n, energ??a y felicidad. Por todas estas razones el chocolate se ha venido empleando en tratamientos corporales.

    Con el masaje de chocolate caliente podr??s sentir todos los nutrientes del chocolate, con vitamina E y antioxidantes, eliminar??s el estr??s, relajar??s tu cuerpo y tu mente y revitalizar??s la piel dej??ndola suave y ligeramente perfumada.

    Y para acompa??ar este maravilloso tratamiento, podr??s disfrutar de un relajante jacuzzi con cromoterapia y cielo estrellado, una peque??a piscina con una temperatura de 32?? y chorros de agua, ideal para relajar cuerpo y mente.

    ??Ven a mimarte! ??Te lo mereces!',
    'Chocolaterapia y Jacuzzi',
    'Arroyo de la Encomienda',45.00,'Relax',1,true,'2021-02-02','2022-11-25'),
    (21, 
    'Ad??ntrate de una forma entretenida en el fascinante mundo de la Ribera del Duero con esta Jornada Enol??gica en Aranda.

    La localidad burgalesa de Aranda de Duero cuenta con unas bodegas subterr??neas en el casco hist??rico de la ciudad. Durante todo el a??o mantienen un nivel de humedad constante y una temperatura entre los 11??C y los 13??C. Esto unido a la ausencia de ruidos y vibraciones, hacen un lugar ideal para la conservaci??n de los caldos arandinos.

    Visitar??s una bodega medieval guiado por un divertido personaje del siglo XVIII, que te ense??ar?? este lugar de una forma amena. Adem??s, podr??s degustar la comida t??pica de la zona con un men?? en un asador t??pico. Saborea un manjar que contentar?? a los paladares m??s exigentes.
    Para finalizar, realizar??s una cata para introducirte en el mundo del vino. A trav??s de cinco vinos, aprender??s las principales caracter??sticas: colores, aromas y sabores.

    Si eres amante del mundo de la enolog??a, ??no dejes escapar esta oportunidad!',
    'Jornada Enol??gica: Visita Bodega, Curso de Cata de Vino y Comida en Asador Castellano',
    'Burgos',65.00,'Gastronomia',16,true,'2021-05-01','2022-09-30'),
    (22, 
    'Sentid la pasi??n por el vino con la Visita a las Bodegas Mu??ana y Degustaci??n de Vino en Granada.

    No os perd??is esta experiencia en las bodegas Mu??ana, un lugar donde la tradici??n y la ilusi??n por el vino se encuentran en todos los rincones. Sumerg??os en el apasionante mundo de la viticultura con los profesionales de la bodega con m??s personalidad de Andaluc??a. Adem??s, evad??os disfrutando de un paisaje privilegiado rodeado de naturaleza con las monta??as de Sierra Nevada como principales vistas.

    Empezad con un agradable paseo entre los vi??edos, respirad aire puro y contemplad las vi??as en su m??ximo esplendor. Despu??s visitar??is la bodega y aprender??is todo el proceso de la elaboraci??n del vino. Y para terminar, no os podr??is ir sin probar sus creaciones. Por eso realizar??is una cata y saborear??is dos de los deliciosos vinos de la bodega mientras aprend??is unas nociones b??sicas sobre catas.

    Vivid un momento m??gico ??No os defraudar??!',
    'Visita a las Bodegas Mu??ana y Degustaci??n de vino',
    'Granada',29.00,'Gastronomia',20,true,'2021-02-01','2022-11-30'),
    (23, 
    '??Quer??is descubrir la primera almazara tur??stica de la provincia de Ja??n? Haced una Visita con Cata de Aceites a Ole??cola San Francisco.

    La empresa es una f??brica familiar con origen en el 1989, situada en el municipio de Beg??jar, Ja??n. Tendr??is el privilegio de hacer una visita guiada junto con profesionales de la almazara que os recibir??n d??ndoos a conocer el mundo de los aceites. Entrar??is en la almazara mientras os van explicando c??mo funciona. Adem??s, tambi??n sabr??is c??mo elaboran sus aceites desde el origen de sus plantaciones con olivos hasta el embotellado.

    Para completar esta experiencia de oleoturismo har??is una cata de sus aceites de oliva virgen extra junto con un aperitivo compuesto por un variado tapeo t??pico de Ja??n. Tambi??n os ofrecer??n un porr??n de vino.

    Disfrutad de la gastronom??a andaluza y de sus mejores aceites de oliva. ??Merece la pena probarlo!',
    'Visita Guiada con Cata de Aceites, Aperitivo y Porr??n de Vino para dos en Ole??cola San Francisco',
    'Ja??n',36.00,'Gastronomia',10,true,'2021-03-01','2022-09-30'),
    (24, 
    '??Os gusta la cerveza? Ahora ten??is la oportunidad de visitar la F??brica Mond y hacer una Cata de Cerveza y Maridaje en Sevilla.

    La f??brica est?? situada a 10 minutos del centro de la ciudad, en la calle Torrepavas. Durante vuestro paso por sus instalaciones conocer??is todo el proceso de elaboraci??n de la cerveza artesanal Mond, desde la molienda de la cebada hasta el etiquetado final. Adem??s, tendr??is el privilegio de disfrutar con su sabor en la zona de degustaci??n, donde podr??is probar hasta 3 variedades de cerveza Mond.

    Dejaos sorprender por el gusto caracter??stico de cada una de las variedades, donde la espuma, el amargor y su efecto refrescante o afrutado va cambiando. Aprovechad esta visita y cata de cerveza en Sevilla que no os dejar?? indiferentes. Vivir??is un momento ??nico que no olvidar??is.

    ??No os lo pens??is m??s!',
    'Visita a F??brica Mond con Cata de Cerveza y Maridaje',
    'Sevilla',18.00,'Gastronomia',8,true,'2021-05-15','2022-08-11'),
    (25, 
    '??Os gusta el mundo de los vinos? Os recomendamos esta experiencia de Enoturismo en Rioja Alavesa.

    Empezar??is visitando unos vi??edos que se encuentran en esta comarca de ??lava, amparada dentro de la D.O.Ca Rioja. Conocer??is las zonas de producci??n, el clima, los tipos de suelo, las variedades, etc. Os dar??n la posibilidad de participar en las labores que se est??n realizando en el momento (vendimia, poda, plantado...). Y tambi??n os ofrecer??n un almuerzo campero con el que os deleitar??is con productos de la zona.

    Posteriormente pasar??is por su bodega donde descubrir??is el proceso de elaboraci??n de sus vinos de la D.O.Ca. Rioja, la m??s antigua de las denominaciones espa??olas. En la sala de las barricas os explicar??n los m??todos de crianza y envejecimiento as?? como las diferentes categor??as de vinos. Aqu?? tambi??n podr??is participar en las labores como el pisado, descube, prensado y filtrado entre otras. Al finalizar har??is una cata de tres vinos D.O.Ca. Rioja.

    Disfrutad y sacadle el m??ximo provecho a esta actividad de enoturismo. ??Preparados?',
    'Enoturismo: Visita a Vi??edos y Bodega, Cata de Vinos, Almuerzo y Actividades de Vinicultura',
    'Alava',65.00,'Gastronomia',20,true,'2021-02-15','2022-06-30'),
    (26,
    'Si siempre has querido sentir la velocidad, ahora puedes hacerlo con esta experiencia. Disfruta de un d??a en uno de los circuitos m??s r??pidos de Espa??a: conducir un Ferrari F430 y un Formula 2.0.

    Esta experiencia se inicia desde el box, donde realizar??s una vuelta de reconocimiento con un piloto profesional. ??l te dar?? un briefing explicativo del circuito y sus caracter??sticas.

    A continuaci??n, pon a prueba tu adrenalina al volante del Ferrari F430, donde el instructor te explicar?? su funcionamiento y la mejor manera de disfrutar de esta experiencia. Una vez realizada la conducci??n con el Ferrari F430 entrar??s en boxes, donde cambiar??s el Ferrari por el Formula 2.0. Al igual que con el Ferrari, pisar??s a fondo el acelerador para recorrer el circuito, acabando de nuevo en el box.

    En todo momento el instructor te guiar?? para realizar tu sue??o de la forma m??s especial y segura.



    Adrenalina en estado puro en un jornada que nunca olvidar??s.',
    'Ferrari F430 F1 y Formula 2.0',
    'Valencia',179.00,'Motor',1,true,'2021-01-01','2022-08-30'),
    (27, 
    'Si siempre has querido sentir la velocidad, ahora puedes hacerlo con esta experiencia. Disfruta de un d??a en uno de los circuitos m??s r??pidos de Espa??a: conducir un Ferrari F430 y un Lamborghini Gallardo.

    Esta experiencia se inicia desde el box, donde realizar??s una vuelta de reconocimiento con un piloto profesional. ??l te dar?? un briefing explicativo del circuito y sus caracter??sticas.

    A continuaci??n, pon a prueba tu adrenalina al volante del Ferrari F430, donde el instructor te explicar?? su funcionamiento y la mejor manera de disfrutar de esta experiencia. Una vez realizada la conducci??n con el Ferrari F430 entrar??s en boxes, donde cambiar??s el Ferrari por el Lamborghini Gallardo. Al igual que con el Ferrari, pisar??s a fondo el acelerador para recorrer el circuito, acabando de nuevo en el box.

    En todo momento el instructor te guiar?? para realizar tu sue??o de la forma m??s especial y segura.


    Adrenalina en estado puro en un jornada que nunca olvidar??s.', 
    'Ferrari F430 F1 y Lamborghini Gallardo ', 
    'Navarra',179.00,'Motor',1,true,'2021-01-01','2022-12-30'),
    (28,
    '??Conduce tres coches! Ponte a los mandos de un Ferrari, un Lamborghini y un Porsche en esta experiencia sin igual.

    Si eres un apasionado del motor y quieres vivir nuevas sensaciones, ??No te lo pienses m??s! Conduce el Ferrari F430, el Lamborghini Gallardo y el Porsche Boxter y descubre, de primera mano, las sensaciones que experimentan los pilotos de Formula 1 sobre el asfalto.

    A la llegada se llevar?? a cabo un briefing, donde se dar??n unas nociones pr??cticas para que aprendas a manejarlos. A continuaci??n, ??Empieza lo realmente divertido! Conduce un Ferrari, un Lamborghini y un Porsche en circuito, pisando a fondo el acelerador y disfrutando al m??ximo de un sinf??n de sensaciones.

  
    Adrenalina en estado puro. ????Te quedar??s sin probarlo!?',
    'Tr??o de Coches: Ferrari, Lamborghini y Porsche',
    'Madrid',249.00,'Motor',1,true,'2021-01-01','2022-12-30'),
    (29,
    'D??jate sorprender por un d??a lleno de emoci??n y adrenalina. Disfruta de un Vuelo en Avioneta y conduce un Ferrari en Carretera por Barcelona.

    Ad??ntrate en el mundo de la aviaci??n y descubre sensaciones nuevas a bordo de una avioneta. Sobrevuela lugares con mucho encanto y divisa paisajes maravillosos desde el aire. Tu aventura comenzar?? desde el aeropuerto de Sabadell y desde ah?? pondr??s rumbo a las monta??as de Montserrat o hac??a la costa del Maresme. ??T?? eliges!

    Tambi??n tendr??s la oportunidad de pilotar un Ferrari F430 F1 por carretera. Ponte al volante de este incre??ble coche y siente la potencia del motor y la aceleraci??n de 0 a 100 en 4 segundos. Descubre la sensaci??n al conducir el coche de tus sue??os y ser el centro de todas las miradas. Nota como la adrenalina recorre todo tu cuerpo. Disfruta de un emocionante paseo por las carreteras cercanas a Montmel??.

    ??Te vas a perder vivir el d??a con el que todo el mundo sue??a?',
    'Vuelo en Avioneta y Conducci??n de Ferrari en Carretera',
    'Sabadell',119.00,'Motor',1,true,'2021-01-01','2022-12-30'),
    (30,
    'Si te gustan las emociones fuertes y los deportes de riesgo, libera toda tu adrenalina aprendiendo a derrapar con este Curso de Drift en Madrid.

    El Drifting o drift consiste en derrapar de manera que el veh??culo forme un ??ngulo con la direcci??n de movimiento. Este deporte se hizo popular a finales de la d??cada de los 90 cuando llegaron pilotos especialmente entrenados y con coches preparados para realizar derrapes controlados a altas velocidades.

    Con esta experiencia disfrutar??s de la conducci??n de un BMW 540 en un circuito de asfalto. Para empezar, har??s una vuelta de reconocimiento con Fran Bola??os, campe??n de Espa??a en categor??a AM de Drift en 2012, qui??n te ense??ar?? los mejores trucos y te explicar?? todo lo necesario para sentirte m??s seguro y c??modo con el veh??culo. Una vez todo entendido, ya te podr??s poner al volante y empezar a trazar curvas de una manera distinta y divertida.

    ??Dale al gas! Y an??mate a vivir una experiencia inolvidable llena de sensaciones fuertes.',
    'Curso de Drift en Asfalto (Madrid)', 
    'Legan??s', 49.00, 'Motor', 1, true, '2021-01-01', '2022-12-30'),
    (31, 
    '??Te gusta el mar y te gustar??a explorar sus profundidades? No te pierdas esta oportunidad y disfruta del Pack de Bautismo de Buceo en diferentes zonas de Espa??a. ??A qu?? esperas?

    Prep??rate para sumergirte e iniciarte en la disciplina del submarinismo de la mano de un instructor profesional. Antes que nada, te explicar??n el funcionamiento de la actividad y te ense??ar??n todo lo necesario para disfrutar de la inmersi??n. Te equipar??s con el neopreno, gafas, aletas, botella, etc. y ??al agua!

    Habr?? llegado el momento de poner en pr??ctica todo lo aprendido y de observar todo lo que el fondo marino tiene que ofrecer. Bajar??s a una profundidad de unos 5-6 metros aproximadamente y experimentar??s todas las sensaciones del buceo. Adem??s, con algunas de las opciones disponibles te podr??s llevar a casa fotos y/o v??deo de la actividad para recordarla siempre.

    ??Sum??rgete en esta aventura!',
    'Pack Bautismo de Buceo',
    'Lanzarote',49.00,'Pareja',2,true,'2021-01-01','2022-12-31'),
    (32, 
    'El globo, el viento ??y vosotros! Ahora pod??is vivir esta experiencia: vuelo rom??ntico en globo. Un vuelo especial que os llevar?? a vivir momentos incre??bles.

    Disfruta del vuelo con la primera empresa autorizada en Espa??a para realizar vuelos en globo con pasajeros, empresa de Turismo Activo de la Junta de Castilla y Le??n T.A 40-28, con pilotos profesionales expertos y que adem??s tienen una gran experiencia en algunos de los lugares m??s famosos del mundo en paseos en globo como Capadocia (Turqu??a), Bag??n (Myanmar) y Canad??. El primer piloto de Globos Boreal es Javier Tarno 6 veces campe??n de Espa??a de Aerostaci??n y tiene m??s de 4000h de vuelo.

    Disfruta de la sensaci??n de flotar hasta los 1.000 metros de altura, mientras el viento empuja el globo y descubr??s los paisajes asombrosos que esconde Segovia. La actividad empieza al amanecer, cuando os reunir??is para iniciar el montaje e inflado del globo. Volar??is a primera hora del d??a, que es cuando el viento est?? m??s calmado, la atm??sfera m??s fr??a y estable y hay un marco rom??ntico incomparable. Una vez en tierra brindar??is con una copa de cava y volver??is en el 4x4 al punto de origen habi??ndose hecho entrega de un diploma acreditativo.

    ??A qu?? esper??is?',
    'Vuelo Rom??ntico en Globo con Cava, Almuerzo y Reportaje Fotos y V??deo HD',
    'Segovia',880.00,'Pareja',2,true,'2021-04-01','2022-09-30'),
    (33, 
    '??Te atreves a volar? Realiza ya tu Salto en Paraca??das en Castell??n y no esperes m??s. Podr??s surcar el cielo y contemplar el mundo tal y como lo ven los p??jaros.

    Con esta experiencia realizar??s un salto t??ndem de la mano de SkyTime. Esta empresa es el centro de paracaidismo m??s cercano a la playa y con mejor clima que se puede encontrar en Europa. Disfrutar??s de las vistas de la hermosa Costa Azahar como nunca lo hab??as hecho. Te lanzar??s al vac??o junto a un experimentado instructor que har?? de este salto una experiencia inolvidable.

    La actividad empezar?? con una breve explicaci??n de 10 minutos. Seguir?? con el ascenso en avi??n a 4000 metros de altura y, unido al instructor mediante un arn??s, disfrutar??s de una ca??da que durar?? aproximadamente unos 50 segundos, seguidos de 7 minutos de vuelo en paraca??das sobrevolando las costas de Castell??n.

    Atr??vete a dar el paso y l??nzate al vac??o. ??No esperes m??s!',
    'Salto en Paraca??das',
    'Castell??n',230.00,'Pareja',2,true,'2021-3-01','2022-08-31'),
    (34, 
    '??Quer??is desconectar del ajetreo del d??a a d??a y disfrutar de una experiencia relax en pareja? De vez en cuando es necesario tomarse unos instantes de descanso y para ello os ofrecemos esta escapada rom??ntica con spa en Toledo.

    Aprovechad la estancia para descubrir los encantos de esta ciudad que fue declarada Patrimonio de la Humanidad por la UNESCO en 1986. Una ciudad llena de cultura en la que podr??s encontrar varios lugares de inter??s como el Monasterio de San Juan de los Reyes o la Catedral de Santa Mar??a.

    En la actualidad se utilizan los efectos del agua para ofrecer diferentes terapias que favorecen nuestro bienestar. Para ayudaros a conseguir un estado de relajaci??n total dispondr??is de un circuito spa que os dejar?? como nuevos. Ideal para que recargu??is energ??as y viv??is unos irrepetibles momentos sumidos en verdadera paz y tranquilidad.

    ??A qu?? est??is esperando para vivir esta experiencia?',
    'Escapada Rom??ntica con Circuito Spa en Hotel Beatriz Toledo Auditorium & Spa 4*',
    'Toledo',110.00,'Pareja',2,true,'2021-01-01','2022-12-31'),
    (35, 
    '??Esta escapada rom??ntica en un Hotel con Spa en Albacete es el plan ideal si no encontr??is ning??n momento para estar solos! En el Hotel Beatriz Albacete & Spa podr??is vivir una noche muy especial.

    En el Hotel Beatriz Albacete & Spa disfrutar??is mucho de vuestra estancia. Para que os pod??is relajar lo mejor ser?? que vay??is al spa del hotel, el SPA & Wellness Center. Por otra parte, si quer??is explorar la ciudad de Albacete, hay muchos sitios que pod??is visitar. Os recomendamos que visit??is la catedral de la ciudad o el Pasaje de Lodares ??Recorred los rincones de la ciudad y descubrid todos sus secretos mientras pas??is una noche muy rom??ntica!

    Relajaos en el SPA & Wellness Center. Recorred las diferentes salas y ver??is que los chorros de agua, las cascadas y las ba??eras de hidromasaje os tranquilizan. Evad??os de toda preocupaci??n. A continuaci??n cenar??is en uno de los restaurantes que hay en el mismo hotel. Finalmente, Por si esto os parece poco, os alojar??is en una de las habitaciones dobles del hotel, redondeando de esta forma una noche que no querr??is olvidar.

    ??Regalaos una experiencia que no querr??is que termine!',
    'Escapada Rom??ntica con Circuito Spa, Hotel y Cena en Hotel Beatriz Albacete & Spa 4*',
    'Albacete',120.00,'Pareja',2,true,'2021-01-31','2022-12-31');
     
     `);

        console.log('Experiencias insertadas');
        await connection.query(`
        INSERT INTO photos (id, alt, url, id_experience) VALUES 
       (1, 'experience', 'cfb3a228-ad5f-408c-b70c-31311c6b203b.jpg', 1),
       (2, 'experience', 'df8b9784-5b04-4518-a79d-ff799609fcd9.jpg', 1),
       (3, 'experience', 'cc547760-9995-4fac-995d-8278c17f4ef0.jpg', 1),
       (4, 'experience', 'ffea2357-308a-4a8b-97ca-59d73b33dff2.jpg', 2),
       (5, 'experience', 'ef002bd5-3796-4a4c-9300-566b71094b10.jpg', 2),
       (6, 'experience', 'ef002bd5-3796-4a4c-9300-566b71094b10.jpg', 2),
       (7, 'experience', 'f72dbd01-c7ce-45b6-97fb-12da87ce83ed.jpg', 3),
       (8, 'experience', 'f5d0777a-f8a7-4650-a6f6-f91f02d6839c.jpg', 3),
       (9, 'experience', '742c0a30-74db-45d2-ab45-1f11270b76ce.jpg', 4),
       (10, 'experience', '02e3cc69-b869-4dce-a5de-52bf4aed29d6.jpg', 4),
       (11, 'experience', '286bc8c3-cbe5-4467-af00-65e08aa03e9d.jpg', 4), 
       (12, 'experience', '2973004e-4bb7-4ef4-b398-f3550e168a8a.jpg', 5), 
       (13, 'experience', 'ecc59dc3-223c-46bd-98b5-27540bbb58ec.jpg', 5),
       (14, 'experience', 'd215b84d-b1f2-4364-ace8-f8dbb56c6868.jpg', 5),
       (15, 'experience', 'e482cfbb-212e-46c7-a7cf-a32c25595851.jpg', 6),
       (16, 'experience', '084d4a96-ca70-487c-8649-b9525cb9c563.jpg', 6),
       (17, 'experience', '4c347a5d-d688-4f5b-bf66-af31e4ffc5f1.jpg', 6),
       (18, 'experience', '7054734f-e2b1-4d2c-919c-36c8b357258f.jpg', 6),
       (19, 'experience', '1614df62-db49-4fdd-8ce1-4a71c1bcf248.jpg', 7),
       (20, 'experience', '095d5f46-c6a0-4ee6-82c8-b83306d08e15.jpg', 7),
       (21, 'experience', '7cd32cd6-4a30-4fa4-a487-9dc6f7929e0e.jpg', 7),
       (22, 'experience', '208e38ea-7d47-4187-8fff-d99c55599edb.jpg', 7),
       (23, 'experience', '6e006e4b-d7a6-4041-8bc8-07ab954c338d.jpg', 8),
       (24, 'experience', '4b170bd9-bd7d-4584-9ae0-0196924afb43.jpg', 8),
       (25, 'experience', 'a4efab5a-97dd-42d1-9060-8d4ad13cb22b.jpg', 8),
       (26, 'experience', 'a1ea1e6d-4945-4adc-b113-4099c9ab7815.jpg', 9),
       (27, 'experience', '3c5c30c0-cba2-46f8-b6bb-cff7d2df320b.jpg', 9),
       (28, 'experience', '6037e45f-8b81-4843-856b-70625245b76b.jpg', 9),
       (29, 'experience', '935ca811-9e87-4894-ae60-2be55bd65c5f.jpg', 9),
       (30, 'experience', 'e8261079-8154-47c8-b7e5-72a09fd5182c.jpg', 9),
       (31, 'experience', '352e97ba-0c0b-4e77-bfbc-1e91309a10c1.jpg', 10),
       (32, 'experience', '760b8397-3cc3-48fb-9d8b-9da20039b414.jpg', 10),
       (33, 'experience', '3ce46fd3-9479-47ed-a66a-5265a726688d.jpg', 10),
       (34, 'experience', '37323247-0219-4fc9-85f8-9d8342fc2fe9.jpg', 11),
       (35, 'experience', '4b965d5f-b5ba-4831-8ce3-3e25c69c6802.jpg', 11),
       (36, 'experience', 'fe0206ea-fd81-45b6-9b24-450760c0bb93.jpg', 11),
       (37, 'experience', '87d13b01-e03c-4f08-9a21-62fb9b57ef6f.jpg', 12),
       (38, 'experience', '40ffb762-c230-47f1-848b-e4d394295a83.jpg', 12),
       (39, 'experience', '82a457eb-4848-4895-a49b-2bcb9a71697e.jpg', 12),
       (40, 'experience', 'bbe04231-746a-4a0a-b461-b33b54a0156f.jpg', 13),
       (41, 'experience', 'bbc0ab76-a8a3-4ba5-998d-b1d3eff3ee7c.jpg', 13),
       (42, 'experience', '07d6e461-7b5e-4293-974c-a42c619544bd.jpg', 13),
       (43, 'experience', '646ad259-6702-43f4-981b-1301f4b49ade.jpg', 14),
       (44, 'experience', 'cab1534c-6634-4920-a652-e34c855102cc.jpg', 14),
       (45, 'experience', '80115b8f-8ab8-4077-8c39-67bab83dab9f.jpg', 14),
       (46, 'experience', '63f9ecb9-c303-4a68-92e3-dacad7de50fa.jpg', 15),
       (47, 'experience', 'd8782b67-f168-4ab0-8ce4-9a5d9a1b83dc.jpg', 15),
       (48, 'experience', '03aaf0c4-d656-41ad-b3a8-3ac17c8458c9.jpg', 16),
       (49, 'experience', 'c516ec14-2616-425d-a6fb-b163979a0f52.jpg', 16),
       (50, 'experience', '097ae454-b070-4804-8fd2-bd26ddc0f85b.jpg', 16),
       (51, 'experience', 'f29a2487-accb-4217-b348-3ef5c099d680.jpg', 16),
       (52, 'experience', 'c6edb434-ef7f-48e2-92b5-497d3438c182.jpg', 17),
       (53, 'experience', '0475c581-304b-4030-9b3c-e262dd7ef2af.jpg', 17),
       (54, 'experience', '0303094e-d4b3-47fe-a247-e8d1a7ef94c5.jpg', 17),
       (55, 'experience', '72baba43-b701-46e5-85a3-15bead49e080.jpg', 18),
       (56, 'experience', 'cf46dd94-eb4a-41d9-aee5-f004516f881e.jpg', 18),
       (57, 'experience', '86643e03-8488-4132-97f5-1765c33114d3.jpg', 18),
       (58, 'experience', 'e3e48517-26de-4fb1-9d9c-17f41a337f1e.jpg', 18),
       (59, 'experience', 'a86fa35f-3376-4b25-9e2b-f8d889af8392.jpg', 19),
       (60, 'experience', '1f8bb85c-1ee7-49d9-8501-e744764bc73a.jpg', 19),
       (61, 'experience', '47726b2c-675a-4c07-aa8e-caa05ce8f3a2.jpg', 19),
       (62, 'experience', '85e9e3c5-53bf-42d8-a07d-029d86d2a577.jpg', 19),
       (63, 'experience', '9c5c45e9-ff3a-47ee-aec9-c91f6f4b51d5.jpg', 20),
       (64, 'experience', '56324e76-7de5-4303-a6ff-dc94b1b5b2b1.jpg', 20),
       (65, 'experience', '846a156b-5913-4324-8a54-a7f9d15d8738.jpg', 20),
       (66, 'experience', '210318da-9deb-41b1-b4d0-7c9ed2422b4e.jpg', 20),
       (67, 'experience', '97e9634e-9658-4174-a895-c0db47724d69.jpg', 21),
       (68, 'experience', 'edc17273-ad51-447f-abc5-2b0b81041f57.jpg', 21),
       (69, 'experience', 'fcf0d9a5-e8de-4995-8993-9cc30ee15b04.jpg', 21),
       (70, 'experience', 'bcab7c48-0d5e-4a26-b326-1d9fa8da7866.jpg', 21),
       (71, 'experience', '88b607f7-d373-4a4f-a41b-8b56f190ca42.jpg', 22),
       (72, 'experience', '90c49d2c-12c7-41ec-8045-88cfa311e090.jpg', 22),
       (73, 'experience', 'fb88491c-6b19-4989-a697-a664bc665a5e.jpg', 22),
       (74, 'experience', '3285ce0f-4cbf-494c-95f3-2276cd265cf5.jpg', 22),
       (75, 'experience', '079f6868-4e32-4cfe-9e15-95215eb8378e.jpg', 23),
       (76, 'experience', '33d4f41c-048c-42c8-8bc5-23db7f860edd.jpg', 23),
       (77, 'experience', 'b8ad74fd-8a4b-49ec-9c76-f0706957747d.jpg', 23),
       (78, 'experience', '1b7d3688-ab71-4c67-bc30-07ce22d8b720.jpg', 23),
       (79, 'experience', '1adc5c43-4e6e-47c0-b00e-b38ce9d5ca74.jpg', 23),
       (80, 'experience', 'e3dbc86c-19c1-4b69-bc53-64049dfe1a89.jpg', 24),
       (81, 'experience', '8ea18bbd-f8da-4527-aff3-a3b750549216.jpg', 24),
       (82, 'experience', '48c725b0-9cef-41ba-adc6-496af074d53a.jpg', 24),
       (86, 'experience', 'e0331c0e-628d-4495-bac7-39879a043e50.jpg', 25),
       (87, 'experience', 'cabd2c1c-12b3-4f5a-b6dd-191da6821965.jpg', 25),
       (88, 'experience', '3f5fa4d9-916c-422d-baa0-9f0a736a68d5.jpg', 25),
       (89, 'experience', 'bb93a4d6-d4b6-46c2-be9b-4ca5d71b7f5c.jpg', 26),
       (90, 'experience', '6f51e057-c463-4191-be86-53839173f213.jpg', 26),
       (91, 'experience', '983da997-7023-4522-99f5-60c8e8f935fc.jpg', 26),
       (92, 'experience', 'c872246f-5dfb-4680-81d7-7137e705e0cc.jpg', 27),
       (93, 'experience', 'bae4dcb8-8217-4d0e-8fc6-922306873e63.jpg', 27),
       (94, 'experience', '5769c967-ce9c-48fe-a40e-e18b4bdf599c.jpg', 27),
       (95, 'experience', 'c397aab3-2142-419d-a6f0-943af611a5ab.jpg', 28),
       (96, 'experience', '90016ba5-3ef3-48dc-b113-71085658775f.jpg', 28),
       (97, 'experience', 'f8694f3d-ac6e-4499-8232-5fac991d7abf.jpg', 28),
       (98, 'experience', '881e3c43-4581-44e3-b29e-6856dc06a945.jpg', 28),
       (99, 'experience', '094e348e-65d5-437b-a6bd-afcf33b051e1.jpg', 29),
       (100, 'experience', 'f7423740-2473-4c79-b1d4-7c39c37cf50d.jpg', 29),
       (101, 'experience', '1c48912a-2022-4cd9-9224-073e1aecc7d5.jpg', 30),
       (102, 'experience', '4ec11ccd-16c7-4baf-85c9-807ce552808c.jpg', 30),
       (103, 'experience', '04438e1a-9d9c-4b9b-ba2d-53bcb249d406.jpg', 30),
       (104, 'experience', '4252ead0-b6e4-493a-91c3-3ab98f347deb.jpg', 31),
       (105, 'experience', 'a523ba8f-f66e-4c86-9d59-b9f4d5e8fc8a.jpg', 31),
       (106, 'experience', 'fee7a6ba-6e8d-4a37-ba1d-41ace3101460.jpg', 31),
       (107, 'experience', 'ec59f1b8-ff0a-4d5a-ae56-00b9a46580f8.jpg', 31),
       (108, 'experience', 'd9dc3bf3-0dbb-4568-af78-0a82ecb6e7f0.jpg', 32),
       (109, 'experience', 'c7b0e9ac-88da-4fef-b346-cdba27cadda0.jpg', 32),
       (110, 'experience', '674be0c0-3aad-4689-b700-72f9eb9cef85.jpg', 32),
       (111, 'experience', '8694fadf-94e0-4d2f-ac38-73e8a381682c.jpg', 32),
       (112, 'experience', '2c4aae67-82cf-44de-ac97-598b965dd251.jpg', 32),
       (113, 'experience', 'df7b748b-4a43-4572-bab7-99ecdb55f174.jpg', 33),
       (114, 'experience', '60d81028-b47e-40d7-9679-8e49193e2c14.jpg', 33),
       (115, 'experience', 'ecf27b57-5056-4434-a350-12ff196b73c8.jpg', 34),
       (116, 'experience', '3526312c-22da-4d70-9406-1fa6df60c1ff.jpg', 34),
       (117, 'experience', 'a8592d50-dd6a-40a9-bcac-eefc8629d001.jpg', 34),
       (118, 'experience', '57f24dc8-927b-4a8b-886e-b432ba41281d.jpg', 34),
       (119, 'experience', '3ad99cfe-e757-4783-8405-51769b481ee4.jpg', 35),
       (120, 'experience', '8ed6ba48-dbef-447b-88fb-012aa7fc0d46.jpg', 35),
       (121, 'experience', 'b53d7353-8a02-47f3-a994-ab899999d103.jpg', 35);
`);
        console.log('Fotos insertadas');

        await connection.query(`
          INSERT INTO bookings (id, cantidad, fecha_reserva,fecha_compra, precio_total, estado, valoracion, comentario, id_user, id_experience) VALUES 
          (1,1,'2021-07-16','2021-03-25',80.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,1),
          (2,2,'2021-03-10','2021-02-25',160.00,true,null,null,2,1),
          (3,1,'2021-07-16','2021-01-20',80.00,true,5,'Estupendo, buen trato, repetir??a',1,1),
          (4,2,'2021-10-15','2021-05-14',170.00,true,null,null,1,2),
          (5,1,'2021-11-10','2021-05-25',85.00,true,null,null,3,2),
          (6,2,'2021-12-16','2021-03-25',170.00,true,null,null,4,2),
          (7,2,'2021-04-16','2021-03-25',100.00,true,null,null,5,3),
          (8,2,'2021-04-16','2021-03-25',100.00,true,null,'Estupendo, buen trato, repetir??a',2,3),
          (9,2,'2021-04-16','2021-03-25',100.00,true,4,'Me ha gustado mucho',1,3),
          (10,1,'2021-04-16','2021-03-25',160.00,true,null,null,3,4),
          (11,1,'2021-04-16','2021-03-25',160.00,true,1,'No me gusto nada',5,4),
          (12,1,'2021-04-16','2021-03-25',160.00,true,3,null,2,4),
          (13,1,'2021-04-16','2021-03-25',150.00,true,null,null,1,5),
          (14,1,'2021-04-16','2021-03-25',150.00,true,3,null,2,5),
          (15,1,'2021-04-16','2021-03-25',150.00,true,1,'Una autentica verg??enza',3,5),
          (16,1,'2021-04-16','2021-03-25',75.00,true,4,'Muy bien todo',1,6),
          (17,1,'2021-04-16','2021-03-25',75.00,true,3,'Un poco corto pero bien',5,6),
          (18,1,'2021-04-16','2021-03-25',75.00,true,5,'Alucinaaaaaaaaaante',3,6),
          (19,1,'2021-04-16','2021-03-25',60.00,true,4,'Muy bien el trato ',1,7),
          (20,1,'2021-04-16','2021-03-25',60.00,true,4,'Repetiria si o si',4,7),
          (21,1,'2021-04-16','2021-03-25',60.00,true,5,'Genial todo , muy bueno',5,7),
          (22,1,'2021-04-16','2021-03-25',35.00,true,4,'Muy bien el trato',1,8),
          (23,1,'2021-04-16','2021-03-25',35.00,true,5,'Repetiria si o si',2,8),
          (24,1,'2021-04-16','2021-03-25',35.00,true,null,'Una autentica verg??enza',3,8),
          (25,1,'2021-04-16','2021-03-25',25.00,true,4,'Ha estado genial',5,9),
          (26,2,'2021-04-16','2021-03-25',50.00,true,3,'Una autentica verg??enza',1,9),
          (27,1,'2021-04-16','2021-03-25',25.00,true,4,'Ha estado genial',4,9),
          (28,1,'2021-04-16','2021-03-25',42.00,true,4,'Ha estado genial',1,10),
          (29,1,'2021-04-16','2021-03-25',42.00,true,5,'Ha estado genial',2,10),
          (30,1,'2021-04-16','2021-03-25',42.00,true,5,'Ha estado genial',4,10),
          (31,1,'2021-04-16','2021-03-25',30.00,true,1,'Una autentica verg??enza',4,11),
          (32,1,'2021-04-16','2021-03-25',30.00,true,2,'Una autentica verg??enza',2,11),
          (33,1,'2021-04-16','2021-03-25',30.00,true,2,'Una autentica verg??enza',1,11),
          (34,1,'2021-04-16','2021-03-25',35.00,true,4,'Ha estado genial',1,12),
          (35,1,'2021-04-16','2021-03-25',35.00,true,null,'Repetiria si o si',5,12),
          (36,1,'2021-04-16','2021-03-25',35.00,true,2,'Una autentica verg??enza',3,12),
          (37,1,'2021-04-16','2021-03-25',60.00,true,2,'Una autentica verg??enza',4,13),
          (38,1,'2021-04-16','2021-03-25',60.00,true,1,'Una autentica verg??enza',2,13),
          (39,1,'2021-04-16','2021-03-25',60.00,true,3,'Ha estado genial',5,13),
          (40,1,'2021-04-16','2021-03-25',40.00,true,null,'Una autentica verg??enza',4,14),
          (41,1,'2021-04-16','2021-03-25',40.00,true,1,'Una autentica verg??enza',2,14),
          (42,1,'2021-04-16','2021-03-25',40.00,true,3,'Ha estado genial',5,14),
          (43,1,'2021-04-16','2021-03-25',20.00,true,4,'Muy bien todo',1,15),
          (44,1,'2021-04-16','2021-03-25',20.00,true,3,'Un poco corto pero bien',5,15),
          (45,1,'2021-04-16','2021-03-25',20.00,true,5,'Alucinaaaaaaaaaante',3,15),
          (46,1,'2021-04-16','2021-03-25',108.00,true,null,'Ha estado genial',1,16),
          (47,1,'2021-04-16','2021-03-25',108.00,true,5,'Repetiria si o si',5,16),
          (48,1,'2021-04-16','2021-03-25',108.00,true,2,'Una autentica verg??enza',3,16),
          (49,1,'2021-04-16','2021-03-25',134.00,true,4,null,1,17),
          (50,1,'2021-04-16','2021-03-25',134.00,true,3,null,2,17),
          (51,1,'2021-04-16','2021-03-25',134.00,true,1,'Una autentica verg??enza',3,17),
          (52,1,'2021-04-16','2021-03-25',60.00,true,4,'Ha estado genial',1,18),
          (53,1,'2021-04-16','2021-03-25',60.00,true,5,'Repetiria si o si',5,18),
          (54,1,'2021-04-16','2021-03-25',60.00,true,2,'Una autentica verg??enza',3,18),
          (55,1,'2021-07-16','2021-03-25',148.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,19),
          (56,2,'2021-03-10','2021-02-25',296.00,true,2,null,2,19),
          (57,1,'2021-07-16','2021-01-20',148.00,true,5,'Estupendo, buen trato, repetir??a',1,19),
          (58,1,'2021-04-16','2021-03-25',41.00,true,4,'Muy bien todo',1,20),
          (59,1,'2021-04-16','2021-03-25',41.00,true,3,'Un poco corto pero bien',5,20),
          (60,1,'2021-04-16','2021-03-25',41.00,true,5,'Alucinaaaaaaaaaante',3,20),
          (61,1,'2021-04-16','2021-03-25',20.00,true,4,'Muy bien todo',1,21),
          (62,1,'2021-04-16','2021-03-25',20.00,true,3,'Un poco corto pero bien',5,21),
          (63,1,'2021-04-16','2021-03-25',20.00,true,5,'Alucinaaaaaaaaaante',3,21),
          (64,1,'2021-07-16','2021-03-25',22.50,true,4,'Muy divertido, me lo pase genial, repetiria.',3,22),
          (65,1,'2021-03-10','2021-02-25',22.50,true,2,null,2,22),
          (66,1,'2021-07-16','2021-01-20',22.50,true,5,'Estupendo, buen trato, repetir??a',1,22),
          (67,1,'2021-04-16','2021-03-25',36.00,true,4,'Muy bien todo',1,23),
          (68,1,'2021-04-16','2021-03-25',36.00,true,3,'Un poco corto pero bien',5,23),
          (69,1,'2021-04-16','2021-03-25',36.00,true,5,'Alucinaaaaaaaaaante',3,23),
          (70,1,'2021-04-16','2021-03-25',18.00,true,1,'Una autentica verg??enza',4,24),
          (71,1,'2021-04-16','2021-03-25',18.00,true,2,'Una autentica verg??enza',2,24),
          (72,1,'2021-04-16','2021-03-25',18.00,true,2,'Una autentica verg??enza',1,24),
          (73,1,'2021-04-16','2021-03-25',65.00,true,4,'Muy bien todo',1,25),
          (74,1,'2021-04-16','2021-03-25',65.00,true,3,'Un poco corto pero bien',5,25),
          (75,1,'2021-04-16','2021-03-25',65.00,true,5,'Alucinaaaaaaaaaante',3,25),


          (76,1,'2021-07-16','2021-03-25',179.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,26),
          (77,1,'2021-03-10','2021-02-25',179.00,true,2,null,2,26),
          (78,1,'2021-07-16','2021-01-20',179.00,true,5,'Estupendo, buen trato, repetir??a',1,26),

          (79,1,'2021-07-16','2021-03-25',179.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,27),
          (80,1,'2021-03-10','2021-02-25',179.00,true,2,null,2,27),
          (81,1,'2021-07-16','2021-01-20',179.00,true,5,'Estupendo, buen trato, repetir??a',1,27),
          
          (82,1,'2021-07-16','2021-03-25',249.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,28),
          (83,1,'2021-03-10','2021-02-25',249.00,true,2,null,2,28),
          (84,1,'2021-07-16','2021-01-20',249.00,true,5,'Estupendo, buen trato, repetir??a',1,28),

          (85,1,'2021-04-16','2021-03-25',119.00,true,1,'Una autentica verg??enza',4,29),
          (86,1,'2021-04-16','2021-03-25',119.00,true,2,'Una autentica verg??enza',2,29),
          (87,1,'2021-04-16','2021-03-25',119.00,true,2,'Una autentica verg??enza',1,29),

          (88,1,'2021-07-16','2021-03-25',49.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,30),
          (89,1,'2021-03-10','2021-02-25',49.00,true,2,null,2,30),
          (90,1,'2021-07-16','2021-01-20',49.00,true,5,'Estupendo, buen trato, repetir??a',1,30),

          (91,1,'2021-07-16','2021-03-25',49.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,31),
          (92,1,'2021-03-10','2021-02-25',49.00,true,2,null,2,31),
          (93,1,'2021-07-16','2021-01-20',49.00,true,5,'Estupendo, buen trato, repetir??a',1,31),


          (94,1,'2021-04-16','2021-03-25',880.00,true,4,null,1,32),
          (95,1,'2021-04-16','2021-03-25',880.00,true,3,null,2,32),
          (96,1,'2021-04-16','2021-03-25',880.00,true,1,'El precio es una burrada',3,32),


          (97,1,'2021-07-16','2021-03-25',230.00,true,4,'Muy divertido, me lo pase genial, repetiria.',3,33),
          (98,1,'2021-03-10','2021-02-25',230.00,true,2,null,2,33),
          (99,1,'2021-07-16','2021-01-20',230.00,true,5,'Estupendo, buen trato, repetir??a',1,33),

          (100,1,'2021-04-16','2021-03-25',110.00,true,null,'Ha estado genial',1,34),
          (101,1,'2021-04-16','2021-03-25',110.00,true,5,'Repetiria si o si',5,34),
          (102,1,'2021-04-16','2021-03-25',110.00,true,2,'Una autentica verg??enza',3,34),

          (103,1,'2021-04-16','2021-03-25',120.00,true,4,null,1,35),
          (104,1,'2021-04-16','2021-03-25',120.00,true,3,null,2,35),
          (105,1,'2021-04-16','2021-03-25',120.00,true,1,null,3,35);
          

      `);

        console.log('Reservas insertadas');
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
};

initDB();
