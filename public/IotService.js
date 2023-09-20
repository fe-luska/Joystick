class IotService {

  constructor(options) {
    const {
      clientId,
      endpoint,
      region,
      privateKey,
      clientCert
    } = options;

    this.mqttClient = new AWSIoTData({
      region: region,
      endpoint: endpoint,
      clientId: clientId,
      clientPrivateKey: privateKey,
      clientCert: clientCert,
      debug: true // Ative para depuração
    });
  }

  connect() {
    this.mqttClient.connect();

    this.mqttClient.onConnect(() => {
      console.log('Conectado ao AWS IoT');
    });
  }

  publishData(topic, data) {
    this.mqttClient.publish({
      topic: topic,
      payload: JSON.stringify(data)
    });
  }


  // Simulação de uma chamada HTTP POST para o servidor backend para obter os certificados e chaves privadas
  static async getCertificatesAndPrivateKey(username, token) {
    // Substitua esta URL pela URL real do seu servidor backend
    const backendURL = 'http://localhost:8080/things/getJoystick/' + username;

    try {
      const response = await fetch(backendURL, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Trate o erro de acordo com sua lógica de erro
        throw new Error('Falha ao obter certificados e chaves privadas.');
      }

      const data = await response.json();

      // 'data' deve conter o certificado e a chave privada obtidos do servidor backend
      const certificate = data.certificatePEM;
      const privateKey = data.privateCertKey;

      return { certificate, privateKey };
    } catch (error) {
      // Trate o erro de acordo com sua lógica de erro
      console.error(error);
      throw error;
    }
  }
}