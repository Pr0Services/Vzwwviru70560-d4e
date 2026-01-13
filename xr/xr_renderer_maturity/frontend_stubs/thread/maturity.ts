// Thread maturity computation (derived)
export type MaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface MaturityResult {
  score: number; // 0-100
  level: MaturityLevel;
  label: 'Seed' | 'Sprout' | 'Workshop' | 'Studio' | 'Org' | 'Ecosystem';
  signals: Record<string, any>;
}

export function scoreToLevel(score: number): MaturityResult['level'] {
  if (score < 10) return 0;
  if (score < 25) return 1;
  if (score < 45) return 2;
  if (score < 65) return 3;
  if (score < 85) return 4;
  return 5;
}

export function levelLabel(level: MaturityLevel): MaturityResult['label'] {
  return ['Seed','Sprout','Workshop','Studio','Org','Ecosystem'][level];
}
