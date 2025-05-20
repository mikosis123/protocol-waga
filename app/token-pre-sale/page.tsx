"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Check, Coins, Gem, GraduationCap, Percent, Users, X } from "lucide-react"
import ParticleBackground from "@/components/particle-background"
import HexagonGrid from "@/components/hexagon-grid"
import Web3Button from "@/components/web3-button"
import Web3Card from "@/components/web3-card"
import DynamicGlowCard from "@/components/dynamic-glow-card"
import { Button } from "@/components/ui/button"
import { TokenPurchaseTabs } from "@/components/token-purchase-tabs"
import { useWallet } from "@/context/wallet-context"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const gradientTextStyle = {
  color: "transparent",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  backgroundImage: "linear-gradient(to right, rgba(16, 185, 129, 1), rgba(147, 51, 234, 1), rgba(16, 185, 129, 1))",
  backgroundSize: "300% auto",
}

// Mock data for token shop (would be replaced with actual contract values)
const TOKEN_PRICE_USD = 0.1 // $0.1 per token
const MIN_PURCHASE_USD = 10 // $10 minimum purchase
const MOCK_ETH_USD_PRICE = 3500 // $ per ETH

export default function TokenPreSalePage() {
  const [email, setEmail] = useState("")
  const [showNotification, setShowNotification] = useState(true)
  const [ethAmount, setEthAmount] = useState("")
  const [usdcAmount, setUsdcAmount] = useState("")
  const [tokenAmount, setTokenAmount] = useState("0")
  const [ethUsdPrice, setEthUsdPrice] = useState(MOCK_ETH_USD_PRICE)
  const { isConnected, openConnectModal } = useWallet()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would normally submit to a backend
    alert(`Thank you! We'll notify ${email} when the token sale begins.`)
    setEmail("")
    setShowNotification(false)
  }

  // Calculate token amount based on ETH input
  useEffect(() => {
    if (ethAmount && !isNaN(Number.parseFloat(ethAmount))) {
      const ethValue = Number.parseFloat(ethAmount)
      const usdValue = ethValue * ethUsdPrice
      const tokens = usdValue / TOKEN_PRICE_USD
      setTokenAmount(tokens.toFixed(2))
    } else if (usdcAmount && !isNaN(Number.parseFloat(usdcAmount))) {
      const usdcValue = Number.parseFloat(usdcAmount)
      const tokens = usdcValue / TOKEN_PRICE_USD
      setTokenAmount(tokens.toFixed(2))
    } else {
      setTokenAmount("0")
    }
  }, [ethAmount, usdcAmount, ethUsdPrice])

  // Simulate fetching ETH price every 30 seconds
  useEffect(() => {
    const fetchEthPrice = () => {
      // In a real implementation, this would call an API or the contract's getEthUsdPrice()
      // For demo purposes, we'll just simulate price fluctuations
      const randomChange = (Math.random() - 0.5) * 100
      setEthUsdPrice((prev) => Math.max(prev + randomChange, 1000))
    }

    fetchEthPrice() // Initial fetch
    const interval = setInterval(fetchEthPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setEthAmount(value)
      setUsdcAmount("")
    }
  }

  const handleUsdcAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUsdcAmount(value)
      setEthAmount("")
    }
  }

  const handleBuyWithEth = () => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    const ethValue = Number.parseFloat(ethAmount)
    const usdValue = ethValue * ethUsdPrice

    if (usdValue < MIN_PURCHASE_USD) {
      alert(`Minimum purchase is $${MIN_PURCHASE_USD}`)
      return
    }

    // This would call the contract's buyWithEth function
    alert(`You would purchase ${tokenAmount} WAGA tokens for ${ethAmount} ETH`)
  }

  const handleBuyWithUsdc = () => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    const usdcValue = Number.parseFloat(usdcAmount)

    if (usdcValue < MIN_PURCHASE_USD) {
      alert(`Minimum purchase is $${MIN_PURCHASE_USD}`)
      return
    }

    // This would call the contract's buyWithUSDC function
    alert(`You would purchase ${tokenAmount} WAGA tokens for ${usdcAmount} USDC`)
  }

  return (
    <div className="overflow-hidden bg-gradient-to-b from-emerald-900/30 via-emerald-950/40 to-emerald-950/50">
      {/* Web3 Background Elements */}
      <ParticleBackground />
      <HexagonGrid className="opacity-30" />

      {/* Consistent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-emerald-950/30 to-emerald-950/40 pointer-events-none"></div>

      {/* Coming Soon Notification - Now a banner at the top instead of a full overlay */}
      {showNotification && (
        <div className="fixed top-20 left-0 right-0 z-40 flex justify-center px-4">
          <div className="max-w-2xl w-full">
            <DynamicGlowCard variant="purple" className="p-6" intensity="high">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-purple-300 purple-glow">Token Pre-Sale Coming Soon</h2>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-300 mb-4">
                Be the first to know when our token pre-sale launches. Sign up for notifications.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-md bg-black/50 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
                <Button
                  type="submit"
                  className="py-2 rounded-md bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-medium transition-all duration-200"
                >
                  Notify Me
                </Button>
              </form>
            </DynamicGlowCard>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-32 pb-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-emerald-950/40"></div>
          <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20"></div>

          {/* Animated token circles */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Floating blockchain nodes */}
          <div className="absolute top-1/3 right-1/3 flex space-x-2 animate-bounce" style={{ animationDuration: "6s" }}>
            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
          </div>
          <div
            className="absolute bottom-1/4 left-1/3 flex space-x-2 animate-bounce"
            style={{ animationDuration: "8s", animationDelay: "1s" }}
          >
            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Token Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="flex justify-start mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-purple-400 blur animate-pulse"></div>
                  <div className="relative px-6 py-2 rounded-full bg-black/80 border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse"></div>
                      <span className="text-white font-bold">WGTN TOKEN</span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-emerald-400 mb-4 tracking-wide">WAGA PROTOCOL</h2>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                <span className="block mb-4 web3-dual-gradient-text-glow">Utility Token Pre-Sale</span>
              </h1>

              <div className="mt-6 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-emerald-400">OnChain Coffee.</span>{" "}
                  <span className="text-purple-400">OffChart Impact</span>
                </h2>
              </div>

              {/* Token metrics */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/20">
                  <div className="text-emerald-400 font-bold text-2xl">30%</div>
                  <div className="text-gray-400 text-sm">Community Rewards</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="text-purple-400 font-bold text-2xl">${TOKEN_PRICE_USD}</div>
                  <div className="text-gray-400 text-sm">Token Price</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/20">
                  <div className="text-emerald-400 font-bold text-2xl">1B</div>
                  <div className="text-gray-400 text-sm">Total Supply</div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="text-purple-400 font-bold text-2xl">Q2 2025</div>
                  <div className="text-gray-400 text-sm">Launch Date</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Token Purchase */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <DynamicGlowCard variant="dual" className="p-6" intensity="medium">
                <h2 className="text-2xl font-bold mb-4 text-center web3-dual-gradient-text-glow">Buy WAGAToken</h2>

                {/* Custom Token Purchase Tabs Component */}
                <TokenPurchaseTabs
                  ethUsdPrice={ethUsdPrice}
                  ethAmount={ethAmount}
                  usdcAmount={usdcAmount}
                  tokenAmount={tokenAmount}
                  minPurchaseUsd={MIN_PURCHASE_USD}
                  isConnected={isConnected}
                  onEthAmountChange={handleEthAmountChange}
                  onUsdcAmountChange={handleUsdcAmountChange}
                  onBuyWithEth={handleBuyWithEth}
                  onBuyWithUsdc={handleBuyWithUsdc}
                  openConnectModal={openConnectModal}
                />

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Token Price:</span>
                    <span className="text-white font-medium">${TOKEN_PRICE_USD} USD</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-400">Min Purchase:</span>
                    <span className="text-white font-medium">${MIN_PURCHASE_USD} USD</span>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-gray-800/50">
                  <p className="text-xs text-gray-500 italic text-center">
                    This is a demonstration interface. No actual transactions will be processed.
                  </p>
                </div>
              </DynamicGlowCard>

              <div className="mt-6 text-center">
                <Link
                  href="#features"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center"
                >
                  Learn more about WAGAProtocol
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-emerald-950/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="web3-dual-gradient-text-glow" style={gradientTextStyle}>
                Key Features
              </span>
            </h2>
            <p className="mb-16 text-lg text-gray-400">
              Our utility token provides multiple benefits across the WAGA ecosystem
            </p>
          </div>

          <motion.div variants={staggerContainer} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
                      <Coins className="h-6 w-6 text-black" />
                    </div>
                  </div>
                ),
                title: "Staking Rewards",
                description:
                  "Stake WGTN tokens to earn a share in the platform's earnings and access exclusive features in the WAGA ecosystem.",
                variant: "emerald",
              },
              {
                icon: (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-purple-500/20 blur-sm"></div>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                      <Percent className="h-6 w-6 text-black" />
                    </div>
                  </div>
                ),
                title: "Discounts",
                description:
                  "Token holders enjoy exclusive discounts when purchasing WAGA coffee products, enhancing value for loyal customers.",
                variant: "purple",
              },
              {
                icon: (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg">
                      <GraduationCap className="h-6 w-6 text-black" />
                    </div>
                  </div>
                ),
                title: "Academy",
                description:
                  "Gain access to role-based training and employment opportunities throughout the WAGA ecosystem.",
                variant: "emerald",
              },
              {
                icon: (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-purple-500/20 blur-sm"></div>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                      <Gem className="h-6 w-6 text-black" />
                    </div>
                  </div>
                ),
                title: "Capability Building",
                description:
                  "Contribute directly to smallholder coffee farmer capability building programs, supporting sustainable coffee production.",
                variant: "purple",
              },
              {
                icon: (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg">
                      <Users className="h-6 w-6 text-black" />
                    </div>
                  </div>
                ),
                title: "Distributor Access",
                description:
                  "Token holders gain priority access to distributor opportunities in the WAGA ecosystem, enabling participation in the global coffee value chain.",
                variant: "emerald",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn} className={index === 4 ? "lg:col-start-2" : ""}>
                <DynamicGlowCard
                  variant={feature.variant as "emerald" | "purple"}
                  className="h-full p-6"
                  intensity="medium"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-emerald-300 glow-text">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </DynamicGlowCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="web3-dual-gradient-text-glow" style={gradientTextStyle}>
                Tokenomics
              </span>
            </h2>
            <p className="mb-16 text-lg text-gray-400">
              A balanced token allocation designed for long-term sustainability and growth
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <motion.div variants={fadeIn}>
              <Web3Card variant="dual" className="h-full p-8 web3-card-glow">
                <h3 className="mb-6 text-2xl font-bold text-purple-300 purple-glow">Token Allocation</h3>
                <div className="space-y-4">
                  {[
                    { name: "Community Rewards & Staking", percentage: 30, color: "bg-emerald-400" },
                    { name: "Public Token Sale", percentage: 30, color: "bg-purple-400" },
                    { name: "Private Token Sale", percentage: 10, color: "bg-teal-400" },
                    { name: "Founding Team & Advisors", percentage: 5, color: "bg-blue-400" },
                    { name: "Development Team Personnel", percentage: 10, color: "bg-indigo-400" },
                    { name: "Development Fund", percentage: 5, color: "bg-pink-400" },
                    { name: "Community Engagement Fund", percentage: 10, color: "bg-yellow-400" },
                  ].map((item, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="text-gray-300 font-medium">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-2.5">
                        <div
                          className={`${item.color} h-2.5 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Web3Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <DynamicGlowCard variant="emerald" className="h-full p-8">
                <h3 className="mb-6 text-2xl font-bold text-emerald-400 glow-text">Token Utility</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 relative">
                      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-gray-300">Community governance participation rights</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 relative">
                      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-gray-300">Fee reductions on platform transactions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 relative">
                      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-gray-300">Access to premium features and services</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 relative">
                      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-gray-300">Participation in community-driven initiatives</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 relative">
                      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm"></div>
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-gray-300">Staking rewards from platform revenue</p>
                  </li>
                </ul>
              </DynamicGlowCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Section - Alternative Display */}
      <section className="py-20 bg-emerald-950/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="web3-dual-gradient-text-glow" style={gradientTextStyle}>
                Token Launch Roadmap
              </span>
            </h2>
            <p className="mb-16 text-lg text-gray-400">Creating the WAGA Experience</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                phase: "Phase 1: Initial Development",
                timeline: "Q1-Q2 2025",
                description:
                  "Utility token (WAGAToken) presale launch alongside MVP development completion and WAGA Academy curriculum development.",
                variant: "emerald",
                icon: "🚀",
              },
              {
                phase: "Phase 2: Pilot & Feedback",
                timeline: "Q2-Q4 2025",
                description:
                  "Launch pilot study with coffee producers, integrate DeFi functionalities for liquidity pools, and run community-driven campaigns to boost adoption.",
                variant: "purple",
                icon: "🔍",
              },
              {
                phase: "Phase 3: Scaling & Optimization",
                timeline: "Q1 2026",
                description:
                  "Implement learnings from pilot study, add advanced features like decentralized trade finance, and secure global partnerships with coffee industry stakeholders.",
                variant: "emerald",
                icon: "📈",
              },
              {
                phase: "Phase 4: Full Platform Deployment",
                timeline: "Q2 2026",
                description:
                  "Full-scale platform deployment globally with continuous improvements based on user feedback and expansion of WAGA Academy programs.",
                variant: "purple",
                icon: "🌍",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeIn} className="mb-8 last:mb-0">
                <DynamicGlowCard
                  variant={item.variant as "emerald" | "purple"}
                  className="p-6 relative overflow-hidden"
                  intensity="medium"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10 flex items-center justify-center text-6xl">
                    {item.icon}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="md:w-1/3">
                      <h3
                        className={`text-xl font-bold ${item.variant === "purple" ? "text-purple-300 purple-glow" : "text-emerald-400 glow-text"}`}
                      >
                        {item.phase}
                      </h3>
                      <span
                        className={`inline-block mt-2 rounded-full ${item.variant === "purple" ? "bg-purple-800/60 text-purple-300" : "bg-emerald-800/60 text-emerald-300"} px-3 py-1 text-xs`}
                      >
                        {item.timeline}
                      </span>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-gray-300">{item.description}</p>
                      <div className="mt-4">
                        <Link
                          href="#"
                          className={`group inline-flex items-center ${item.variant === "purple" ? "text-purple-400 hover:text-purple-300" : "text-emerald-500 hover:text-emerald-400"}`}
                        >
                          Learn more
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </DynamicGlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DynamicGlowCard variant="purple" className="mx-auto max-w-4xl p-8 sm:p-12" intensity="high">
            <motion.div variants={fadeIn}>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-center">
                <span className="web3-dual-gradient-text-glow" style={gradientTextStyle}>
                  Join the WAGA Token Community
                </span>
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 text-center">
                Be part of a movement to make the coffee value chain fair again. Join our community for exclusive
                updates and early access opportunities.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Web3Button size="lg" variant="gradient" asChild>
                  <Link href="/community/dashboard">Join Community</Link>
                </Web3Button>
                <Web3Button size="lg" variant="emerald" onClick={() => setShowNotification(true)}>
                  Get Notified
                </Web3Button>
              </div>
            </motion.div>
          </DynamicGlowCard>
        </div>
      </section>
    </div>
  )
}
