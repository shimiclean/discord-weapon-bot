import { jest } from '@jest/globals';
import { weapon3Command } from '../../src/commands/weapon3.js';

describe('weapon3 コマンド', () => {
  it('コマンド名が "weapon3" であること', () => {
    expect(weapon3Command.data.name).toBe('weapon3');
  });

  it('"スプラシューター" と返信すること', async () => {
    const reply = jest.fn();
    const interaction = { reply } as any;

    await weapon3Command.execute(interaction);

    expect(reply).toHaveBeenCalledWith('スプラシューター');
  });
});
