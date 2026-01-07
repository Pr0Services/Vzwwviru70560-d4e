import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { constructionService } from '@/services'
import { Building2, Shield, Users, DollarSign, FileCheck, AlertTriangle, Search } from 'lucide-react'

export function Construction() {
  const [licenceNumber, setLicenceNumber] = useState('')
  const [licenceResult, setLicenceResult] = useState<any>(null)

  const { data: metiers } = useQuery({
    queryKey: ['ccq-metiers'],
    queryFn: () => constructionService.getMetiers(),
  })

  const { data: programs } = useQuery({
    queryKey: ['subsidy-programs'],
    queryFn: () => constructionService.getAllSubsidyPrograms(),
  })

  const handleValidateLicence = async () => {
    if (!licenceNumber) return
    try {
      const result = await constructionService.validateLicence(licenceNumber)
      setLicenceResult(result)
    } catch (error) {
      setLicenceResult({ error: 'Erreur de validation' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Construction Québec</h1>
        <p className="text-gray-400 mt-1">Conformité RBQ, CCQ et CNESST</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">RBQ</p>
              <p className="text-xs text-gray-500">Licences</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{metiers?.metiers?.length || 25}</p>
              <p className="text-xs text-gray-500">Métiers CCQ</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">CNESST</p>
              <p className="text-xs text-gray-500">Sécurité</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{programs?.programs?.length || 6}</p>
              <p className="text-xs text-gray-500">Subventions</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RBQ Validation */}
        <Card variant="glass">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-orange-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Validation Licence RBQ</h2>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Ex: 5678-1234-56"
              value={licenceNumber}
              onChange={(e) => setLicenceNumber(e.target.value)}
              icon={<FileCheck size={18} />}
            />
            <Button onClick={handleValidateLicence}>
              <Search size={18} className="mr-2" />
              Valider
            </Button>
          </div>
          {licenceResult && (
            <div className="mt-4 p-4 rounded-xl bg-gray-800/50">
              {licenceResult.error ? (
                <p className="text-red-400">{licenceResult.error}</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={licenceResult.format_valid ? 'success' : 'error'}>
                      {licenceResult.format_valid ? 'Format valide' : 'Format invalide'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Licence: {licenceResult.licence_number}
                  </p>
                  <a 
                    href={licenceResult.verification_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-chenu-400 hover:underline"
                  >
                    Vérifier sur le site RBQ →
                  </a>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* CCQ Métiers */}
        <Card variant="glass">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Métiers CCQ</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {metiers?.metiers?.map((metier: any) => (
              <Badge key={metier.value} variant="default" className="justify-center py-2">
                {metier.name || metier.value}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Subventions */}
        <Card variant="glass" className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-green-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Programmes de Subventions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs?.programs?.map((program: any, index: number) => (
              <div key={index} className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="font-semibold text-white">{program.nom}</h3>
                <p className="text-sm text-gray-400 mt-1">{program.description}</p>
                <p className="text-lg font-bold text-green-400 mt-2">
                  Jusqu'à {program.montant_max?.toLocaleString()} $
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {program.travaux_eligibles?.slice(0, 3).map((travail: string, i: number) => (
                    <Badge key={i} variant="info" size="sm">{travail}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
