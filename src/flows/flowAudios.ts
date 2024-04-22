import { addKeyword, EVENTS } from '@builderbot/bot'
  
export const mediaFlow = addKeyword(EVENTS.MEDIA).addAnswer('Perdon pero no puedo recibir tu imagen :( Solo soy un chatbot')

export const voiceNoteFlow = addKeyword(EVENTS.VOICE_NOTE)
.addAnswer('Perdon pero no puedo escuchar tu audio :( Solo soy un chatbot',)