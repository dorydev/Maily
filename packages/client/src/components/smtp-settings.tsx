"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Copy, RefreshCw, Eye, EyeOff } from "lucide-react"

export function SmtpSettings() {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <>

      <div className="p-6 lg:p-8">
        <Tabs defaultValue="api-smtp" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto gap-0 w-full justify-start">
            <TabsTrigger
              value="domain"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-1 text-sm"
            >
              Verification Domaine
            </TabsTrigger>
            <TabsTrigger
              value="api-smtp"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-1 text-sm"
            >
              API et SMTP
            </TabsTrigger>
            <TabsTrigger
              value="tracking"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-1 text-sm"
            >
              Suivi
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-1 text-sm"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Domain Verification */}
          <TabsContent value="domain" className="mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Verification de Domaine</CardTitle>
                <CardDescription>
                  Ajoutez les enregistrements DNS suivants pour verifier votre domaine.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium text-muted-foreground py-3 pr-4">Type</th>
                        <th className="text-left font-medium text-muted-foreground py-3 pr-4">Nom</th>
                        <th className="text-left font-medium text-muted-foreground py-3 pr-4">Valeur</th>
                        <th className="text-left font-medium text-muted-foreground py-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 pr-4 font-mono text-xs text-foreground">TXT</td>
                        <td className="py-3 pr-4 font-mono text-xs text-foreground">@</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">v=spf1 include:mailflow.io ~all</code>
                            <button
                              onClick={() => copyToClipboard("v=spf1 include:mailflow.io ~all", "spf")}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Copy SPF record"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {copied === "spf" && <span className="text-xs text-emerald-600">Copie</span>}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                            Verifie
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 pr-4 font-mono text-xs text-foreground">CNAME</td>
                        <td className="py-3 pr-4 font-mono text-xs text-foreground">mail._domainkey</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">dkim.mailflow.io</code>
                            <button
                              onClick={() => copyToClipboard("dkim.mailflow.io", "dkim")}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Copy DKIM record"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {copied === "dkim" && <span className="text-xs text-emerald-600">Copie</span>}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                            En attente
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API and SMTP */}
          <TabsContent value="api-smtp" className="mt-6 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Integration API et SMTP</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Utilisez MailFlow API ou configurez MailFlow comme serveur SMTP dans votre projet.
              </p>
            </div>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Integrations</CardTitle>
                  <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reinitialiser
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="smtp">
                  <TabsList className="mb-4">
                    <TabsTrigger value="api">API</TabsTrigger>
                    <TabsTrigger value="smtp">SMTP</TabsTrigger>
                  </TabsList>

                  <TabsContent value="api">
                    <Card className="border-border bg-muted/30">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-foreground mb-4">API</h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">Endpoint :</span>
                            <code className="text-sm text-muted-foreground">https://api.mailflow.io/v1/send</code>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">API Key :</span>
                            <div className="flex items-center gap-2">
                              <code className="text-sm text-muted-foreground">
                                {showPassword ? "mf_live_abc123def456" : "mf_live_*******f456"}
                              </code>
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Toggle visibility"
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => copyToClipboard("mf_live_abc123def456", "apikey")}
                              >
                                {copied === "apikey" ? "Copie" : "Copier"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="smtp">
                    <Card className="border-border bg-muted/30">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-foreground mb-4">SMTP</h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">Host :</span>
                            <code className="text-sm text-muted-foreground">live.smtp.mailflow.io</code>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">Port :</span>
                            <code className="text-sm text-muted-foreground">587 (recommande), 2525 ou 25</code>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">Username :</span>
                            <code className="text-sm text-muted-foreground">api</code>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">Password :</span>
                            <div className="flex items-center gap-2">
                              <code className="text-sm text-muted-foreground">
                                {showPassword ? "smtp_abc123def456" : "********f456"}
                              </code>
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Toggle visibility"
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => copyToClipboard("smtp_abc123def456", "smtppass")}
                              >
                                {copied === "smtppass" ? "Copie" : "Copier"}
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">Auth :</span>
                            <code className="text-sm text-muted-foreground">PLAIN, LOGIN</code>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-foreground sm:w-32">STARTTLS :</span>
                            <code className="text-sm text-muted-foreground">Requis</code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking */}
          <TabsContent value="tracking" className="mt-6 flex flex-col gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Parametres de Suivi</CardTitle>
                <CardDescription>
                  Configurez le suivi des ouvertures et des clics pour vos emails.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Suivi des ouvertures</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Detecte quand un destinataire ouvre votre email.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Suivi des clics</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Detecte quand un destinataire clique sur un lien.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Domaine de suivi personnalise</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Utilisez votre propre domaine pour le suivi.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-6 flex flex-col gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Preferences de Notifications</CardTitle>
                <CardDescription>
                  Choisissez les notifications que vous souhaitez recevoir.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Alertes de delivrabilite</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Soyez alerte si votre taux de delivrabilite baisse.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Rapports hebdomadaires</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Recevez un resume hebdomadaire de votre activite.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="border-t border-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Alertes de quota</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Notification lorsque vous approchez votre limite.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Email de notification</CardTitle>
                <CardDescription>
                  Adresse email pour recevoir les alertes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Input
                    defaultValue="jean@example.com"
                    className="max-w-sm bg-card"
                  />
                  <Button variant="outline">Sauvegarder</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
