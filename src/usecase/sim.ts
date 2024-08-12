import { Ihan, findIhanByName, findIhansByMaxPoint } from "../infra/db";
import { User, getUser, setUser } from "../utils/user";
import { UsecaseError } from "./errors";

export const simulate = (db: any, ihanName: string): Ihan[] | UsecaseError => {
    try {
        const ihan = findIhanByName(ihanName);

        if (ihan === null) {
            return {
                kind: 'NotFound',
                message: 'NotFound',
            }
        }

        setUser(db, { point: getUser(db).point + ihan.point } satisfies User);
        const remain = 6 - ihan.point;
        const acceptableIhans = findIhansByMaxPoint(remain);

        return acceptableIhans;

    } catch (err) {
        console.error(err);
        return {
            kind: 'InternalServerError',
            message: 'internal server error',
        }
    }
};