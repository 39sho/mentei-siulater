import { Message } from "@line/bot-sdk";
import { search } from "../usecase/search";
import { setMode } from "../utils/mode";

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
            type: 'template',
            altText: '違反項目のcarousel',
            template: {
                type: "carousel",
                columns: slicedResult.map(ihan => ({
                    text: ihan.name,
                    actions: [
                        {
                            type: 'message',
                            label: 'select',
                            text: ihan.name,
                        }
                    ]
                })),
            }
        },
        {
            type: 'text',
            text: '続けてシミュレーションを行なう場合は、「シミュレーションを始める」を入力してください',
        },
    ];
}