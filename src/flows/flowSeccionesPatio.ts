import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

export const flowSeccionesPatio = addKeyword<Provider, Database>('Secciones patio')
.addAnswer('Los residuos de patio se recogen una vez al mes y según las secciones de nuestra ciudad', {delay: 4000})
.addAnswer(['Sección 1 ➡️ 1ra semana del mes',
            'Sección 2 ➡️ 2da semana del mes',
            'Sección 3 ➡️ 3ra semana del mes',
            'Sección 4 ➡️ 4ta semana del mes'])
.addAction(async (ctx, { provider }) => {
    const id = ctx.from;
    return provider.sendImage(id, 'src/media/secciones.png', 'Acá podes ver cuál es tu sección 🗺️');

})
.addAnswer(['*📢 Información importante*',
            'Sacá los residuos la semana previa a que inicie la recolección en tu sección. Si los sacas cuando ya estamos recolectando en tu sección, es probable que hayamos pasado y los podamos buscar recién dentro de tres semanas 🚮'])