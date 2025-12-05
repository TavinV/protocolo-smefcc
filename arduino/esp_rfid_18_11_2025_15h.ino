//Inclusão das bibliotecas utilizadas
#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>
#include <WiFi.h>                  // Biblioteca para conexão Wi-Fi no ESP32
#include <PubSubClient.h>         // Biblioteca para comunicação via protocolo MQTT

// Configurações de rede Wi-Fi e servidor MQTT
const char* ssid = "Andrielzinho";                         // Nome da rede Wi-Fi
const char* password = "andriel.com.brz";               // Senha da rede Wi-Fi
const char* mqtt_server = "test.mosquitto.org";   // Endereço do broker MQTT (servidor)

//Definição do nome dos LEDs de Acesso Liberado ou Negado e suas respectivas portas
#define L1 2
#define L2 4

//Definição dos pinos de leitura do Leitor RFID
#define RST_PIN    22      
#define SS_PIN     21     

//Definição do nome dos botões e suas respectivas portas
#define B1 5
#define B2 34
#define B3 15

//Definição do nome dos LEDs que representam os motores que abrem e fecham as garras e suas respectivas portas
#define F1 12
#define F2 13
#define F3 32

//Definição do nome das chaves de fim de curso e suas respectivas portas
#define S1 14
#define S2 27
#define S3 35

//Definição da porta do servomotor atrelado à F2
const int servoPin1 = 33;
const int servoPin2 = 25;
const int servoPin3 = 26;

int estadoB2 = 0; // Armazena o estado do botão B2
int estadoB3 = 0; // Armazena o estado do botão B3
int estadoB1 = 0;
int estadosensor1 = 0;
int estadosensor2 = 0;
int estadosensor3 = 0;

MFRC522 mfrc522(SS_PIN, RST_PIN);
Servo myServo1;
Servo myServo2;
Servo myServo3;
WiFiClient espClient;             // Cria um cliente Wi-Fi para uso com o MQTT
PubSubClient client(espClient);   // Cria um cliente MQTT usando o cliente Wi-Fi

char* codgChaveFenda = "CHAV-00001";
char* codgMartelo = "MART-00001";
char* codgAlicate  = "ALIC-00001";

//Função "girarServoPorTempoH1"
void girarServoPorTempoH1(unsigned long tempo) {
  // Para servos contínuos:
  //  - write(90)  -> parado
  //  - write(<90) -> gira em um sentido
  //  - write(>90) -> gira no outro sentido

  myServo1.write(120); // Gira para frente (ajuste conforme a direção desejada)
  delay(tempo);       // Mantém o movimento por 'tempo' milissegundos
  myServo1.write(96);  // Para o servo
  Serial.println("Movimento concluído. Servo parado.");
}

//Função "girarServoPorTempoH2"
void girarServoPorTempoH2(unsigned long tempo) {
  // Para servos contínuos:
  //  - write(90)  -> parado
  //  - write(<90) -> gira em um sentido
  //  - write(>90) -> gira no outro sentido

  myServo2.write(120); // Gira para frente (ajuste conforme a direção desejada)
  delay(tempo);       // Mantém o movimento por 'tempo' milissegundos
  myServo2.write(96);  // Para o servo
  Serial.println("Movimento concluído. Servo parado.");
}

//Função "girarServoPorTempoH3"
void girarServoPorTempoH3(unsigned long tempo) {
  // Para servos contínuos:
  //  - write(90)  -> parado
  //  - write(<90) -> gira em um sentido
  //  - write(>90) -> gira no outro sentido

  myServo3.write(120); // Gira para frente (ajuste conforme a direção desejada)
  delay(tempo);       // Mantém o movimento por 'tempo' milissegundos
  myServo3.write(90);  // Para o servo
  Serial.println("Movimento concluído. Servo parado.");
}

//Função "girarServoPorTempoA1"
void girarServoPorTempoA1(unsigned long tempo) {
  // Para servos contínuos:
  //  - write(90)  -> parado
  //  - write(<90) -> gira em um sentido
  //  - write(>90) -> gira no outro sentido

  myServo1.write(70); // Gira para frente (ajuste conforme a direção desejada)
  delay(tempo);       // Mantém o movimento por 'tempo' milissegundos
  myServo1.write(96);  // Para o servo
  Serial.println("Movimento concluído. Servo parado.");
}

//Função "girarServoPorTempoA2"
void girarServoPorTempoA2(unsigned long tempo) {
  // Para servos contínuos:
  //  - write(90)  -> parado
  //  - write(<90) -> gira em um sentido
  //  - write(>90) -> gira no outro sentido

  myServo2.write(70); // Gira para frente (ajuste conforme a direção desejada)
  delay(tempo);       // Mantém o movimento por 'tempo' milissegundos
  myServo2.write(96);  // Para o servo
  Serial.println("Movimento concluído. Servo parado.");
}

//Função "girarServoPorTempoA3"
void girarServoPorTempoA3(unsigned long tempo) {
  // Para servos contínuos:
  //  - write(90)  -> parado
  //  - write(<90) -> gira em um sentido
  //  - write(>90) -> gira no outro sentido

  myServo3.write(70); // Gira para frente (ajuste conforme a direção desejada)
  delay(tempo);       // Mantém o movimento por 'tempo' milissegundos
  myServo3.write(90);  // Para o servo
  Serial.println("Movimento concluído. Servo parado.");
}

// função para publicar uma transação
void publicarTransacaoMQTT(String rfid, String item, String tipo) {
  // Monta o JSON manualmente
  String payload = "{";
  payload += "\"rfid\":\"" + rfid + "\",";
  payload += "\"item\":\"" + item + "\",";
  payload += "\"tipo\":\"" + tipo + "\"";
  payload += "}";

  // Converte para char*
  char message[256];
  payload.toCharArray(message, 256);

  // Publica no tópico desejado
  if (client.publish("transacoes", message)) {
    Serial.println("JSON enviado por MQTT:");
    Serial.println(message);
  } else {
    Serial.println("Erro ao enviar JSON via MQTT");
  }
}

void publicarRfidMQTT(String rfid) {
  String payload = "{";
  payload += "\"rfid\": \"" + rfid +"\"";
  payload += "}";

  // Converte para char*
  char message[256];
  payload.toCharArray(message, 256);

  // Publica no tópico desejado
  if (client.publish("rfids", message)) {
    Serial.println("JSON enviado por MQTT:");
    Serial.println(message);
  } else {
    Serial.println("Erro ao enviar JSON via MQTT");
  }
}

// Função para conectar à rede Wi-Fi
void setup_wifi() 
{
  delay(10);                                      // Aguarda 10 ms
  Serial.begin(115200);                           // Inicializa a comunicação serial com baud rate 115200
  WiFi.begin(ssid, password);                     // Inicia a conexão com o Wi-Fi

  while (WiFi.status() != WL_CONNECTED)          // Enquanto não estiver conectado...
  {
    delay(500);                                   // Aguarda meio segundo
    Serial.print(".");                            // Imprime um ponto para indicar tentativa de conexão
  }

  // Conectado ao Wi-Fi
  Serial.println("\nWiFi conectado. IP: " + WiFi.localIP().toString());  // Mostra o IP obtido
}


// Função para reconectar ao broker MQTT caso a conexão caia
 void reconnect() 
{
  while (!client.connected())                   // Enquanto não estiver conectado ao broker...
  {
    Serial.print("Conectando ao MQTT...");      // Mensagem de tentativa de conexão
    String clientId = "ESP32-Botao-" + String(random(0xffff), HEX);  // Cria um ID de cliente aleatório
    if (client.connect(clientId.c_str()))       // Tenta se conectar com o ID gerado
    {
      Serial.println("conectado");              // Sucesso na conexão
    } 
    else 
    {
      Serial.println("Falhou, rc=");              // Falha na conexão
      Serial.print(client.state());             // Imprime código do erro
      delay(5000);                              // Aguarda 5 segundos antes de tentar novamente
    }
  }
}



void setup() {
  
  setup_wifi();                                  // Chama função para conectar ao Wi-Fi
  client.setServer(mqtt_server, 1883);           // Configura o servidor MQTT (porta 1883)
  //Declaração dos tipos de pinos (Entrada ou Saída)
  pinMode(F1, OUTPUT);
  pinMode(F2, OUTPUT);
  pinMode(F3, OUTPUT);
  pinMode(B1, INPUT); 
  pinMode(B2, INPUT); 
  pinMode(B3, INPUT); 
  pinMode(L1, OUTPUT);
  pinMode(L2, OUTPUT);
  pinMode(S1, INPUT);
  pinMode(S2, INPUT);
  pinMode(S3, INPUT);
//Monitor Serial e síntaxes das bibliotecas utilizadas
  Serial.begin(115200);                                        
  SPI.begin();                                                
  mfrc522.PCD_Init();                                       
  Serial.println(F("Read personal data on a MIFARE PICC:"));  
  myServo1.attach(servoPin1); 
  myServo2.attach(servoPin2);
  myServo3.attach(servoPin3); 
  myServo1.write(90);       
  myServo2.write(30); 
  myServo3.write(10);    
}



void loop() {

  if (!client.connected())                       // Se não estiver conectado ao MQTT
  {
    reconnect();                                 // Tenta reconectar
  }
  client.loop();                                 // Mantém a conexão MQTT ativa e processa mensagens
  

  //Desliga todos os LEDs no início da programação
  digitalWrite(F1, LOW);
  digitalWrite(F2, LOW);
  digitalWrite(F3, LOW);
  digitalWrite(L1, LOW);
  digitalWrite(L2, LOW);

//Programação de leitura da TAG RFID (biblioteca)
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  byte block;
  byte len;
  MFRC522::StatusCode status;

  //Reinicia o loop se não houver nenhuma TAG no leitor
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  //Seleciona uma TAG
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

//Programação de leitura da TAG RFID (biblioteca)
  Serial.print("Identificação do cartao:");
  String conteudo = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    conteudo.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
    conteudo.concat(String(mfrc522.uid.uidByte[i], HEX));
  }

  Serial.println();
  Serial.print("Mensagem : ");
  conteudo.toUpperCase();
    


//Condição: "Se a TAG selecionada for diferente das apresentadas abaixo, executar a ação abaixo"
  if (conteudo.substring(1) != "A6 5D C0 AC" && 
      conteudo.substring(1) != "F3 26 8E FA" 
      && conteudo.substring(1) != "33 C4 80 34"
      ) 
  {
    
//Biblioteca MFRC522
  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); // dump some details about the card

  Serial.print(F("Name: "));

  byte buffer1[18];
  block = 4;
  len = 18;

  //------------------------------------------- GET FIRST NAME
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed on block 4: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer1, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed on block 4: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  //PRINT FIRST NAME
  for (uint8_t i = 0; i < 16; i++) {
    if (buffer1[i] != 32 && buffer1[i] != 0) { // Check for space (32) and null terminator (0)
      Serial.write(buffer1[i]);
    }
  }
  Serial.print(" ");

  //---------------------------------------- GET LAST NAME
  byte buffer2[18];
  block = 1;

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 1, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed on block 1: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer2, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed on block 1: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  //PRINT LAST NAME
  for (uint8_t i = 0; i < 16; i++) {
    if (buffer2[i] != 32 && buffer2[i] != 0) {
      Serial.write(buffer2[i]);
    }
  }


//Ação: "Exibir uma mensagem de "Acesso Negado", acender o LED vermelho por 3 segundos e continuar a programação depois da condição"
    Serial.println();
    Serial.println("Acesso Negado! Você não está cadastrado no sistema.");
    Serial.println();
    digitalWrite(L1, HIGH);
    delay(2500);            
    digitalWrite(L1, LOW);

    estadoB2 = digitalRead(B2);
    estadoB3 = digitalRead(B3);
    estadoB1 = digitalRead(B1);

if(estadoB1 == HIGH && estadoB2 == HIGH && estadoB3 == HIGH){
  Serial.println("Novo Cadastro de TAG");
  publicarRfidMQTT(conteudo.substring(1));
  Serial.println();
  
}

  } else {

   
//Biblioteca MFRC522
  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); // dump some details about the card

  Serial.print(F("Name: "));

  byte buffer1[18];
  block = 4;
  len = 18;

  //------------------------------------------- GET FIRST NAME
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed on block 4: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer1, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed on block 4: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  //PRINT FIRST NAME
  for (uint8_t i = 0; i < 16; i++) {
    if (buffer1[i] != 32 && buffer1[i] != 0) { // Check for space (32) and null terminator (0)
      Serial.write(buffer1[i]);
    }
  }
  Serial.print(" ");

  //---------------------------------------- GET LAST NAME
  byte buffer2[18];
  block = 1;

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 1, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed on block 1: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer2, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed on block 1: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    return;
  }

  //PRINT LAST NAME
  for (uint8_t i = 0; i < 16; i++) {
    if (buffer2[i] != 32 && buffer2[i] != 0) {
      Serial.write(buffer2[i]);
    }
  }

//Se a condição acima for falsa (se a TAG selecionada estiver cadastrada), executar a ação abaixo
//Ação: "Exibe a mensagem "Acesso Liberado", acende o LED azul, espera 3 segundos e continua a programação"
    Serial.println();
    Serial.println("Acesso Liberado!");
    Serial.println();
    digitalWrite(L2, HIGH); 
    delay(3000);        
    
//Iguala o estado do botão à leitura da variável

    estadoB2 = digitalRead(B2);
    estadoB3 = digitalRead(B3);
    estadoB1 = digitalRead(B1);

    estadosensor1 = digitalRead(S1);
    estadosensor2 = digitalRead(S2);
    estadosensor3 = digitalRead(S3);  

//Realiza a leitura dos 3 botões na sequência estipulada
//Se o estado do botão 2 for "HIGH" (se o botão estiver pressionado), executar a seguinte ação
    if (estadoB2 == HIGH && estadosensor2 == LOW) {
      //Acende o LED da Ferramenta 2, abre a garra através do giro do servomotor na função "girarServoPorTempo" por 1 segundo, volta o estado do botão para 0, apaga todos os LEDs acesos e continua a programação     
      digitalWrite(F2, HIGH);
      Serial.println("Ferramenta 2: Retirada");
      Serial.println();  
      publicarTransacaoMQTT(conteudo.substring(1), "ALIC-00001", "retirada");           
      girarServoPorTempoH2(1000); 
      estadoB2 = 0;
      delay(3000);             
      digitalWrite(F2, LOW);   
      digitalWrite(L2, LOW);
    } 

    //Se o estado do botão 2 for "HIGH" (se o botão estiver pressionado), executar a seguinte ação
    else if (estadoB2 == HIGH && estadosensor2 == HIGH) {
      //Acende o LED da Ferramenta 2, abre a garra através do giro do servomotor na função "girarServoPorTempo" por 1 segundo, volta o estado do botão para 0, apaga todos os LEDs acesos e continua a programação     
      digitalWrite(F2, HIGH);
      Serial.println("Ferramenta 2: Devolução");
      Serial.println();
      publicarTransacaoMQTT(conteudo.substring(1), "ALIC-00001", "devolucao");           
      girarServoPorTempoA2(1000); 
      estadoB2 = 0;
      delay(3000);             
      digitalWrite(F2, LOW);   
      digitalWrite(L2, LOW);
    } 
    
      //Se a condição acima for falsa, realiza a leitura do estado do botão 3
    else if (estadoB3 == HIGH && estadosensor3 == LOW){ 
      //Se o estado do botão 3 for "HIGH", acende o LED da ferramenta 3 por 1 segundo, volta o estado do botão para 0, desliga todos LEDs acesos e continua a programação
      digitalWrite(F3, HIGH);
      Serial.println("Ferramenta 3: Retirada");
      Serial.println();
      publicarTransacaoMQTT(conteudo.substring(1), "CHAV-00001", "retirada");           
      girarServoPorTempoH3(1000);             
      estadoB3 = 0;
      delay(3000);             
      digitalWrite(F3, LOW);   
          digitalWrite(L2, LOW);
    }

        else if (estadoB3 == HIGH && estadosensor3 == HIGH){ 
      //Se o estado do botão 3 for "HIGH", acende o LED da ferramenta 3 por 1 segundo, volta o estado do botão para 0, desliga todos LEDs acesos e continua a programação
      digitalWrite(F3, HIGH);
      Serial.println("Ferramenta 3: Devolução");
      Serial.println();
      publicarTransacaoMQTT(conteudo.substring(1), "CHAV-00001", "devolucao");           
      girarServoPorTempoA3(1000);             
      estadoB3 = 0;
      delay(3000);             
      digitalWrite(F3, LOW);   
          digitalWrite(L2, LOW);
    }
    
    //Se a condição acima for falsa, realiza a leitura do estado do botão 1
    else if (estadoB1 == HIGH && estadosensor1 == LOW){ 
      //Se o estado do botão 1 for "HIGH", acende o LED da ferramenta 1 por 1 segundo, volta o estado do botão para 0, desliga todos LEDs acesos e continua a programação
      digitalWrite(F1, HIGH);
      Serial.println("Ferramenta 1: Retirada");
      Serial.println();    
      publicarTransacaoMQTT(conteudo.substring(1), "MART-00001", "retirada");           
      girarServoPorTempoH1(1000); 
      estadoB1 = 0;
      delay(3000);                      
      digitalWrite(F1, LOW);  
      digitalWrite(L2, LOW);      
    }

    //Se a condição acima for falsa, realiza a leitura do estado do botão 1
    else if (estadoB1 == HIGH && estadosensor1 == HIGH){ 
//Se o estado do botão 1 for "HIGH", acende o LED da ferramenta 1 por 1 segundo, volta o estado do botão para 0, desliga todos LEDs acesos e continua a programação
      digitalWrite(F1, HIGH);
      Serial.println("Ferramenta 1: Devolução");
      Serial.println();    
      girarServoPorTempoA1(1000); 
      publicarTransacaoMQTT(conteudo.substring(1), "MART-00001", "devolucao");           
      estadoB1 = 0;
      delay(3000);                      
      digitalWrite(F1, LOW);  
      digitalWrite(L2, LOW);      
    }
    
//Se todas as condições acimas forem falsas, desliga todos os LEDs e continua a programação
    else{
  digitalWrite(F1, LOW);
  digitalWrite(F2, LOW);
  digitalWrite(F3, LOW);
  digitalWrite(L1, LOW);
  digitalWrite(L2, LOW);
  Serial.println("Nenhuma ferramenta selecionada");
      }

  }

  //-------------------------------------------


  // Clean up and halt PICC communication
  Serial.println(F("\n**End Reading**\n"));
  Serial.println("================================");
  Serial.println("");
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

}

//*****************************************************************************************//
