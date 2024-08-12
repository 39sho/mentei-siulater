import express from 'express';
import { WebhookEvent, middleware, messagingApi } from '@line/bot-sdk';
import * as sim from './ui/sim';
import * as search from './ui/search';
import { Mode, getMode, setMode } from './utils/mode';
import { User, setUser } from './utils/user';

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
    setUser(db, { point: 0 } satisfies User);

    client.replyMessage({
        replyToken: replyToken,
        messages: [{
            type: 'text',
            text: '検索した違反を選択してください',
        }],
    });
}

const replyHelpMessage = (replyToken: string) => {
    client.replyMessage({
        replyToken: replyToken,
        messages: [
            {
                type: 'text',
                text: `【検索の使い方】
下メニューの"search"を選択した後、「警察官」「重量」「酒」など、検索したいキーワードを教えてください。`
            },
            {
                type: 'text',
                text: `【シミュレーションの使い方】
1.先に違反項目を検索します。
2.下メニューの"simulation"を選択した後、検索した違反項目を選択してください。`
            }
        ],
    })
}

const replyShowAllMessage = (replyToken: string) => {
    setMode(db, 'showAll');

    client.replyMessage({
        replyToken,
        messages: [
            {
                type: "text",
                text: "見たい範囲を選択してください",
                quickReply: {
                    items: [
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "1~10",
                                text: "1~10"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "11~20",
                                text: "11~20"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "21~30",
                                text: "21~30"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "31~40",
                                text: "31~40"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "60",
                                text: "51~60"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "61~70",
                                text: "61~70"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "71~80",
                                text: "71~80"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "81~90",
                                text: "81~90"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "91~100",
                                text: "1~10"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "101~110",
                                text: "101~110"
                            }
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "111",
                                text: "111"
                            }
                        },
                    ]
                }
            },
        ],
    });
};

const replyInNormalMode = (replyToken: string, text: string) => {
    switch (text) {
        case '検索を始める':
            startsSearchingContext(replyToken)
            break;
        case 'シミュレーションを始める':
            startsSimulatingContext(replyToken)
            break;
        case 'ヘルプ':
            replyHelpMessage(replyToken)
            break;
        case '一覧':
            replyShowAllMessage(replyToken);
    }
}

const replyInShowAllMode = (replyToken: string, text: string) => {
    /* showAll.ts */
};

app.post('/webhook', middleware(config), async (req, res) => {
    const events: WebhookEvent[] = req.body.events;

    await Promise.all(events.map(async (event: WebhookEvent) => {
        console.log(event);

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
                case 'showAll':
                    replyInShowAllMode(event.replyToken, event.message.text);
                    break;
                default:
                    const _: never = mode;
            }

        }

    }));

    res.end();
});

app.listen(3000);