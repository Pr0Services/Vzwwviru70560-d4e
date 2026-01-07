// ThreadEvent poster (minimal stub)
export async function postThreadEvent(threadId: string, eventType: string, payload: any) {
  const res = await fetch(`/threads/${threadId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_id: crypto.randomUUID(),
      thread_id: threadId,
      event_type: eventType,
      created_at: new Date().toISOString(),
      actor_type: 'human',
      actor_id: 'current_user', // replace with auth
      payload
    })
  });
  if (!res.ok) throw new Error(`Event rejected: ${eventType}`);
  return await res.json();
}
