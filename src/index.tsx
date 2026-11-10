import type { Context } from '@buzz/author';
import { createSettingsCardComponent } from './ui/SettingsCard.js';
import { createVaultChannelLauncher, createVaultPanelComponent } from './ui/VaultPanel.js';
import { createVaultArchiveTool } from './agent-tool.js';

export const inject = ['react', 'panels', 'settingsCards', 'agents', 'host'];

export function apply(ctx: Context) {
  // 1. Register Filecoin Vault Settings Card
  const SettingsCardComponent = createSettingsCardComponent(ctx);
  ctx.settingsCards.register({
    id: 'buzz-vault-settings',
    title: 'Filecoin Vault',
    group: 'Storage & Backup',
    component: SettingsCardComponent,
  });

  // 2. Register Channel Header Launcher & Side Panel
  const VaultPanelComponent = createVaultPanelComponent(ctx);
  const VaultLauncherComponent = createVaultChannelLauncher(ctx);
  ctx.panels.register({
    id: 'buzz-vault',
    title: 'Buzz Vault',
    matches: (url: string) => url.startsWith('buzz://vault') || url === 'vault',
    channelPlacement: 'side',
    channelLauncher: VaultLauncherComponent,
    component: VaultPanelComponent,
  });

  // 3. Register vault_archive Agent Tool
  const vaultTool = createVaultArchiveTool(ctx.host);
  ctx.agents.addTool(vaultTool);
}
