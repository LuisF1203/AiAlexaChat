const LaunchRequest = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      const speechText = 'Hola, bienvenido a prueba uno, aqui tendras un chat con chatgpt';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
  
    },
  };
  
  module.exports = { LaunchRequest }