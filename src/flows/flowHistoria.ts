import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowLlamarMenu } from './flowLlamarMenu'
  

export const flowHistoria = addKeyword<Provider, Database>('historia')
/*
        .addAction(async (ctx, { gotoFlow }) => {
          const adapterDB = require('../database/database')
          adapterDB.contadorFlujos(5) // historia
          .then(() => {
              console.log('Contador del flujo incrementado correctamente');
          })
          .catch((error) => {
              console.error('Error al incrementar el contador del flujo:', error);
          });
        }) 
        */
        .addAnswer('Acá te dejamos un pequeño resumen sobre la historia de nuestra querida ciudad 👇', {delay:2000}, async (ctx, { provider } ) => {
          const sock = await provider.getInstance();
          const msgPoll = {
          sticker: {
          url:
          "./media/historia.webp"
          }
          };
          (sock as any).sock.sendMessage(ctx.key.remoteJid, msgPoll)
        })
        
        .addAnswer(['El 1 de julio de 1892 Ceres se constituía como colonia gracias al decreto del entonces gobernador de Santa Fe, Juan M. Cafferata, en un momento de plena expansión del país.',
                    'Sin embargo, estas tierras se vieron habitadas varios años antes. En 1888, durante la presidencia del Dr. Miguel Juárez Celman y en un contexto de gran expansión de las redes ferroviarias, se estableció el kilómetro 125 en el actual territorio ceresino. ¿Qué significaba esto? Así se denominó a la estación ferroviaria de nuestra ciudad por ser la distancia que nos separaba de Sunchales, punta de riel hasta entonces. ',
                    'Es así que un 8 de abril de 1888 llegó el primer tren con materiales y personas que levantarían las instalaciones del nuevo punto. Sin embargo, ya había dos pobladores en las tierras de lo que hoy es Ceres: Don Gregorio Luna y Don Pedro Córdoba. Para el Cincuentenario de la ciudad, Luna había fallecido hacía muy poco y Córdoba se encontraba todavía vivo. En el libro de ese aniversario, se sostiene que estas dos personas “ayudaron en la tarea de amojonamiento del pueblo y de la colonia”.',
                    'Volviendo a la instalación del ferrocarril en la zona, esta acción generó que una gran cantidad de empleados se radicaran acá, lo que provocó que también se instalaran negocios para proveer de mercancía a los ferroviarios. Las tierras del km 125 pertenecían a la Sociedad Colonizadora Argentina, creada por Vicente Casares y Tristán Malbrán, quienes donaron los terrenos para la instalación de las vías y estaciones.',
                    'Con el correr de los años siguió incrementándose la cantidad de habitantes del kilómetro 125, principalmente con colonos de distintos puntos del país e inmigrantes, en su mayoría italianos, atraídos por las facilidades que se otorgaban para comprar tierras y con la comprobación de que eran sumamente aptas para el ganado y la agricultura. Por este motivo se comenzó a hacer referencia a la Diosa Ceres, diosa romana de la agricultura, las cosechas y la fecundidad.',
                    'Luego de 73 años de existencia y con 9.588 habitantes, sin haber llegado a las 10.000 requeridos, el gobernador Carlos S. Begnis declaró oficialmente ciudad a Ceres en el año 1961. Se trataron de más de 70 años caracterizados por una gran expansión cultural, social y económica: florecieron instituciones y la actividad económica creció a grandes ritmos, principalmente por el sector agropecuario. Ese mismo año, nuestra ciudad contabilizaba 120 tambos, 221 establecimientos agrícolas y 425 negocios.',
                    'Este año, la ciudad cumplió 131 años y según los últimos datos, estamos cerca de los 20.000 habitantes. Ceres se constituye como el centro comercial y de servicios más importante de la zona, teniendo un radio de influencia muy importante en toda el área.',
    ], {delay: 4000})
    .addAction({ delay: 9000 }, async (ctx, { flowDynamic, gotoFlow }) => {
      return gotoFlow(flowLlamarMenu)
  })