import { GameAction } from "../../models/gameAction";

export const SAMPLE_ACTION_TEST: GameAction = {
  id: 'test_action',
  title: 'Test Action',
  description: 'Azione di test per debug',
  source: 'base',
  cost: { cards: 0 },
  effects: [
    {
      type: 'customTestLog',
      payload: {
        message: 'Azione di test eseguita!'
      }
    }
  ]
};