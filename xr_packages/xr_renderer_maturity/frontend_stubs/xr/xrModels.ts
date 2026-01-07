// XR Blueprint types (minimal)
export type RedactionLevel = 'public' | 'semi_private' | 'private';

export type ZoneType = 'wall' | 'table' | 'kiosk' | 'shelf' | 'timeline' | 'portal_area';
export type ItemKind = 'intent' | 'decision' | 'action' | 'memory' | 'resource' | 'timeline_event' | 'note';

export interface BlueprintItem {
  id: string;
  kind: ItemKind;
  label: string;
  redaction_level: RedactionLevel;
  source_event_id?: string;
  source_snapshot_id?: string;
  actions?: string[];
}

export interface BlueprintZone {
  id: string;
  type: ZoneType;
  title: string;
  items: BlueprintItem[];
  layout?: Record<string, any>;
}

export interface XrBlueprint {
  thread_id: string;
  template: 'personal_room' | 'business_room' | 'cause_room' | 'lab_room' | 'custom_room';
  generated_at: string;
  version: string;
  zones: BlueprintZone[];
  portals?: { label: string; thread_id: string }[];
  references?: { events?: string[]; snapshots?: string[] };
}
