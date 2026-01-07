export type XRRoom = {
  id: string;
  name: string;
  description: string;
  participantCount: number;
};

export type XRParticipant = {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
};

export type XRTimelineEvent = {
  id: string;
  timestamp: string;
  label: string;
};
