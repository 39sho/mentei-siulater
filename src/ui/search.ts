import { Message } from "@line/bot-sdk";
import { search } from "../usecase/search";
import { setMode } from "../utils/mode";
import { shuffle } from "../utils/shuffle";

export const replyMessages = (db: any, text: string): Message[] => {

    const result = search(text)

    console.log('result: ', result)
    console.log('sliced: ', result.slice(0, 10))

    if (result.length === 0) {
        return [{
            type: 'text',
            text: '検索に該当する違反は0件でした',
        }]
    }

    const slicedResult = result.slice(0, 10)

    setMode(db, 'normal')

    return [
        {
            type: 'text',
            text: `検索結果(${slicedResult.length}件)`,
        },
        {
            type: "flex",
            altText: "carousel",
            contents: {
                type: "carousel",
                /* デモのためにsliceしてからshuffleしてるが、shuffleしてからsliceしたい */
                contents: shuffle(slicedResult).map(ihan => (
                    {
                        type: "bubble",
                        hero: {
                            type: "image",
                            url: ihan.imageUrl,
                            size: "full",
                            aspectRatio: "1.51:1",
                            aspectMode: "fit",
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: ihan.name,
                                    align: "center",
                                    wrap: true,
                                },
                            ]
                        },
                        footer: {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "button",
                                    action: {
                                        type: "message",
                                        label: "選択する",
                                        text: ihan.name,
                                    },
                                },
                            ],
                        },
                    }
                )),
            },
        },
        {
            type: 'text',
            text: '続けてシミュレーションを行う場合は、「シミュレーションを始める」を選択してください',
        },
    ];
}