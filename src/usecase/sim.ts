import { Ihan, findIhanByName, findIhansByMaxPoint } from "../infra/db";
import { UsecaseError } from "./errors";

export const simulate = (ihanName: string): Ihan[] | UsecaseError => {
    try {
        const ihan = findIhanByName(ihanName);

        // not exists
        if (ihan === null) {
            // ここで、対応する違反事項が存在しなかったことを表現したい
            return {
                kind: 'NotFound',
                message: 'NotFound',
            }
        }

        const remain = 6 - ihan.point;
        const acceptableIhans = findIhansByMaxPoint(remain);

        return acceptableIhans;

    } catch (err) {
        console.error(err);
        return {
            kind: 'InternalServerError',
            message: 'internal server errorだよ〜〜〜〜ん^^',
        }
    }
};