// Minimal renderer contract (non-3D stub): translates blueprint into UI components
import { XrBlueprint, BlueprintZone, BlueprintItem } from './xrModels';
import { postThreadEvent } from '../threadEvents';

export async function renderRoom(threadId: string, blueprint: XrBlueprint) {
  // In real XR: instantiate 3D prefabs per zone type and place items.
  // Here: ensure contract exists and interactions emit events.
  blueprint.zones.forEach(zone => renderZone(threadId, zone));
}

function renderZone(threadId: string, zone: BlueprintZone) {
  // Replace with actual XR engine integration.
  console.log('Render zone', zone.id, zone.type, zone.title);
  zone.items.forEach(item => renderItem(threadId, zone.id, item));
}

function renderItem(threadId: string, zoneId: string, item: BlueprintItem) {
  console.log('Render item', item.kind, item.label);

  // Example write interaction: mark action done
  if (item.kind === 'action' && item.actions?.includes('mark_done')) {
    // In XR: attach interaction handler to prefab
    const onMarkDone = async () => {
      await postThreadEvent(threadId, 'ACTION_UPDATED', { action_id: item.id, status: 'done', context: { zoneId } });
    };
    // placeholder trigger
    void onMarkDone;
  }
}
