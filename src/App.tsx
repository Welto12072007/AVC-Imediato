import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { Navigation } from '@/components/Navigation'
import { AuthDialog } from '@/components/AuthDialog'
import { ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Heart, FirstAid, ArrowRight, CheckCircle } from '@phosphor-icons/react'

function AppContent() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      <Navigation onAuthClick={() => setAuthDialogOpen(true)} />
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      <section id="hero" className="hero-gradient min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="container mx-auto max-w-4xl text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <CheckCircle size={20} />
            <span>Trabalhos de Conclusão de Curso</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-tight">
            Tecnologia para
            <span className="block text-primary mt-2">Salvar Vidas</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Conheça dois projetos inovadores desenvolvidos para facilitar o acesso a informações cruciais de saúde e primeiros socorros
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="text-base px-8" onClick={() => setAuthDialogOpen(true)}>
                Acessar Projetos
                <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" onClick={() => {
                const element = document.getElementById('about')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}>
                Saiba Mais
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-primary font-semibold">✓ Você está autenticado</p>
              <Button size="lg" className="text-base px-8" onClick={() => {
                const element = document.getElementById('projects')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}>
                Ver Projetos
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Sobre os Projetos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Aplicações móveis desenvolvidas com foco em saúde pública e prevenção de emergências
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6 p-8 rounded-2xl bg-card border-2 border-border hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Heart size={32} className="text-primary" weight="fill" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-semibold mb-3">AVC Alerta</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Aplicativo móvel especializado em identificação precoce dos sintomas de AVC (Acidente Vascular Cerebral).
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Reconhecimento rápido de sintomas de AVC</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Informações sobre tipos e recuperação</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Orientações nutricionais personalizadas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Integração com wearables para monitoramento</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-2xl bg-card border-2 border-border hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                <FirstAid size={32} className="text-secondary" weight="fill" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-semibold mb-3">Socorro Imediato</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Aplicativo de primeiros socorros offline, preparado para auxiliar em situações emergenciais do cotidiano.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Funciona completamente offline</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Instruções claras e passo a passo</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Interface simples e rápida de usar</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={20} className="text-secondary mr-2 mt-0.5 flex-shrink-0" weight="fill" />
                    <span>Desenvolvido em React Native</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col items-center space-y-4 p-8 rounded-2xl bg-muted/50 border-2 border-dashed border-border">
                <p className="text-lg font-medium">Quer conhecer mais detalhes e baixar os aplicativos?</p>
                <Button size="lg" onClick={() => setAuthDialogOpen(true)}>
                  Fazer Login ou Registrar
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {isAuthenticated && (
        <section id="projects" className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Baixe os Aplicativos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Acesse os detalhes completos e faça o download dos aplicativos para Android
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <ProjectCard
                title="AVC Alerta"
                description="Identificação rápida dos primeiros sintomas de AVC e informações sobre recuperação. Facilite a identificação precoce e promova atendimento médico imediato."
                features={[
                  'Reconhecimento de sintomas em tempo real',
                  'Guia completo sobre tipos de AVC',
                  'Orientações nutricionais especializadas',
                  'Monitoramento de sinais vitais via wearables',
                  'Alertas e notificações importantes'
                ]}
                icon={<Heart size={32} weight="fill" />}
                badgeText="Prevenção de AVC"
                badgeVariant="default"
              />

              <ProjectCard
                title="Socorro Imediato"
                description="Primeiros socorros offline para situações do dia a dia. Instruções claras para reduzir acidentes e melhorar a segurança da sociedade."
                features={[
                  'Funciona 100% offline',
                  'Instruções passo a passo ilustradas',
                  'Busca rápida por tipo de emergência',
                  'Interface intuitiva e acessível',
                  'Desenvolvido em React Native'
                ]}
                icon={<FirstAid size={32} weight="fill" />}
                badgeText="Primeiros Socorros"
                badgeVariant="secondary"
              />
            </div>
          </div>
        </section>
      )}

      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                  <span className="text-foreground font-bold text-lg">+</span>
                </div>
                <span className="font-heading font-bold text-lg">TCC Saúde</span>
              </div>
              <p className="text-sm text-background/80">
                Projetos de conclusão de curso focados em tecnologia para saúde e prevenção de emergências.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Projetos</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>AVC Alerta</li>
                <li>Socorro Imediato</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <p className="text-sm text-background/80">
                Desenvolvido como trabalhos de conclusão de curso na área de tecnologia aplicada à saúde.
              </p>
            </div>
          </div>

          <Separator className="bg-background/20 mb-8" />

          <div className="text-center text-sm text-background/60">
            <p>© 2024 TCC Saúde. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <Toaster position="top-center" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
