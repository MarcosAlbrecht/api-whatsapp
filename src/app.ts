import express, { Request, Response } from "express";
import { send } from "process";
import { json } from "stream/consumers";
import Sender from "./sender";

const sender = new Sender();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.get('/status', (req: Request, res: Response) =>{
        return res.send({
            qr_code: sender.qrCode,
            connected: sender.isConnected,
            success: false
        })
} )

app.get('/list_all_chats', async (req: Request, res: Response) => {
    try {
        await sender.listChats();
        res.status(200).send(sender.allChats);    
    } catch (error) {
        
    }
    
    
})

app.get('/list_new_message', async (req: Request, res: Response) => {
    try {
        await sender.listAllChatsNewMessages();
        res.status(200).send(sender.AllChatsNewMessage);    
    } catch (error) {
        
    }   
})

app.get('/list_message_chat/:idChat', async (req: Request<{ idChat: string }>, res: Response) => {
    try {
        const idChat = req.params.idChat;
        await sender.listAllMessagesByChatId(idChat);
        res.status(200).send(sender.AllMessagesInChat);    
    } catch (error) {
        
    }
    
    
})

app.post('/send', async (req: Request, res: Response) => {
    const {number, message} = req.body;
    try {
        await sender.sendText(number, message);
        return res.status(200).send({success:true, message: 'mensagem enviada' });  
    } catch (error) {
        console.error(error);
    }

    
} )
app.listen(5000, () => {
    console.log("server startedqu")
} )
