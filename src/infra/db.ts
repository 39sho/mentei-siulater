import ihans from './ihan.json';

// ほんとうはinfra内だけの使い回しにしたかった
export type Ihan = {
    id:number,
    name:string,
    point:number,
    imageUrl:string,
}

export const findIhanByName = (ihanName: string): Ihan | null => {
    for (const ihan of ihans)
        if (ihan.name == ihanName)
            return ihan;

    return null;
};

export const findIhansByIdRange = (beginId: number, endId: number): Ihan[] => {
    let res = []

    for (const ihan of ihans)
        if (beginId <= ihan.id && ihan.id <= endId)
            res.push(ihan)

    return res
}

export const findIhansByMaxPoint = (maxIhanPoint: number): Ihan[] => {
    return ihans.filter(ihan => ihan.point < maxIhanPoint);
};

export const findIhansIncludingText = (text: string):Ihan[] =>  {
    return ihans.filter((ihan) => ihan.name.includes(text))
}