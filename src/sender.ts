import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js';
import {create, Whatsapp, Message, SocketState} from 'venom-bot';

export type QRCode = {
    base64Qr: string
}

class Sender {
    private client: Whatsapp;
    private connected: boolean;
    private qr: QRCode;
    private Chats: any;
    private allNewMessages : any;
    private allMessagesInchat: any;

    
    get isConnected() : boolean {
        return this.connected;
    }

    get qrCode() : QRCode {
        return this.qr;
    }
   
    get allChats() : any {
        return this.Chats;
    }
   
    get AllChatsNewMessage() : any {
        return this.allNewMessages; 
    }
    
    public get AllMessagesInChat() : string {
        return this.allMessagesInchat;
    }
    
    
    
    constructor(){
        this.initialize();
    }

    async sendText(to: string, body: string){
        
        if (!isValidPhoneNumber(to,"BR")) {
            throw new Error("this number is not valid");           
        }

        let phoneNumber = parsePhoneNumber(to, "BR")?.format("E.164").replace("+","") as string;

        phoneNumber = phoneNumber.includes("@c.us") ? phoneNumber : `${phoneNumber}@c.us`;

        await this.client.sendText(phoneNumber, body);

        console.log("phone number: ",phoneNumber);
    }

    async listChats(){
        const chats = await this.client.getAllChats();
        //console.log(chats);
        this.Chats = chats;
    }

    async listAllChatsNewMessages(){
        const message = await this.client.getAllChatsNewMsg();
        
        this.allNewMessages = message; 
    }

    async listAllMessagesByChatId(chatID: string){
        console.log('entrou na function messages',chatID);
        const messages = await this.client.getAllUnreadMessages();
        this.allMessagesInchat = messages;
        console.log('messages',messages);
    }

    private initialize(){
        const qr = (base64Qr: string) => {
            this.qr = {base64Qr}
        }

        const status = (statusSession: string, session: string) => {
            //return isLogged || notLogged || browserClose || qrReadSuccess || 
            //qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || 
            //chatsAvailable || deviceNotConnected || serverWssNotConnected || 
            //noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || 
            //initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || 
            //waitChat || successChat
            //Create session wss return "serverClose" case server for close
            console.log('statusSession: ',statusSession)
            this.connected = ['successChat','isLogged','qrReadSuccess','chatsAvailable'].includes(statusSession);
        }

        const start = (client: Whatsapp) => {
            this.client = client;

            //this.sendText("554599119635@c.us","Olá, isso é um teste");
        }

        create('ws-sender-dev', qr, status, {multidevice: true}) 
          .then((client) => {
            start(client);
          })
          .catch((erro) => {
            console.log(erro);
          });
    }

}

export default Sender;

