export interface IncentiveCalcTable {
  topoAdaptYn: boolean

  items: {
    ITEM_1: {
      ROW_1: {
        CALC: number
      }
      ROW_2: {
        INPUT: number
      }
      ROW_3: {
        INPUT: number
      }
      ROW_4: {
        INPUT: number
      }
    }
    ITEM_2: {
      ROW_1: {
        CALC: number
      }
      ROW_2: {
        INPUT: number
      }
      ROW_3: {
        INPUT: number
      }
      RESULT: Result
    }
    ITEM_3: {
      ROW_1: {
        YN: boolean
      }
      ROW_2: {
        INPUT_1: string
        INPUT_2: number
      }
    }
    ITEM_4: {
      ROW_1: {
        INPUT: boolean
      }
      ROW_2: {
        INPUT: boolean
      }
      ROW_3: {
        INPUT: boolean
      }
      ROW_4: {
        INPUT: boolean
      }
      ROW_5: {
        INPUT: boolean
      }
    }
    ITEM_5: {
      ROW_1: {
        INPUT: boolean
      }
    }
    ITEM_6: {
      ROW_1: {
        CALC: number
        YN: boolean
      }
      ROW_2: {
        INPUT: number
      }
      ROW_3: {
        INPUT: number
      }
      ROW_4: {
        INPUT: number
      }
      ROW_5: {
        CALC: number
        YN: boolean
      }
      ROW_6: {
        INPUT: number
      }
      ROW_7: {
        INPUT: number
      }
      ROW_8: {
        INPUT: number
      }
    }
    ITEM_7: {
      ROW_1: {
        INPUT: boolean
      }
      ROW_2: {
        INPUT: boolean
      }
      ROW_3: {
        INPUT: boolean
      }
      ROW_4: {
        INPUT: boolean
      }
    }
    ITEM_8: {
      ROW_1: {
        CALC: number
      }
      ROW_2: {
        INPUT: number
      }
      ROW_3: {
        INPUT: number
      }
      ROW_4: {
        INPUT: number
      }
      ROW_5: {
        CALC: number
        YN_1: boolean
        YN_2: boolean
      }
      ROW_6: {
        CALC: number
        YN_1: boolean
        YN_2: boolean
      }
      ROW_7: {
        CALC: number
        YN_1: boolean
        YN_2: boolean
      }
      ROW_8: {
        CALC_1: number
        CALC_2: number
        INPUT: number
        YN: boolean
      }
      ROW_9: {
        INPUT: number
        YN: boolean
      }
      ROW_10: {
        INPUT: number
        YN: boolean
      }
      ROW_11: {
        CALC_1: number
        CALC_2: number
        INPUT: number
        YN: boolean
      }
      ROW_12: {
        CALC_1: number
        CALC_2: number
        INPUT: number
        YN: boolean
      }
    }
  }

  results: {
    ITEM_1: Result.Item1
    ITEM_2: Result.Item2
    ITEM_3: Result.Item3
    ITEM_4: Result.Item4
    ITEM_5: Result.Item5
    ITEM_6: Result.Item6
    ITEM_7: Result.Item7
    ITEM_8: Result.Item8
    SUM: {
      BCR: number
      FAR: number
    }
    APPLY: {
      BCR: number
      FAR: number
    }
  }
}

namespace Result {
  interface Common {
    STATE: boolean
    RATIO: {
      BCR?: number
      FAR?: number
    }
  }

  interface Item1 extends Common {
    BCR: number
    FAR: number
    A: number
    B: number
  }

  interface Item2 extends Common {
    A: number
    B: number
    C: number
  }

  interface Item3 extends Common {
    A: string
    B: number
  }

  interface Item4 extends Common {
    _?
  }

  interface Item5 extends Common {
    _?
  }

  interface Item6 extends Common {
    A: number
    B: number
    C: number
    D: number
    E: number
  }

  interface Item7 extends Common {
    _?
  }

  interface Item8 extends Common {
    A: number
    B: number
    C: number
    D: number
    E: boolean
    F: boolean
    G: boolean
    H: number
    I: number
    J: number
    K: number
    L: number
    M: number
  }
}
