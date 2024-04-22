import { addKeyword, EVENTS } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'

import { flowDengue } from './flowDengue';
import { flowAdultosmayores } from './flowAdultosmayores';
import flowEducacion from './flowEducacion';
import { flowResiduos } from './flowResiduos';
import { flowHistoria } from './flowHistoria';
import { flowTurismo } from './flowTurismo';
import { flowCIC } from './flowCic';
import flowLicencias from './flowLicencias';
import  flowTramites  from './flowTramites';
import { flowAyuda } from './flowAyuda';
import { flowCeresito } from './flowCeresito';
import { flowCrearReclamo } from './crearReclamo';


const  flowMenu = addKeyword(["menu", "menú"])

.addAction({delay: 2000}, async (ctx, { provider }) => {

    const list = {
        "body": {
            "text": "Contame, ¿sobre que necesitas saber?"
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
                            "title": "CIC 🫂",
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
                            "title": "Dengue 🦟",
                        },
                        {
                            "id": "010",
                            "title": "Cómo usar Ceresito 🤖",
                        },
                    ]
                }
            ]
        }
    }
    await provider.sendList(ctx.from, list)
    console.log(ctx.body)

})


  




  export default flowMenu;