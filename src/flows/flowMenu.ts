import { addKeyword, EVENTS } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'

import { flowDengue } from './flowDengue';
import { flowAdultosmayores } from './flowAdultosmayores';
import flowEducacion from './flowEducacion';
import { flowResiduos } from './flowResiduos';
import { flowTurismo } from './flowTurismo';
import flowLicencias from './flowLicencias';
import  flowTramites  from './flowTramites';
import { flowAyuda } from './flowAyuda';
import { flowCeresito } from './flowCeresito';
import { flowReclamos } from './reclamo/flowReclamos';
import { flowSalud } from './flowSalud';
import { flowCongresoMujeres } from './flowCongresoMujeres';
import { flowInscripcionPoda } from './flowInscripcionPoda';
import { flowCertificado } from './flowCertificado';
import { flowPoda } from './flowPoda';
import { flowColectividades } from './flowColectividades';

let errores = 0;
const  flowMenu = addKeyword(["menu", "menú"])
.addAction(async (ctx, { gotoFlow }) => {
    startInactividad(ctx, gotoFlow, 1600000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
})   
.addAction({delay: 2000}, async (ctx, { provider, flowDynamic }) => {
await flowDynamic('No soy un superhéroe pero puedo ayudarte de muchas maneras 🦸‍♀️',{delay: 3000} )

    const list = {
        "body": {
            "text": "Contame, ¿sobre que necesitas saber?\nElegí una opción de este menú 👇"
        },
        "action": {
            "button": "Opciones",
            "sections": [
                {
                    "title": "Elegí una opción",
                    "rows": [
                        {
                            "id": "001",
                            "title": "Trámites 🗃️",
                        },
                        {
                            "id": "002",
                            "title": "Licencias 🪪",
                        },
                        {
                            "id": "003",
                            "title": "Salud",
                        },
                        {
                            "id": "004",
                            "title": "Turismo 📸",
                        },
                        {
                            "id": "005",
                            "title": "Reclamos",
                        },
                        {
                            "id": "006",
                            "title": "Residuos ♻",
                        },
                        {
                            "id": "007",
                            "title": "Educación 📚",
                        },
                        {
                            "id": "008",
                            "title": "Adultos mayores 👵👴",
                        },
                        {
                            "id": "009",
                            "title": "Colectividades 2024",
                            "description": "Información sobre la 3ra Fiesta de las Colectividades en Ceres"

                        },
                        {
                            "id": "010",
                            "title": "Plan de Poda 2024",
                            "description": "Solicitá la poda de un arbol"
                        },
                    ]
                }
            ]
        }
    }
    await provider.sendList(ctx.from, list)
})
.addAction({ capture: true }, async (ctx, { endFlow, flowDynamic, gotoFlow, fallBack }) => {
    const opcion = ctx.body.toLowerCase().trim()
    const nombre = ctx.name;
    console.log(opcion)
    if (!["colectividades", "fiesta de las colectividades", "poda", "salud", "tramites", "trámites", "cic", "género", "genero", "licencia", "licencias", "menu", "menú", "hola", "gracias", "no, gracias", "volver al menú", "Volver al menú", '001', '002', '003', '004', '005', '006', '007', '008', '009', '010'].includes(opcion)) {
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
        case '001': {
            stopInactividad(ctx)
            return gotoFlow(flowTramites)
        }
        case '002': {
            stopInactividad(ctx)
            return gotoFlow(flowLicencias)
        }
        case '003': {
            stopInactividad(ctx)
            return gotoFlow(flowSalud)
        }
        case '004': {
            stopInactividad(ctx)
            return gotoFlow(flowTurismo)
        }
        case '005': {
            stopInactividad(ctx)
            return gotoFlow(flowReclamos)
        }
        case '006': {
            stopInactividad(ctx)
            return gotoFlow(flowResiduos)
        }
        case '007': {
            stopInactividad(ctx)
            return gotoFlow(flowEducacion)
        }
        case '008': {
            stopInactividad(ctx)
            return gotoFlow(flowAdultosmayores)
        }
        case '009': {
            stopInactividad(ctx)
            return gotoFlow(flowColectividades)
        }
        case '010': {
            stopInactividad(ctx)
            return gotoFlow(flowPoda)
        }
        case 'no, gracias': {
            stopInactividad(ctx)
            return endFlow(`De nada ${nombre} 😃. Si necesitas información estoy disponible 24/7.`)
        }
    }
})

const flowMasOpciones = addKeyword(["$mas_opciones"])
.addAction({delay: 2000}, async (ctx, { provider }) => {

    const list = {
        "body": {
            "text": "Bien, te \nElegí una opción de este menú 👇"
        },
        "action": {
            "button": "Opciones",
            "sections": [
                {
                    "title": "Elegí una opción",
                    "rows": [
                        {
                            "id": "001",
                            "title": "Trámites 🗃️",
                        },
                        {
                            "id": "002",
                            "title": "Licencias 🪪",
                        },
                        {
                            "id": "003",
                            "title": "Salud",
                        },
                        {
                            "id": "004",
                            "title": "Turismo 📸",
                        },
                        {
                            "id": "005",
                            "title": "Reclamos",
                        },
                        {
                            "id": "006",
                            "title": "Residuos ♻",
                        },
                        {
                            "id": "007",
                            "title": "Educación 📚",
                        },
                        {
                            "id": "008",
                            "title": "Adultos mayores 👵👴",
                        },
                        {
                            "id": "009",
                            "title": "Fiesta de las Colectividades",
                        },
                        {
                            "id": "010",
                            "title": "Más opciones",
                        },
                    ]
                }
            ]
        }
    }
    await provider.sendList(ctx.from, list)
})
.addAction({ capture: true }, async (ctx, { endFlow, flowDynamic, gotoFlow, fallBack }) => {
    const opcion = ctx.body.toLowerCase().trim()
    const nombre = ctx.name;
    console.log(opcion)
    if (!["salud", "tramites", "trámites", "cic", "género", "genero", "licencia", "licencias", "menu", "menú", "hola", "gracias", "no, gracias", "volver al menú", "Volver al menú", '001', '002', '003', '004', '005', '006', '007', '008', '009', '010'].includes(opcion)) {
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
        case '001': {
            stopInactividad(ctx)
            return gotoFlow(flowTramites)
        }
        case '002': {
            stopInactividad(ctx)
            return gotoFlow(flowLicencias)
        }
        case '003': {
            stopInactividad(ctx)
            return gotoFlow(flowSalud)
        }
        case '004': {
            stopInactividad(ctx)
            return gotoFlow(flowTurismo)
        }
        case '005': {
            stopInactividad(ctx)
            return gotoFlow(flowReclamos)
        }
        case '006': {
            stopInactividad(ctx)
            return gotoFlow(flowResiduos)
        }
        case '007': {
            stopInactividad(ctx)
            return gotoFlow(flowEducacion)
        }
        case '008': {
            stopInactividad(ctx)
            return gotoFlow(flowAdultosmayores)
        }
        case '009': {
            stopInactividad(ctx)
            return gotoFlow(flowDengue)
        }
        case '010': {
            stopInactividad(ctx)
            return gotoFlow(flowMasOpciones)
        }
        case 'no, gracias': {
            stopInactividad(ctx)
            return endFlow(`De nada ${nombre} 😃. Si necesitas información estoy disponible 24/7.`)
        }
    }
})

export default flowMenu;