/**
 * CHE·NU™ — Template Types (Legacy Stub)
 */
export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  content: string;
}
export interface TemplateInstance {
  templateId: string;
  variables: Record<string, string>;
}
