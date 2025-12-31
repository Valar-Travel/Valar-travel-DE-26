/**
 * Comprehensive Unsplash API Query Configuration
 * Maps each page/section to optimal search queries for dynamic image fetching
 *
 * This configuration ensures:
 * - Consistent image quality and style across the site
 * - Relevant images for each destination and villa type
 * - Fallback queries if primary searches don't return good results
 * - Proper orientation and color filtering
 */

export interface UnsplashQueryConfig {
  primary: string
  fallback?: string[]
  orientation?: "landscape" | "portrait" | "squarish"
  color?: string
  perPage?: number
  contentFilter?: "low" | "high"
}

export const UNSPLASH_QUERIES = {
  // Home Page Sections
  home: {
    hero: {
      primary: "luxury caribbean beach villa aerial view",
      fallback: ["caribbean paradise beach", "tropical luxury resort"],
      orientation: "landscape",
      color: "blue",
    },
    destinationCards: {
      barbados: {
        primary: "barbados pink sand beach pristine",
        fallback: ["barbados coastline", "caribbean beach barbados"],
        orientation: "landscape",
      },
      stLucia: {
        primary: "st lucia pitons mountain view",
        fallback: ["saint lucia beach", "st lucia tropical"],
        orientation: "landscape",
      },
      jamaica: {
        primary: "jamaica turquoise beach palm trees",
        fallback: ["jamaica tropical paradise", "negril beach jamaica"],
        orientation: "landscape",
      },
      stBarthelemy: {
        primary: "st barths harbor luxury yachts",
        fallback: ["saint barthelemy beach", "st barts french caribbean"],
        orientation: "landscape",
      },
    },
    featuredVillas: {
      primary: "luxury caribbean villa pool ocean view",
      fallback: ["tropical luxury villa", "beachfront villa caribbean"],
      orientation: "landscape",
      perPage: 10,
    },
  },

  // Destination Pages
  destinations: {
    barbados: {
      hero: {
        primary: "barbados beach sunset pristine sand",
        fallback: ["barbados coastline aerial", "barbados tropical beach"],
        orientation: "landscape",
        color: "blue",
      },
      villas: {
        beachfront: {
          primary: "barbados luxury beachfront villa white",
          fallback: ["caribbean beachfront villa", "luxury beach house barbados"],
          orientation: "landscape",
        },
        coralReef: {
          primary: "barbados coral reef villa ocean",
          fallback: ["barbados luxury villa pool", "barbados beach villa"],
          orientation: "landscape",
        },
        sandyLane: {
          primary: "barbados sandy lane luxury estate",
          fallback: ["barbados luxury villa golf", "barbados west coast villa"],
          orientation: "landscape",
        },
      },
      activities: {
        beach: {
          primary: "barbados beach activities water sports",
          fallback: ["barbados beach life", "barbados ocean activities"],
          orientation: "landscape",
        },
        dining: {
          primary: "barbados fine dining beachfront restaurant",
          fallback: ["caribbean fine dining", "barbados cuisine"],
          orientation: "landscape",
        },
      },
    },
    stLucia: {
      hero: {
        primary: "st lucia pitons dramatic view sunset",
        fallback: ["saint lucia mountains", "st lucia tropical landscape"],
        orientation: "landscape",
        color: "green",
      },
      villas: {
        oceanBreeze: {
          primary: "st lucia hillside villa ocean view",
          fallback: ["st lucia luxury villa", "saint lucia villa pool"],
          orientation: "landscape",
        },
        rainforest: {
          primary: "st lucia rainforest villa tropical",
          fallback: ["st lucia jungle villa", "st lucia mountain villa"],
          orientation: "landscape",
        },
        sunsetParadise: {
          primary: "st lucia sunset villa infinity pool",
          fallback: ["st lucia luxury villa sunset", "st lucia villa view"],
          orientation: "landscape",
        },
      },
      activities: {
        pitons: {
          primary: "st lucia pitons hiking adventure",
          fallback: ["st lucia mountains", "st lucia nature"],
          orientation: "landscape",
        },
        snorkeling: {
          primary: "st lucia snorkeling coral reef",
          fallback: ["caribbean snorkeling", "st lucia underwater"],
          orientation: "landscape",
        },
      },
    },
    jamaica: {
      hero: {
        primary: "jamaica beach turquoise water palm trees",
        fallback: ["jamaica tropical paradise", "jamaica coastline"],
        orientation: "landscape",
        color: "teal",
      },
      villas: {
        paradiseCove: {
          primary: "jamaica luxury villa beachfront modern",
          fallback: ["jamaica beach villa", "jamaica luxury villa pool"],
          orientation: "landscape",
        },
        negrilSunset: {
          primary: "jamaica negril sunset villa beach",
          fallback: ["negril beach villa", "jamaica west coast villa"],
          orientation: "landscape",
        },
        montegoBay: {
          primary: "jamaica montego bay luxury villa",
          fallback: ["montego bay villa", "jamaica luxury estate"],
          orientation: "landscape",
        },
      },
      activities: {
        beach: {
          primary: "jamaica beach life reggae culture",
          fallback: ["jamaica beach activities", "jamaica tropical beach"],
          orientation: "landscape",
        },
        waterfalls: {
          primary: "jamaica dunn river falls waterfall",
          fallback: ["jamaica waterfall", "jamaica nature"],
          orientation: "landscape",
        },
      },
    },
    stBarthelemy: {
      hero: {
        primary: "st barths harbor luxury yachts french caribbean",
        fallback: ["saint barthelemy beach", "st barts coastline"],
        orientation: "landscape",
        color: "blue",
      },
      villas: {
        elegance: {
          primary: "st barths luxury villa french style",
          fallback: ["st barts villa pool", "saint barthelemy luxury villa"],
          orientation: "landscape",
        },
        coteDazur: {
          primary: "st barths villa mediterranean style ocean",
          fallback: ["st barts french villa", "st barths luxury estate"],
          orientation: "landscape",
        },
        gustaviaHarbor: {
          primary: "st barths gustavia harbor villa view",
          fallback: ["st barts harbor villa", "st barths luxury villa"],
          orientation: "landscape",
        },
      },
      activities: {
        yachting: {
          primary: "st barths yacht sailing luxury",
          fallback: ["caribbean yacht", "st barts sailing"],
          orientation: "landscape",
        },
        shopping: {
          primary: "st barths gustavia shopping french",
          fallback: ["st barts boutique", "caribbean luxury shopping"],
          orientation: "landscape",
        },
      },
    },
  },

  // Villa Types & Features
  villas: {
    types: {
      beachfront: {
        primary: "luxury beachfront villa caribbean white sand",
        fallback: ["beach villa tropical", "oceanfront luxury villa"],
        orientation: "landscape",
      },
      hillside: {
        primary: "hillside villa caribbean ocean view",
        fallback: ["mountain villa tropical", "hillside luxury villa"],
        orientation: "landscape",
      },
      modern: {
        primary: "modern luxury villa caribbean contemporary",
        fallback: ["contemporary villa tropical", "modern beach villa"],
        orientation: "landscape",
      },
      traditional: {
        primary: "traditional caribbean villa colonial style",
        fallback: ["colonial villa caribbean", "traditional tropical villa"],
        orientation: "landscape",
      },
    },
    features: {
      infinityPool: {
        primary: "infinity pool ocean view luxury villa",
        fallback: ["luxury pool villa", "infinity pool caribbean"],
        orientation: "landscape",
      },
      privateBeach: {
        primary: "private beach luxury villa caribbean",
        fallback: ["beach access villa", "private beach tropical"],
        orientation: "landscape",
      },
      masterBedroom: {
        primary: "luxury bedroom ocean view caribbean",
        fallback: ["luxury bedroom tropical", "master bedroom villa"],
        orientation: "landscape",
      },
      gourmetKitchen: {
        primary: "gourmet kitchen luxury villa modern",
        fallback: ["luxury kitchen villa", "modern kitchen tropical"],
        orientation: "landscape",
      },
      outdoorDining: {
        primary: "outdoor dining terrace ocean view",
        fallback: ["outdoor dining villa", "terrace dining caribbean"],
        orientation: "landscape",
      },
      livingRoom: {
        primary: "luxury living room ocean view open",
        fallback: ["luxury living room villa", "open living space tropical"],
        orientation: "landscape",
      },
    },
  },

  // Activities & Experiences
  experiences: {
    beach: {
      primary: "caribbean beach pristine turquoise water",
      fallback: ["tropical beach paradise", "caribbean coastline"],
      orientation: "landscape",
    },
    snorkeling: {
      primary: "caribbean snorkeling coral reef colorful",
      fallback: ["underwater coral caribbean", "snorkeling tropical"],
      orientation: "landscape",
    },
    sailing: {
      primary: "caribbean sailing yacht sunset",
      fallback: ["sailing yacht tropical", "caribbean boat"],
      orientation: "landscape",
    },
    fineDining: {
      primary: "caribbean fine dining beachfront elegant",
      fallback: ["luxury dining tropical", "beachfront restaurant"],
      orientation: "landscape",
    },
    spa: {
      primary: "luxury spa treatment tropical caribbean",
      fallback: ["spa wellness tropical", "luxury spa"],
      orientation: "landscape",
    },
    sunset: {
      primary: "caribbean sunset beach golden hour",
      fallback: ["tropical sunset", "caribbean evening"],
      orientation: "landscape",
      color: "orange",
    },
  },

  // Blog & Content
  blog: {
    travelTips: {
      primary: "caribbean travel planning map passport",
      fallback: ["travel planning", "vacation planning"],
      orientation: "landscape",
    },
    packingGuide: {
      primary: "beach vacation packing suitcase tropical",
      fallback: ["vacation packing", "travel luggage"],
      orientation: "landscape",
    },
    destinationGuide: {
      primary: "caribbean island aerial view paradise",
      fallback: ["tropical island", "caribbean destination"],
      orientation: "landscape",
    },
    villaReview: {
      primary: "luxury villa interior elegant caribbean",
      fallback: ["luxury villa", "villa interior"],
      orientation: "landscape",
    },
  },
} as const

/**
 * Helper function to get query configuration for a specific path
 */
export function getQueryConfig(path: string[]): UnsplashQueryConfig | null {
  let current: any = UNSPLASH_QUERIES

  for (const segment of path) {
    if (current[segment]) {
      current = current[segment]
    } else {
      return null
    }
  }

  return current as UnsplashQueryConfig
}

/**
 * Get all queries for a specific category (useful for pre-fetching)
 */
export function getCategoryQueries(category: keyof typeof UNSPLASH_QUERIES): UnsplashQueryConfig[] {
  const queries: UnsplashQueryConfig[] = []

  function extractQueries(obj: any) {
    for (const key in obj) {
      const value = obj[key]
      if (value.primary) {
        queries.push(value as UnsplashQueryConfig)
      } else if (typeof value === "object") {
        extractQueries(value)
      }
    }
  }

  extractQueries(UNSPLASH_QUERIES[category])
  return queries
}
