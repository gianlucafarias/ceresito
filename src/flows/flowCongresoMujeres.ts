import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

export const flowCongresoMujeres = addKeyword<Provider, Database>('congreso de mujeres lideres')
.addAnswer('Si querés inscribirte en este evento único o conocer más sobre el Congreso, seleccioná alguna de las tres opciones 👇',{
    buttons: [
    {body: '✍️ Inscripción'},
    {body: '💜 Programa'},
    {body: '🤳 Redes del Congreso'},
]}
)