import { create } from 'zustand';

export interface Orb {
  id: string;
  name: string;
  emoji: string;
  status: 'active' | 'paused' | 'failed';
  prompt: string;
  template?: string;
  createdAt: Date;
  lastModified: Date;
  performance: {
    pnl: number;
    pnlPercent: number;
    trades: number;
    winRate: number;
  };
  blocks?: string; // Blockly workspace XML data
}

export interface OrbDraft {
  id: string;
  name: string;
  prompt: string;
  blocks?: string; // Blockly workspace XML data
  createdAt: Date;
  lastModified: Date;
}

interface OrbStore {
  orbs: Orb[];
  drafts: OrbDraft[];
  currentDraft: OrbDraft | null;
  showSuccessToast: boolean;
  
  // Actions
  createDraft: (prompt: string, template?: string) => string;
  updateDraft: (id: string, updates: Partial<OrbDraft>) => void;
  publishOrb: (draftId: string) => string | null;
  updateOrb: (id: string, updates: Partial<Orb>) => void;
  deleteOrb: (id: string) => void;
  setCurrentDraft: (draft: OrbDraft | null) => void;
  setShowSuccessToast: (show: boolean) => void;
}

export const useOrbStore = create<OrbStore>((set, get) => ({
  orbs: [
    {
      id: '1',
      name: 'ETH Scalp Bot',
      emoji: '🟣',
      status: 'active',
      prompt: 'Buy ETH when RSI < 30, sell when RSI > 70',
      createdAt: new Date(Date.now() - 86400000),
      lastModified: new Date(Date.now() - 3600000),
      performance: {
        pnl: 234.56,
        pnlPercent: 12.4,
        trades: 47,
        winRate: 68.1
      }
    },
    {
      id: '2',
      name: 'BTC DCA Bot',
      emoji: '🟠',
      status: 'active',
      prompt: 'Dollar-cost average into BTC every day at 12pm',
      createdAt: new Date(Date.now() - 172800000),
      lastModified: new Date(Date.now() - 7200000),
      performance: {
        pnl: 89.23,
        pnlPercent: 4.2,
        trades: 12,
        winRate: 75.0
      }
    }
  ],
  drafts: [],
  currentDraft: null,
  showSuccessToast: false,

  createDraft: (prompt: string, template?: string) => {
    const id = Date.now().toString();
    const draft: OrbDraft = {
      id,
      name: `Untitled Orb ${id.slice(-4)}`,
      prompt,
      createdAt: new Date(),
      lastModified: new Date()
    };

    set(state => ({
      drafts: [...state.drafts, draft],
      currentDraft: draft
    }));

    return id;
  },

  updateDraft: (id: string, updates: Partial<OrbDraft>) => {
    set(state => ({
      drafts: state.drafts.map(draft =>
        draft.id === id
          ? { ...draft, ...updates, lastModified: new Date() }
          : draft
      ),
      currentDraft: state.currentDraft?.id === id
        ? { ...state.currentDraft, ...updates, lastModified: new Date() }
        : state.currentDraft
    }));
  },

  publishOrb: (draftId: string) => {
    const state = get();
    const draft = state.drafts.find(d => d.id === draftId);
    
    if (draft) {
      const orbId = Date.now().toString();
      const orb: Orb = {
        id: orbId,
        name: draft.name,
        emoji: ['🟣', '🟠', '🔵', '🟢', '🟡'][Math.floor(Math.random() * 5)],
        status: 'active',
        prompt: draft.prompt,
        blocks: draft.blocks,
        createdAt: draft.createdAt,
        lastModified: new Date(),
        performance: {
          pnl: 0,
          pnlPercent: 0,
          trades: 0,
          winRate: 0
        }
      };

      set(state => ({
        orbs: [...state.orbs, orb],
        drafts: state.drafts.filter(d => d.id !== draftId),
        currentDraft: null
      }));
      
      return orbId;
    }
    return null;
  },

  updateOrb: (id: string, updates: Partial<Orb>) => {
    set(state => ({
      orbs: state.orbs.map(orb =>
        orb.id === id
          ? { ...orb, ...updates, lastModified: new Date() }
          : orb
      )
    }));
  },

  deleteOrb: (id: string) => {
    set(state => ({
      orbs: state.orbs.filter(orb => orb.id !== id)
    }));
  },

  setCurrentDraft: (draft: OrbDraft | null) => {
    set({ currentDraft: draft });
  },

  setShowSuccessToast: (show: boolean) => {
    set({ showSuccessToast: show });
  }
}));