import { EVENTS, addKeyword } from "@builderbot/bot"
import imageLayer from "~/services/gemini/image.layer"

export const flowReciclarIA = addKeyword('$gemini')
    .addAction(imageLayer)