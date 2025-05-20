import Link from "next/link"
import { Twitter, Linkedin, Send, MessageSquare, FileText, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-opacity-20 bg-gradient-to-r from-emerald-950/80 to-purple-950/80 backdrop-blur">
      {/* Gradient border highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 via-purple-500/50 to-transparent"></div>

      {/* Animated background elements */}
      <div className="absolute top-10 left-20 h-64 w-64 animate-float-slow rounded-full bg-emerald-500/5 blur-3xl"></div>
      <div className="absolute bottom-10 right-20 h-64 w-64 animate-float animation-delay-2000 rounded-full bg-purple-500/5 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-3 py-8 sm:px-4 sm:py-10 md:py-12 lg:px-8">
        {/* Information Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 sm:gap-8">
          {/* WAGA Academy Column */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-dual-gradient-text-glow">WAGA Protocol</h3>
            <p className="text-sm text-muted-foreground">
              Revolutionizing the coffee value chain through blockchain technology, transparency, and financial
              empowerment
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-gradient-text-glow">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-emerald-300 transition-colors"
                >
                  Key Features
                </Link>
              </li>
              <li>
                <Link
                  href="#roadmap"
                  className="text-sm text-muted-foreground hover:text-emerald-300 transition-colors"
                >
                  Development Roadmap
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-sm text-muted-foreground hover:text-emerald-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/community/dashboard"
                  className="text-sm text-muted-foreground hover:text-emerald-300 transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Paths Column */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-gradient-text-purple-animated">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/community/forums"
                  className="text-sm text-muted-foreground hover:text-purple-300 transition-colors"
                >
                  Discussion Forums
                </Link>
              </li>
              <li>
                <Link
                  href="/community/resources"
                  className="text-sm text-muted-foreground hover:text-purple-300 transition-colors"
                >
                  Resources Library
                </Link>
              </li>
              <li>
                <Link
                  href="/community/events"
                  className="text-sm text-muted-foreground hover:text-purple-300 transition-colors"
                >
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  href="/community/members"
                  className="text-sm text-muted-foreground hover:text-purple-300 transition-colors"
                >
                  Member Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium web3-dual-gradient-text-glow">Contact</h3>
            <p className="text-sm text-muted-foreground">Email: team@wagatoken.io</p>
            <p className="text-sm text-muted-foreground">Based in Ethiopia with a global community</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-6 border-t border-purple-500/20 flex flex-col items-center space-y-4">
          <h3 className="text-lg font-medium">
            <span className="bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent">
              Connect With Us
            </span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://x.com/WagaAcademy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gradient-to-br from-emerald-950/50 to-purple-950/50 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all duration-300 animate-border-glow"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-emerald-400" />
            </Link>
            <Link
              href="https://linkedin.com/company/waga-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gradient-to-br from-purple-950/50 to-emerald-950/50 border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 transition-all duration-300 animate-border-glow"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-purple-400" />
            </Link>
            <Link
              href="https://t.me/wagaprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gradient-to-br from-emerald-950/50 to-purple-950/50 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all duration-300 animate-border-glow"
              aria-label="Telegram"
            >
              <Send className="h-5 w-5 text-emerald-400" />
            </Link>
            <Link
              href="https://discord.gg/wagaprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gradient-to-br from-purple-950/50 to-emerald-950/50 border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 transition-all duration-300 animate-border-glow"
              aria-label="Discord"
            >
              <MessageSquare className="h-5 w-5 text-purple-400" />
            </Link>
            <Link
              href="https://github.com/waga-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gradient-to-br from-emerald-950/50 to-purple-950/50 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all duration-300 animate-border-glow"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 text-emerald-400" />
            </Link>
            <Link
              href="https://docs.wagaprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gradient-to-br from-purple-950/50 to-emerald-950/50 border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 transition-all duration-300 animate-border-glow"
              aria-label="Documentation"
            >
              <FileText className="h-5 w-5 text-purple-400" />
            </Link>
          </div>
          <div className="mt-3 text-xs sm:text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} WAGA Protocol. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
