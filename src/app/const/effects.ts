import { Item } from "../../models/player";

export type Effect =
    | { type: 'modifyStat'; payload: { targetId: string; stat: string; delta: number } }
    | { type: 'consumeItem'; payload: { ownerId: string; itemId: string; amount?: number } }
    | { type: 'movePlayers'; payload: { playerIds: string[]; toEntityId: string } }
    | { type: 'applyStatus'; payload: { targetIds: string[]; status: string; duration?: number } }
    | { type: 'giveItem'; payload: { ownerId: string; item: Item } }
    | { type: 'custom'; payload: any };