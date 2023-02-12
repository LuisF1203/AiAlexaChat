const { Configuration, OpenAIApi } = require("openai");
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);


//Crea una sesión con whatsapp-web y la guarda localmente para autenticarse solo una vez por QR
const client = new Client({
    authStrategy: new LocalAuth()
});
//Genera el código qr para conectarse a whatsapp-web
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

//Si la conexión es exitosa muestra el mensaje de conexión exitosa
client.on('ready', () => {
    console.log('Conexion exitosa nenes');
    

});



const HelloWorldIntentHandler = {

    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'HelloWorldIntent';
    },
    async handle(handlerInput) {
        try {
            const q='dame un escrito muy corto sobre mexico';
            const prompt = `
            ${q}. Return response in the following parsable JSON format:
            {
                "Q": "question",
                "A": "answer"
            }
            `;
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 2048,
                temperature: 1,
            });

	        const parsableJSONresponse = response.data.choices[0].text;
	        const parsedResponse = JSON.parse(parsableJSONresponse);
            const speechText=parsedResponse.Q+":  "+parsedResponse.A;
            client.sendMessage("5217551382378@c.us", speechText);
        return handlerInput.responseBuilder
            .speak("Información enviada a tu telefono")
            .reprompt('Hello world', "Información enviada a tu telefono")
            .getResponse();
            
        } catch (error) {
            const speechText = 'Error con la ia';
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt('Hello world', speechText)
                .getResponse();
            }
        
    }
}

client.initialize();
module.exports = { HelloWorldIntentHandler };