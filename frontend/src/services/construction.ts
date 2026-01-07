// ============================================================
// CHE·NU - Construction Québec Service
// ============================================================

import { api } from './api'
import type { RBQLicence, CCQMetier, CCQCostEstimate, CNESSTObligation, SubsidyProgram } from '@/types'

export const constructionService = {
  // RBQ
  async validateLicence(licenceNumber: string): Promise<RBQLicence & { message: string }> {
    return api.get(`/integrations/construction/rbq/validate/${licenceNumber}`)
  },

  async getRBQCategories(projectType: string): Promise<{
    project_type: string
    required_categories: string[]
    all_categories: Record<string, string>
  }> {
    return api.get(`/integrations/construction/rbq/categories/${projectType}`)
  },

  // CCQ
  async getMetiers(): Promise<{ metiers: CCQMetier[] }> {
    return api.get('/assistant/ccq/metiers')
  },

  async getCCQRates(metier: string): Promise<{
    metier: string
    taux_horaires: Record<string, number>
    heures_apprentissage: Record<string, any>
  }> {
    return api.get(`/assistant/ccq/taux/${metier}`)
  },

  async calculateLabourCost(
    metier: string, 
    heures: number, 
    statut: string = 'compagnon'
  ): Promise<CCQCostEstimate> {
    return api.post('/integrations/construction/ccq/calculate-cost', null, {
      params: { metier, heures, statut },
    })
  },

  // CNESST
  async calculateContribution(
    codeUnite: string, 
    masseSalariale: number
  ): Promise<{ cotisation: number; taux: number }> {
    return api.post('/integrations/construction/cnesst/calculate-contribution', null, {
      params: { code_unite: codeUnite, masse_salariale: masseSalariale },
    })
  },

  async getObligations(nbTravailleurs: number): Promise<{
    nb_travailleurs: number
    obligations: CNESSTObligation[]
  }> {
    return api.get(`/integrations/construction/cnesst/obligations/${nbTravailleurs}`)
  },

  async getRequiredEPI(typeTravaux: string): Promise<{
    type_travaux: string
    epi_requis: string[]
  }> {
    return api.get(`/integrations/construction/cnesst/epi/${typeTravaux}`)
  },

  // Subventions
  async getSubsidies(typeTravaux: string): Promise<{
    type_travaux: string
    programmes: SubsidyProgram[]
  }> {
    return api.get(`/integrations/construction/subventions/${typeTravaux}`)
  },

  async getAllSubsidyPrograms(): Promise<{ programs: SubsidyProgram[] }> {
    return api.get('/assistant/subsidies/programs')
  },
}
