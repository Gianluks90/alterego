import { Item } from "../../models/player";

export type Effect =
    | { type: 'customTestLog'; payload: { message: string } } // TESTING ONLY

    | { type: 'selectDestinationRoom'; payload: {allowAdjacentOnly?: boolean } }
    | { type: 'selectTarget'; payload: { filter: TARGET_TYPE } }
    | { type: 'dealDamage'; payload: { amount: number; targetId: string, extra?: number } }
    | { type: 'selectItemOnFloor'; payload: { filter: ITEM_TYPE } }
    | { type: 'pickUpItem'; payload: { playerId: string; itemId: string } }
    | { type: 'initiateTradeSession'; payload: { participantIds: string[] } }

    | { type: 'modifyStat'; payload: { targetId: string; stat: string; delta: number } }
    | { type: 'consumeItem'; payload: { ownerId: string; itemId: string; amount?: number } }
    | { type: 'movePlayers'; payload: { playerIds: string[]; destinationId: string, includeSelf?: boolean } }
    | { type: 'applyStatus'; payload: { targetIds: string[]; status: string; duration?: number } }
    | { type: 'giveItem'; payload: { ownerId: string; item: Item } }
    | { type: 'custom'; payload: any }
    | { type: 'chooseEffect'; payload: { options: Array<{ label: string; type: string; payload?: any }> } };

export enum TARGET_TYPE {
    SELF = "self",
    ALLY = "agent",
    ENEMY = "enemy",
    AREA = "area",
    GLOBAL = "global"
}

export enum ITEM_TYPE {
    ANY = "any",
    NORMAL = "normal",
    HEAVY = "heavy"
}
