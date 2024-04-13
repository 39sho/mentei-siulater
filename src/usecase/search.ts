import { findIhansIncludingText } from "../infra/db";

export const search = (text: string) => {
    console.log('seach() in usecase is called.')
    return findIhansIncludingText(text);
};