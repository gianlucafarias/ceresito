import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowCrearReclamo } from '../crearReclamo'
import { flowConsultar } from './flowConsultar'
import { startInactividad, resetInactividad, stopInactividad,
} from '~/utils/idle'
import { flowAyuda } from '../flowAyuda'
import flowMenu from '../flowMenu'

let errores = 0;
export const flowReclamos = addKeyword<Provider, Database>(['Quiero hacer un reclamo','012'])
.addAnswer('Queremos que Ceres esté cada vez más linda. 🌈 \n\nPor eso, si ves algo que necesite arreglo o se pueda mejorar, podés mandar un reclamo desde acá.')

.addAnswer('Si querés hacer un reclamo, seleccioná la primera opción. Si ya realizaste uno y querés ver el estado en el que se encuentra, pulsá en la opción dos.', {
    buttons: [
        {body: 'Crear reclamo'},
        {body: 'Ver mi reclamo'},
        {body: 'Volver atrás'}
    ]
})
.addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
    const opcion = ctx.body.toLowerCase().trim();
    console.log(opcion)
    if (!['crear reclamo', 'ver mi reclamo', 'volver atrás'].includes(opcion)) {
        errores++;
        resetInactividad(ctx, gotoFlow, 90000)
            if (errores > 2 )
            {
                stopInactividad(ctx)
                return gotoFlow(flowAyuda);

            }
        await flowDynamic('No te entiendo 😢 Necesitas ayuda? Escribí la palabra *Menú* para volver a empezar')
    }
    switch (opcion) {
    case 'crear reclamo': {
        stopInactividad(ctx)
        return gotoFlow(flowCrearReclamo)
    }
    case 'ver mi reclamo': {
        stopInactividad(ctx)
        return gotoFlow(flowConsultar)
    }
    case 'volver atrás': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    }

})