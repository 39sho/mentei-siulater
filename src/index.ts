import express from 'express';
import { WebhookEvent, middleware, messagingApi } from '@line/bot-sdk';
import * as sim from './ui/sim';
import * as search from './ui/search';
import { Mode, getMode, setMode } from './utils/mode';

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

// 断腸の思いでdb変数
// 想定される使い方：db['mode'] = ... のように状態などを詰めていく
const db: any = {};
setMode(db, 'normal')

const client = new MessagingApiClient({
    channelAccessToken: config.channelAccessToken,
});

const replyInSearchMode = (replyToken: string, text: string) => {
    client.replyMessage({
        replyToken: replyToken,
        messages: search.replyMessages(db, text),
    });
}

const replyInSimulateMode = (replyToken: string, text: string) => {
    client.replyMessage({
        replyToken: replyToken,
        messages: sim.replyMessages(db, text),
    });
}

const startsSearchingContext = (replyToken: string) => {
    setMode(db, 'search')

    client.replyMessage({
        replyToken: replyToken,
        messages: [{
            type: 'text',
            text: '検索したい違反名を入力してください',
        }],
    });
}

const startsSimulatingContext = (replyToken: string) => {
    setMode(db, 'simulate')

    client.replyMessage({
        replyToken: replyToken,
        messages: [{
            type: 'text',
            text: 'シミュレーションしたい違反名を入力してください',
        }],
    });
}

const replyInNormalMode = (replyToken: string, text: string) => {
    if (text === '検索を始める') {
        startsSearchingContext(replyToken)
    } else if (text === 'シミュレーションを始める') {
        startsSimulatingContext(replyToken)
    }
}

app.post('/webhook', middleware(config), async (req, res) => {
    const events: WebhookEvent[] = req.body.events;

    await Promise.all(events.map(async (event: WebhookEvent) => {
        console.log(event);

        // event.source.userId

        if (event.type === 'message' && event.message.type === 'text') {

            const mode = getMode(db);

            switch (mode) {
                case 'search':
                    replyInSearchMode(event.replyToken, event.message.text)
                    break;
                case 'simulate':
                    replyInSimulateMode(event.replyToken, event.message.text)
                    break;
                case 'normal':
                    replyInNormalMode(event.replyToken, event.message.text)
                    break;
                default:
                    const _: never = mode;
            }

        }

    }));

    res.end();
});

app.listen(3000);