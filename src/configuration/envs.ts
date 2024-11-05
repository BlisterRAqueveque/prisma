// Importamos las dependencias
import 'dotenv/config';
import * as joi from 'joi';
// Creamos una interfaz que se encargue de
// mejorar el tipado de nuestro código
interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  JWT_SEED: string;
}
// Configuramos el esquema de JOI
const envsSchema = joi
  .object({
    PORT: joi.number().required(), // Le damos su tipo y si es requerido
    DATABASE_URL: joi.string().required(),
    JWT_SEED: joi.string().required(),
  })
  .unknown(true);
// Lo validamos, nos puede devolver 2 cosas:
// 1. Un error
// 2. Las variables
const { error, value } = envsSchema.validate(process.env);
// Si existe el error, cortamos la ejecución del servidor, y mostramos el mensaje
if (error) throw new Error(`Config validation error: ${error.message}`);
// Si vino el valor, lo guardamos en una variable que va a ser del tipo creado
const envVars: EnvVars = value;
// Para terminar, exportamos:
export const envs = {
  port: envVars.PORT,
  database_url: envVars.DATABASE_URL,
  jwt_seed: envVars.JWT_SEED,
};
