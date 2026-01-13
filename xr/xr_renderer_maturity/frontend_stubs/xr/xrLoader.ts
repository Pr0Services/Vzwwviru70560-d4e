// XR Blueprint loader (minimal stub)
import { XrBlueprint } from './xrModels';

export async function fetchLatestBlueprint(threadId: string): Promise<XrBlueprint> {
  const res = await fetch(`/threads/${threadId}/xr/blueprint/latest`);
  if (!res.ok) throw new Error('Failed to load blueprint');
  const data = await res.json();
  return data.blueprint as XrBlueprint;
}

export async function generateBlueprint(threadId: string): Promise<XrBlueprint> {
  const res = await fetch(`/threads/${threadId}/xr/generate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to generate blueprint');
  const data = await res.json();
  return data.blueprint as XrBlueprint;
}
