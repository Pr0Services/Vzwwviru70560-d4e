// ============================================================
// CHE·NU - Project Assistant Service
// ============================================================

import { api } from './api'
import type { Project, ChatMessage } from '@/types'

interface ProjectContext {
  project_id: string
  name: string
  type?: string
  phase?: string
  location?: string
  budget?: number
  team_size?: number
}

interface MetierEstimate {
  metier: string
  heures: number
  statut?: string
}

export const assistantService = {
  async chat(
    message: string,
    projectContext?: ProjectContext,
    conversationHistory?: ChatMessage[]
  ): Promise<{
    response: string
    model: string
    usage: Record<string, number>
    context_used: string[]
  }> {
    return api.post('/assistant/chat', {
      message,
      project_context: projectContext,
      conversation_history: conversationHistory || [],
    })
  },

  async validateContractor(licenceNumber: string): Promise<{
    validation: { licence_number: string; format_valid: boolean; verification_url: string }
    advice: string
  }> {
    return api.post(`/assistant/validate-contractor?licence_number=${licenceNumber}`)
  },

  async estimateLabourCost(
    metiers: MetierEstimate[],
    includeBenefits: boolean = true
  ): Promise<{
    total: number
    breakdown: unknown[]
    include_benefits: boolean
    note: string
  }> {
    return api.post('/assistant/estimate-labour-cost', {
      metiers,
      include_benefits: includeBenefits,
    })
  },

  async getSafetyChecklist(
    nbWorkers: number,
    workTypes: string[]
  ): Promise<{
    nb_workers: number
    work_types: string[]
    obligations: unknown[]
    epi_required: string[]
    checklist: string
  }> {
    return api.post('/assistant/safety-checklist', {
      nb_workers: nbWorkers,
      work_types: workTypes,
    })
  },

  async findSubsidies(
    projectType: string,
    workTypes: string[],
    location: string = 'Québec'
  ): Promise<{
    programs: unknown[]
    total_potential: number
    analysis: string
  }> {
    return api.post('/assistant/find-subsidies', {
      project_type: projectType,
      work_types: workTypes,
      location,
    })
  },

  async generateReport(
    projectContext: ProjectContext,
    reportType: string = 'status'
  ): Promise<{
    project_id: string
    report_type: string
    generated_at: string
    content: string
  }> {
    return api.post('/assistant/generate-report', {
      project_context: projectContext,
      report_type: reportType,
    })
  },

  async getTools(department?: string): Promise<{
    tools: { name: string; description: string; parameters: unknown; department: string }[]
    count: number
  }> {
    const url = department 
      ? `/assistant/tools?department=${department}`
      : '/assistant/tools'
    return api.get(url)
  },
}
