import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowLlamarMenu } from './flowLlamarMenu';
import { flowAyuda } from './flowAyuda';

const diasSemana = ["*Domingo*", "*Lunes*", "*Martes*", "*Miércoles*", "*Jueves*", "*Viernes*", "*Sábado*"];
const diaActual = new Date().getDay(); // Obtener el día de la semana actual (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
const diaSemana = diasSemana[diaActual];


export const flowResiduosDia = addKeyword<Provider, Database>(['que residuos saco hoy?'])
.addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow,  }) => {

stopInactividad(ctx)
switch (diaActual) {
    case 0: {  // Domingo
        await flowDynamic("Hoy es Domingo, los residuos no se recogen hoy. Pero podes sacar tus residuos humedos esta noche para que sean recolectados.", {delay: 2000});
        break;
    }
    case 1:  {  // Lunes
        await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
        break;
    }
        
    case 3:  { // Miércoles
        await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
        break;
    }
        
    case 4:  {// Jueves
        await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
        break;
    }
        
    case 6: { // Sábado
        await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
        break;
    }
    
    case 2: { // Martes
        await flowDynamic("Los días " + diaSemana + " se recogen *residuos secos*. ", {delay: 2000});
        break;
    }  
        
    case 5: {  // Viernes
        await flowDynamic("Los días " + diaSemana + " se recogen *residuos secos*. ", {delay: 2000});
        break;
    }
    
}
await flowDynamic('*Algo muy importante: ¡no dejes tus residuos en los pilares de luz porque no podremos recogerlos!*', {delay: 2000});      
return gotoFlow(flowLlamarMenu)   

})