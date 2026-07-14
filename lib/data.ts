// Beebox Order-Value Maximizer — Seed Data
// SKU prices sourced from Beebox Generic Packaging Masterlist (Non-VAT)
// Client names and order history are anonymized demo data

export interface SKU {
    code: string
    name: string
    unitPrice: number // PHP, Non-VAT
  }
  
  export interface OrderLine {
    sku: SKU
    quantity: number
  }
  
  export interface Client {
    id: string
    name: string
    type: string
    lifetimeVolume: number // total pieces ordered across all time
  }
  
  // ---------------------------------------------------------------------------
  // SKUs — real prices from Beebox masterlist, anonymized product groupings
  // ---------------------------------------------------------------------------
  export const SKUS: SKU[] = [
    { code: "HC-60",   name: "Hinged Cup 60mL",         unitPrice: 1.85 },
    { code: "HC-120",  name: "Hinged Cup 120mL",         unitPrice: 2.10 },
    { code: "SB-500",  name: "Spaghetti Box 500cc",      unitPrice: 2.97 },
    { code: "CB-STD",  name: "Clamshell Burger Box",     unitPrice: 3.48 },
    { code: "MB-750",  name: "Meal Box 750cc",            unitPrice: 5.15 },
    { code: "MB-1000", name: "Meal Box 1000cc",           unitPrice: 6.80 },
    { code: "MB-1500", name: "Meal Box 1500cc",           unitPrice: 9.29 },
    { code: "SC-200",  name: "Sauce Cup 200mL",           unitPrice: 1.45 },
    { code: "SC-400",  name: "Sauce Cup 400mL",           unitPrice: 1.95 },
    { code: "RB-STD",  name: "Rice Box Standard",         unitPrice: 4.25 },
  ]
  
  // ---------------------------------------------------------------------------
  // Demo clients — anonymized, order history invented for realistic demo flow
  // ---------------------------------------------------------------------------
  export const CLIENTS: Client[] = [
    {
      id: "C001",
      name: "Sunrise Eatery",
      type: "Small Eatery",
      lifetimeVolume: 3200,
    },
    {
      id: "C002",
      name: "Golden Wok Foodhaus",
      type: "Chinese Restaurant",
      lifetimeVolume: 7800,
    },
    {
      id: "C003",
      name: "Mang Tomas Catering",
      type: "Catering",
      lifetimeVolume: 9600,
    },
    {
      id: "C004",
      name: "Cloud9 Kitchen",
      type: "Cloud Kitchen",
      lifetimeVolume: 450,
    },
    {
      id: "C005",
      name: "Lola Nena's Diner",
      type: "Carinderia",
      lifetimeVolume: 1100,
    },
  ]
  
  // ---------------------------------------------------------------------------
  // Sticker tiers — Beebox reward structure
  // ---------------------------------------------------------------------------
  export interface StickerTier {
    minPieces: number
    stickers: number
    label: string
  }
  
  export const STICKER_TIERS: StickerTier[] = [
    { minPieces: 500,    stickers: 25,  label: "Bronze" },
    { minPieces: 1000,   stickers: 60,  label: "Silver" },
    { minPieces: 3000,   stickers: 200, label: "Gold"   },
    { minPieces: 5000,   stickers: 400, label: "Platinum" },
    { minPieces: 10000,  stickers: 900, label: "Diamond" },
  ]
  
  // Custom-Ready lifetime volume threshold
  export const CUSTOM_READY_THRESHOLD = 10000