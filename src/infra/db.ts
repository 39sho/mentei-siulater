import ihans from './ihan.json';

export type Ihan = {
    id:number,
    name:string,
    point:number
}

export const findIhanByName = (ihanName: string): Ihan | null => {
    for (const ihan of ihans)
        if (ihan.name == ihanName)
            return ihan;

    return null;
};

export const findIhansByMaxPoint = (maxIhanPoint: number): Ihan[] => {
    return ihans.filter(ihan => ihan.point < maxIhanPoint);
};

export const findIhansIncludingText = (text: string):Ihan[] =>  {
    return ihans.filter((ihan) => ihan.name.includes(text))
}