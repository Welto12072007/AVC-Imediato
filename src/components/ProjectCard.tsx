import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, QrCode } from '@phosphor-icons/react'

interface ProjectCardProps {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
  badgeText: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function ProjectCard({ title, description, features, icon, badgeText, badgeVariant = 'default' }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            Principais Funcionalidades
          </h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg border-2 border-dashed border-border">
            <div className="text-center space-y-2">
              <QrCode size={48} className="mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-medium">QR Code</p>
              <p className="text-xs text-muted-foreground">Em breve disponível</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" size="lg" asChild>
          <a href="#" className="flex items-center justify-center">
            <Download className="mr-2" size={20} />
            Baixar APK
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
