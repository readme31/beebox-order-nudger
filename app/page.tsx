"use client"

import { useState } from "react"
import { SKUS, CLIENTS, STICKER_TIERS, SKU, Client } from "@/lib/data"
import { calculateTier, sumCartPieces } from "@/lib/tierEngine"

interface CartLine {
  sku: SKU
  quantity: number
}

export default function Home() {
  const [selectedClient, setSelectedClient] = useState<Client>(CLIENTS[0])
  const [cart, setCart] = useState<CartLine[]>([])
  const [nudge, setNudge] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [nudgeCount, setNudgeCount] = useState(0)

  const totalPieces = sumCartPieces(cart)
  const tierResult = calculateTier(totalPieces)

  function addToCart(sku: SKU) {
    setCart((prev) => {
      const existing = prev.find((l) => l.sku.code === sku.code)
      if (existing) {
        return prev.map((l) =>
          l.sku.code === sku.code ? { ...l, quantity: l.quantity + 100 } : l
        )
      }
      return [...prev, { sku, quantity: 100 }]
    })
    setNudge("")
    setError("")
  }

  function updateQuantity(code: string, quantity: number) {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((l) => l.sku.code !== code))
    } else {
      setCart((prev) =>
        prev.map((l) => (l.sku.code === code ? { ...l, quantity } : l))
      )
    }
    setNudge("")
    setError("")
  }

  function clearCart() {
    setCart([])
    setNudge("")
    setError("")
  }

  async function generateNudge() {
    if (!tierResult.nextTier) return
    setIsLoading(true)
    setError("")
    setNudge("")

    try {
      const res = await fetch("/api/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: selectedClient.name,
          currentTierLabel: tierResult.currentTier?.label ?? "none",
          nextTierLabel: tierResult.nextTier.label,
          piecesNeeded: tierResult.piecesNeeded,
          stickersAtNextTier: tierResult.nextTier.stickers,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }

      setNudge(data.nudge)
      setNudgeCount((c) => c + 1)
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function copyNudge() {
    await navigator.clipboard.writeText(nudge)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalValue = cart.reduce(
    (sum, l) => sum + l.sku.unitPrice * l.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">
              🐝 Beebox Order-Value Maximizer
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Staff tool — detect tier gaps and generate upsell nudges
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            Nudges generated: <span className="text-amber-400 font-bold">{nudgeCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Client + SKU selector */}
          <div className="lg:col-span-1 space-y-4">
            {/* Client selector */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Client
              </h2>
              <select
                className="w-full bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-amber-400"
                value={selectedClient.id}
                onChange={(e) => {
                  const client = CLIENTS.find((c) => c.id === e.target.value)
                  if (client) {
                    setSelectedClient(client)
                    setNudge("")
                    setError("")
                  }
                }}
              >
                {CLIENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="mt-3 space-y-1 text-xs text-gray-400">
                <div>Type: <span className="text-gray-300">{selectedClient.type}</span></div>
                <div>
                  Lifetime volume:{" "}
                  <span className="text-gray-300">
                    {selectedClient.lifetimeVolume.toLocaleString()} pcs
                  </span>
                </div>
                {selectedClient.lifetimeVolume >= 10000 && (
                  <div className="mt-2 text-amber-400 font-semibold">
                    ⭐ Custom-Ready
                  </div>
                )}
              </div>
            </div>

            {/* SKU list */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Add to Cart
              </h2>
              <div className="space-y-2">
                {SKUS.map((sku) => (
                  <button
                    key={sku.code}
                    onClick={() => addToCart(sku)}
                    className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 text-sm transition-colors border border-gray-700 hover:border-amber-400"
                  >
                    <div className="text-gray-100">{sku.name}</div>
                    <div className="text-amber-400 text-xs">
                      ₱{sku.unitPrice.toFixed(2)} / pc
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Each click adds 100 pcs. Adjust quantity in cart.
              </p>
            </div>
          </div>

          {/* Right: Cart + Tier panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Cart
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">
                  No items yet. Add SKUs from the left panel.
                </p>
              ) : (
                <div className="space-y-2">
                  {cart.map((line) => (
                    <div
                      key={line.sku.code}
                      className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-100 truncate">
                          {line.sku.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          ₱{line.sku.unitPrice.toFixed(2)} × {line.quantity} ={" "}
                          <span className="text-amber-400">
                            ₱{(line.sku.unitPrice * line.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={line.quantity}
                        onChange={(e) =>
                          updateQuantity(line.sku.code, parseInt(e.target.value) || 0)
                        }
                        className="w-20 bg-gray-700 text-gray-100 rounded px-2 py-1 text-sm text-right border border-gray-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-700 mt-2">
                    <div className="text-sm text-gray-400">
                      Total:{" "}
                      <span className="text-white font-semibold">
                        {totalPieces.toLocaleString()} pcs
                      </span>
                    </div>
                    <div className="text-sm text-amber-400 font-semibold">
                      ₱{totalValue.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tier status */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Sticker Tier Status
              </h2>

              {/* Tier progress bar */}
              <div className="flex items-center gap-2 mb-4">
                {STICKER_TIERS.map((tier, i) => {
                  const reached = totalPieces >= tier.minPieces
                  const isCurrent =
                    tierResult.currentTier?.label === tier.label
                  return (
                    <div key={tier.label} className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                          reached
                            ? "bg-amber-400 text-gray-900"
                            : "bg-gray-800 text-gray-500 border border-gray-700"
                        } ${isCurrent ? "ring-2 ring-amber-300" : ""}`}
                      >
                        {tier.label}
                        <div className="font-normal opacity-75">
                          {tier.stickers}🏷
                        </div>
                      </div>
                      {i < STICKER_TIERS.length - 1 && (
                        <div
                          className={`h-px w-4 ${
                            reached ? "bg-amber-400" : "bg-gray-700"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Status message */}
              {totalPieces === 0 && (
                <p className="text-gray-500 text-sm">
                  Add items to see tier status.
                </p>
              )}

              {totalPieces > 0 && tierResult.isBelowAllTiers && (
                <p className="text-yellow-400 text-sm">
                  {tierResult.piecesNeeded} more pieces to reach Bronze tier
                  and earn 25 free stickers.
                </p>
              )}

              {totalPieces > 0 && tierResult.currentTier && !tierResult.isTopTier && (
                <div className="space-y-1">
                  <p className="text-green-400 text-sm">
                    Current: <strong>{tierResult.currentTier.label}</strong> —{" "}
                    {tierResult.currentTier.stickers} free stickers earned
                  </p>
                  <p className="text-amber-300 text-sm">
                    Just{" "}
                    <strong>{tierResult.piecesNeeded.toLocaleString()} more pieces</strong>{" "}
                    to reach <strong>{tierResult.nextTier?.label}</strong> and
                    earn {tierResult.nextTier?.stickers} stickers.
                  </p>
                </div>
              )}

              {tierResult.isTopTier && (
                <p className="text-amber-400 font-semibold text-sm">
                  Diamond tier reached. 900 free stickers earned.
                </p>
              )}
            </div>

            {/* Nudge generator */}
            {totalPieces > 0 && !tierResult.isTopTier && (
              <div className="bg-gray-900 rounded-xl p-4 border border-amber-400/30">
                <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-3">
                  AI Nudge Generator
                </h2>

                <button
                  onClick={generateNudge}
                  disabled={isLoading || !tierResult.nextTier}
                  className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 font-semibold rounded-lg px-4 py-3 text-sm transition-colors"
                >
                  {isLoading ? "Generating..." : "Generate Staff Nudge Line"}
                </button>

                {error && (
                  <div className="mt-3 bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {nudge && (
                  <div className="mt-3 bg-amber-400/10 border border-amber-400/40 rounded-lg px-4 py-3">
                    <p className="text-amber-100 text-sm leading-relaxed">
                      {nudge}
                    </p>
                    <button
                      onClick={copyNudge}
                      className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {copied ? "Copied!" : "Copy to clipboard"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}