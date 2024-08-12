import { FlexBubble, Message } from "@line/bot-sdk";
import { simulate } from "../usecase/sim";
import { Mode, setMode } from "../utils/mode";
import { User, getUser, setUser } from "../utils/user";
import { isUsecaseError } from "../usecase/errors";
import { shuffle } from "../utils/shuffle";

export const replyMessages = (db: any, text: string): Message[] => {

  const acceptableIhans = simulate(db, text);

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

  const point = getUser(db).point;

  if (point >= 15) {
    return [
      {
        type: 'text',
        text: `現在の点数：${point}`,
      },
      {
        type: 'text',
        text: '判定結果：免許取消し',
      },
      {
        type: 'text',
        text: 'シミュレーションを終わる場合は「シミュレーションを終わる」と入力してください',
      },
    ];
  }

  if (acceptableIhans.length === 0)
    return [
      {
        type: "flex",
        altText: "menteiBubble",
        contents: {
          "type": "bubble",
          "direction": "ltr",
          "hero": {
            "type": "image",
            "url": "https://cdn.discordapp.com/attachments/1228583834522746884/1228903285180727306/3ce3963552a624e94614d437c07563cd_t.png?ex=662dbc5f&is=661b475f&hm=03822baf744663cc316b4ea60ce470fc26a82411c450a8673ddfdb527036886e&",
            "size": "full",
            "aspectRatio": "1.51:1",
            "aspectMode": "fit"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": `現在の点数: ${point}`,
                "align": "center",
              },
              {
                "type": "text",
                "text": "免許停止",
                "align": "center",
              }
            ]
          }
        },
      },
      {
        type: 'text',
        text: 'シミュレーションを終わる場合は「シミュレーションを終わる」と入力してください',
      },
    ];

  if (acceptableIhans.length <= 10) {
    const slicedAcceptableIhans = acceptableIhans;

    return [
      {
        type: 'text',
        text: `現在の点数：${point}`,
      },
      {
        type: 'text',
        text: `行っても免停にならない違反項目の一覧です（${slicedAcceptableIhans.length}件）`,
      },
      {
        type: "flex",
        altText: "carousel",
        contents: {
          type: "carousel",
          /* デモのためにsliceしてからshuffleしてるが、shuffleしてからsliceしたい */
          contents: shuffle(slicedAcceptableIhans).map(acceptableIhan => (
            {
              type: "bubble",
              hero: {
                type: "image",
                url: acceptableIhan.imageUrl,
                size: "full",
                aspectRatio: "1.51:1",
                aspectMode: "fit"
              },
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
      {
        type: 'text',
        text: 'シミュレーションを終わる場合は「シミュレーションを終わる」と入力してください',
      },
    ];
  }

  const slicedAcceptableIhans = acceptableIhans.slice(0, 9);
  const carouselContents = shuffle(slicedAcceptableIhans).map(acceptableIhan => (
    {
      type: "bubble",
      hero: {
        type: "image",
        url: acceptableIhan.imageUrl,
        size: "full",
        aspectRatio: "1.51:1",
        aspectMode: "fit"
      },
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
  )) satisfies FlexBubble[];

  return [
    {
      type: 'text',
      text: `現在の点数：${point}`,
    },
    {
      type: 'text',
      text: `行っても免停にならない違反項目の一覧です（${acceptableIhans.length}件）`,
    },
    {
      type: "flex",
      altText: "carousel",
      contents: {
        type: "carousel",
        // デモのためにsliceしてからshuffleしてるが、shuffleしてからsliceしたい
        contents: [
          ...carouselContents,
          {
            type: "bubble",
            body: {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `And more...(${acceptableIhans.length - 9}件)`,
                  align: "center",
                  gravity: "center",
                  wrap: true,
                }
              ]
            }
          },
        ],
      },
    },
    {
      type: 'text',
      text: 'シミュレーションを終わる場合は「シミュレーションを終わる」と入力してください',
    },
  ];

  /*
  return [
    {
      type: 'text',
      text: `現在の点数：${point}`,
    },
    {
      type: 'text',
      text: `行っても免停にならない違反項目の一覧です（${slicedAcceptableIhans.length}件）`,
    },
    {
      type: "flex",
      altText: "carousel",
      contents: {
        type: "carousel",
        // デモのためにsliceしてからshuffleしてるが、shuffleしてからsliceしたい
        contents: shuffle(slicedAcceptableIhans).map(acceptableIhan => (
          {
            type: "bubble",
            hero: {
              type: "image",
              url: acceptableIhan.imageUrl,
              size: "full",
              aspectRatio: "1.51:1",
              aspectMode: "fit"
            },
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
    {
      type: 'text',
      text: 'シミュレーションを終わる場合は「シミュレーションを終わる」と入力してください',
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