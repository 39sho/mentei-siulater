import { Message } from "@line/bot-sdk";
import { simulate } from "../usecase/sim";
import { Mode, setMode } from "../utils/mode";
import { User, getUser, setUser } from "../utils/user";
import { isUsecaseError } from "../usecase/errors";

export const replyMessages = (db: any, text: string): Message[] => {

  const acceptableIhans = simulate(text);

  if (text === 'シミュレーションを終わる') {
    setMode(db, 'normal')
    return [{
      type: 'text',
      text: 'シミュレーションを終わります',
    }]
  }

  if (isUsecaseError(acceptableIhans)) {
    switch (acceptableIhans.kind) {
      case "NotFound":
        return [{
          type: 'text',
          text: '対象の違反項目が見つかりませんでした'
        },
        {
          type: 'text',
          text: 'シミュレーションを終わる場合は「シミュレーションを終わる」と入力してください',
        },
        ]
      case "InternalServerError":
        return [{
          type: 'text',
          text: 'エラーが起きました',
        }];
    }
  }

  if (acceptableIhans.length === 0)
    return [{
      type: 'text',
      text: '免停',
    },
    {
      type: 'text',
      text: `・現在の点数：${getUser(db).point}`,
    }
    ];

  setMode(db, 'normal')

  return [
    {
      type: 'text',
      text: '行っても免停にならない違反項目の一覧です',
    },
    {
      type: "flex",
      altText: "carousel",
      contents: {
        type: "carousel",
        contents: acceptableIhans.slice(0, 10).map(acceptableIhan => (
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: acceptableIhan.name,
                  align: "center",
                  wrap: true,
                }
              ]
            }
          }
        )),
      },
    },
  ];
  /*
  return [
      {
          type: 'text',
          text: '行っても免停にならない違反項目の一覧です',
      },
      {
          type: "flex",
          altText: "carousel",
          contents: {
              type: "carousel",
              contents: [
                  {
                      type: "bubble",
                      body: {
                          type: "box",
                          layout: "vertical",
                          contents: [
                              {
                                  type: "text",
                                  text: "Body",
                                  align: "center",
                              }
                          ]
                      }
                  },
              ],
          },
      },
  ];
  */
  /*
  return [
      {
          type: 'text',
          text: '行っても免停にならない違反項目の一覧です',
      },
      {
          type: 'template',
          altText: '違反項目のcarousel',
          template: {
              type: "carousel",
              columns: acceptableIhans.slice(0, 10).map(acceptableIhan => ({
                  text: acceptableIhan.name,
                  actions: [
                      {
                          type: 'message',
                          label: 'select',
                          text: acceptableIhan.name,
                      }
                  ]
              })),
          }
      }
  ];
  */
};

/*
{
  "type": "template",
  "altText": "this is a carousel template",
  "template": {
    "type": "carousel",
    "columns": [
      {
        "text": "テキスト",
        "actions": [
          {
            "type": "postback",
            "label": "アクション 1",
            "text": "アクション 1",
            "data": "データ 1"
          }
        ]
      },
      {
        "text": "テキスト",
        "actions": [
          {
            "type": "message",
            "label": "アクション 1",
            "text": "アクション 1"
          }
        ]
      }
    ]
  }
}
 */