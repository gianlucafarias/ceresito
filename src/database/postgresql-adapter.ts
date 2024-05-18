import pg from 'pg';
import {PoolClient as PoolClientType} from 'pg';
const { Pool, PoolClient, QueryResult } = pg;

interface Credentials {
  host: string;
  user: string;
  database: string;
  password: string | null;
  port: number;
}

interface Context {
  ref: string;
  keyword: string;
  answer: string;
  refSerialize: string;
  from: string;
  options: any;
  action?: 'u' | 'a';
  values?: any;
}

const credentials: Credentials = {
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    user: process.env.POSTGRES_DB_USER || 'tu_usuario',
    database: process.env.POSTGRES_DB_NAME || 'nombre_de_la_base_de_datos',
    password: process.env.POSTGRES_DB_PASSWORD || 'tu_contraseña',
    port: +process.env.POSTGRES_DB_PORT || 5432,
  };

export class PostgreSQLAdapter {
  private db: PoolClientType | undefined;
  private listHistory: Context[] = [];
  private credentials: Credentials = credentials

  constructor(_credentials: Credentials) {
    this.credentials = _credentials;
    this.init().then();
  }

  init = async () => {
    try {
        const pool = new Pool(this.credentials);
        const db = await pool.connect();
        this.db = db;
        console.log('🆗 Conexión Correcta DB');
        this.checkTableExistsAndSP();
        return true
    } catch (e) {
        console.log('Error', e);
        return
    }
}

insertarNombresFlujos = async () => {
    const nombresFlujos = [
        'Tramites',
        'Licencias',
        'Cic',
        'Turismo',
        'Historia',
        'Residuos',
        'Educacion',
        'AdultosMayores',
        'Dengue',
        'Ceresito',
        'Reclamo',
        'Genero',
        'Congreso'
    ];

    const insertQuery = 'INSERT INTO visitas_flujo (nombre_flujo) VALUES ($1)';
    try {
        for (const nombreFlujo of nombresFlujos) {
            await this.db.query(insertQuery, [nombreFlujo]);
        }
        console.log('🆗 Nombres de flujos insertados con éxito en la tabla visitas_flujo');
    } catch (error) {
        console.error('🚫 Error al insertar los nombres de flujos:', error);
    }
}

getPrevByNumber = async (from) => {
    const query = `SELECT * FROM public.history WHERE phone = $1 ORDER BY created_at DESC LIMIT 1`;
    try {
        const result = await this.db.query(query, [from]);
        const row = result.rows[0];

        if (row) {
            row['refSerialize'] = row.refserialize;
            delete row.refserialize;
        }

        return row
    } catch (error) {
        console.error('Error al obtener la entrada anterior por número:', error);
        throw error
    }
}

save = async (ctx) => {
    const values = [ctx.ref, ctx.keyword, ctx.answer, ctx.refSerialize, ctx.from, JSON.stringify(ctx.options)];
    const query = `SELECT save_or_update_history_and_contact($1, $2, $3, $4, $5, $6)`;

    try {
        await this.db.query(query, values);
        console.log('🆗 Historico creado con exito');
    } catch (error) {
        console.error('Error al registrar la entrada del historial:', error);
    }
    this.listHistory.push(ctx);
}

getContact = async (ctx) => {
    const from = ctx.from;
    const query = `SELECT * FROM public.contact WHERE phone = $1 LIMIT 1`;
    try {
        const result = await this.db.query(query, [from]);
        return result.rows[0]
    } catch (error) {
        console.error('Error al obtener contacto por número:', error);
        throw error
    }
}

saveContact = async (ctx) => {
    // action: u (Actualiza el valor de ctx.values), a (Agrega). Agrega por defecto.
    const _contact = await this.getContact(ctx);
    let jsValues = {};

    if ((ctx?.action ?? 'a') === 'a') {
        jsValues = { ..._contact.values, ...(ctx?.values ?? {}) };
    } else {
        jsValues = ctx?.values ?? {};
    }

    const values = [ctx.from, JSON.stringify(jsValues)];
    const query = `SELECT save_or_update_contact($1, $2)`;

    try {
        await this.db.query(query, values);
        console.log('🆗 Contacto guardado o actualizado con éxito');
    } catch (error) {
        console.error('🚫 Error al guardar o actualizar contacto:', error);
        throw error
    }
}

consultarIntentosUsuario = async (numeroUsuario) => {
    const query = 'SELECT attempts FROM contact WHERE phone = $1';
    try {
        const result = await this.db.query(query, [numeroUsuario]);
        if (result.rows.length > 0) {
            return result.rows[0].attempts;
        } else {
            // Si el usuario no existe en la base de datos, devolver null o un valor predeterminado
            return null;
        }
    } catch (error) {
        console.error('Error al consultar intentos del usuario:', error);
        throw error;
    }
}

contadorFlujos = async (idFlujo) => {
    const updateQuery = 'UPDATE visitas_flujo SET contador = contador + 1 WHERE id = $1';
    try {
        await this.db.query(updateQuery, [idFlujo]);
        console.log(`🆗 Contador del flujo ${idFlujo} incrementado con éxito`);
    } catch (error) {
        console.error('🚫 Error al incrementar el contador del flujo:', error);
    }
}

async ingresarDatos(reclamoData) {
    const { fecha, nombre, reclamo, ubicacion, barrio, telefono, estado, detalle, latitud, longitud } = reclamoData;

    const insertQuery = `
        INSERT INTO reclamos (fecha, nombre, reclamo, ubicacion, barrio, telefono, estado, detalle, latitud, longitud)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [fecha, nombre, reclamo, ubicacion, barrio, telefono, estado, detalle, latitud, longitud];

    try {
        await this.db.query(insertQuery, values);
        console.log('🆗 Reclamo ingresado con éxito en la tabla reclamos');
    } catch (error) {
        console.error('🚫 Error al ingresar el reclamo en la tabla reclamos:', error);
        throw error;
    }
}

async obtenerReclamoPorTelefono(telefono) {
    try {
        // Realiza una consulta SQL para obtener el reclamo según el número de teléfono
        const query = `
                SELECT TO_CHAR(fecha, 'DD/MM/YYYY HH24:MI:SS') AS fecha, nombre, reclamo, ubicacion, barrio, estado 
                FROM reclamos 
                WHERE telefono = $1
                ORDER BY fecha DESC
                LIMIT 1
        `;
        const values = [telefono];

        // Ejecuta la consulta y espera el resultado
        const result = await this.db.query(query, values);

        // Devuelve el primer reclamo encontrado (si lo hay)
        return result.rows[0];
    } catch (error) {
        // Maneja cualquier error que ocurra durante la consulta
        console.error('Error al obtener el reclamo por teléfono:', error);
        throw error;
    }
}



async ingresarDatosConversacion(nombre, telefono, duracionFormateada) {
    const insertQuery = `
        INSERT INTO conversaciones (nombre, telefono, duracion_minutos)
        VALUES ($1, $2, $3)
    `;
    const values = [nombre, telefono, duracionFormateada];

    try {
        await this.db.query(insertQuery, values);
        console.log('🆗 Conversación ingresada con éxito en la tabla conversaciones');
    } catch (error) {
        console.error('🚫 Error al ingresar la conversación en la tabla conversaciones:', error);
        throw error;
    }
}
checkTableExistsAndSP = async () => {
    const contact = `
        CREATE TABLE IF NOT EXISTS contact (
            id SERIAL PRIMARY KEY,
            phone VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT current_timestamp,
            updated_in TIMESTAMP,
            last_interaction TIMESTAMP,
            values JSONB,
            attempts INTEGER DEFAULT 0
        )`;

    try {
        await this.db.query(contact);
        console.log('🆗 Tabla contact existe o fue creada con éxito');
    } catch (error) {
        console.error('🚫 Error al crear la tabla contact:', error);
    }

    const history = `
        CREATE TABLE IF NOT EXISTS history (
            id SERIAL PRIMARY KEY,
            ref VARCHAR(255) NOT NULL,
            keyword VARCHAR(255),
            answer TEXT NOT NULL,
            refSerialize TEXT NOT NULL,
            phone VARCHAR(255) NOT NULL,
            options JSONB,
            created_at TIMESTAMP DEFAULT current_timestamp,
            updated_in TIMESTAMP,
            contact_id INTEGER REFERENCES contact(id)
        )`;
    try {
        await this.db.query(history);
        console.log('🆗 Tabla history existe o fue creada con éxito');
    } catch (error) {
        console.error('🚫 Error al crear la tabla de history:', error);
    }

    const reclamos = `
        CREATE TABLE IF NOT EXISTS reclamos (
            id SERIAL PRIMARY KEY,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            nombre VARCHAR(255),
            reclamo VARCHAR(255),
            ubicacion TEXT,
            barrio VARCHAR(255),
            telefono VARCHAR(255),
            estado VARCHAR(50) DEFAULT 'PENDIENTE',
            detalle VARCHAR(255)
        )`;
        try {
            await this.db.query(reclamos);
            console.log('🆗 Tabla reclamos existe o fue creada con éxito');
        } catch (error) {
            console.error('🚫 Error al crear la tabla de reclamos:', error);
        }

    const visitas_flujo = `
    CREATE TABLE IF NOT EXISTS visitas_flujo (
        id SERIAL PRIMARY KEY,
        nombre_flujo VARCHAR(255) NOT NULL UNIQUE,
        contador INTEGER NOT NULL DEFAULT 0
    )`;
try {
    await this.db.query(visitas_flujo);
    await this.insertarNombresFlujos();
    console.log('🆗 Tabla visitas_flujo existe o fue creada con éxito');
} catch (error) {
    console.error('🚫 Error al crear la tabla de visitas_flujo:', error);
}

const conversaciones = `
CREATE TABLE IF NOT EXISTS conversaciones (
    id SERIAL PRIMARY KEY,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nombre VARCHAR(255),
    telefono VARCHAR(255),
    duracion_minutos VARCHAR(255)
)`;
try {
    await this.db.query(conversaciones);
    console.log('🆗 Tabla conversaciones existe o fue creada con éxito');
} catch (error) {
    console.error('🚫 Error al crear la tabla de conversaciones:', error);
}

    await this.createSP();
}



createSP = async () => {
    const sp_suc = `
    CREATE OR REPLACE FUNCTION save_or_update_contact(
        in_phone VARCHAR(255),
        in_values JSONB
    )
    RETURNS VOID AS
    $$
    DECLARE
        contact_cursor refcursor := 'cur_contact';
        contact_id INT;
    BEGIN
        SELECT id INTO contact_id FROM contact WHERE phone = in_phone;
    
        IF contact_id IS NULL THEN
            INSERT INTO contact (phone, "values")
            VALUES (in_phone, in_values);
        ELSE
            UPDATE contact SET "values" = in_values, updated_in = current_timestamp
            WHERE id = contact_id;
        END IF;
    END;
    $$ LANGUAGE plpgsql;`;

    try {
        await this.db.query(sp_suc);
        console.log('🆗 Procedimiento almacenado de contacto existe o fue creada con éxito');
    } catch (error) {
        console.error('🚫 Error al crear el procedimiento almacenado de contacto:', error);
    }

    const sp_suhc = `
    CREATE OR REPLACE FUNCTION save_or_update_history_and_contact(
        in_ref VARCHAR(255),
        in_keyword VARCHAR(255),
        in_answer TEXT,
        in_refserialize TEXT,
        in_phone VARCHAR(255),
        in_options JSONB
    )
    RETURNS VOID AS
    $$
    DECLARE
        _contact_id INT;
    BEGIN
        SELECT id INTO _contact_id FROM contact WHERE phone = in_phone;
    
        IF _contact_id IS NULL THEN
            INSERT INTO contact (phone)
            VALUES (in_phone)
            RETURNING id INTO _contact_id;
        ELSE
            UPDATE contact SET last_interaction = current_timestamp WHERE id = _contact_id;
        END IF;
    
        INSERT INTO history (ref, keyword, answer, refserialize, phone, options, contact_id, created_at)
        VALUES (in_ref, in_keyword, in_answer, in_refserialize, in_phone, in_options, _contact_id, current_timestamp);
    
    END;
    $$ LANGUAGE plpgsql;`;

    try {
        await this.db.query(sp_suhc);
        console.log('🆗 Procedimiento almacenado de historico existe o fue creada con éxito');
    } catch (error) {
        console.error('🚫 Error al crear el procedimiento almacenado de historico:', error);
    }

    const sp_attempt_increment = `
        CREATE OR REPLACE FUNCTION increment_contact_attempts(
            in_phone VARCHAR(255)
        )
        RETURNS VOID AS
        $$
        BEGIN
            UPDATE contact SET attempts = attempts + 1 WHERE phone = in_phone;
        END;
        $$ LANGUAGE plpgsql;`;

        try {
            await this.db.query(sp_attempt_increment);
            console.log('🆗 Función para incrementar intentos de contacto creada con éxito');
        } catch (error) {
            console.error('🚫 Error al crear la función para incrementar intentos de contacto:', error);
    }
}
}