import { Action } from "../../models/player";

export const SAMPLE_ACTION_TEST: Action = {
  id: 'test_action',
  title: 'Test Action',
  description: 'Azione di test per debug',
  source: 'base',
  cost: { ap: 0 },
  effects: [
    {
      type: 'customTestLog',
      payload: {
        message: 'Azione di test eseguita!'
      }
    }
  ]
};