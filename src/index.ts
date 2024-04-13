import express, { response } from 'express';
import { TextMessage, WebhookEvent, middleware, messagingApi } from '@line/bot-sdk';

const { MessagingApiClient } = messagingApi;


const {
    CHANNEL_ACCESS_TOKEN,
    CHANNEL_SECRET,
} = process.env;

const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN ?? '',
    channelSecret: CHANNEL_SECRET ?? '',
};

const app = express();

const client = new MessagingApiClient({
    channelAccessToken: config.channelAccessToken,
});

app.post('/webhook', middleware(config), async (req, res) => {
    const events: WebhookEvent[] = req.body.events;

    await Promise.all(events.map(async (event: WebhookEvent) => {
        console.log(event);

        if (event.type === 'message') {
            if (event.message.type === 'text') {
                const response: TextMessage = {
                    type: 'text',
                    text: 'てすと',
                };

                client.replyMessage({
                    replyToken: event.replyToken,
                    messages: [response],
                });
            }
        }

    }));

    res.end();
});

app.listen(3000);