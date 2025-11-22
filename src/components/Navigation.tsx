import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { SignOut, List, X } from '@phosphor-icons/react'
import logo from '@/assets/imgs/logoDoAvcImediato-removebg-preview.png'

interface NavigationProps {
  onAuthClick: () => void
}

export function Navigation({ onAuthClick }: NavigationProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMobileMenuOpen(false)
    }
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Logo AVC Imediato" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-heading font-bold text-lg">AVC Imediato</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sobre
            </button>
            {isAuthenticated && (
              <button
                onClick={() => scrollToSection('projects')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Projetos
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user?.username || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.username}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <SignOut className="mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button onClick={onAuthClick} size="sm">
                Acessar Projetos
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Sobre
            </button>
            {isAuthenticated && (
              <button
                onClick={() => scrollToSection('projects')}
                className="block w-full text-left py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Projetos
              </button>
            )}

            <div className="pt-4 border-t border-border">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user?.username || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="w-full">
                    <SignOut className="mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button onClick={onAuthClick} size="sm" className="w-full">
                  Acessar Projetos
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
