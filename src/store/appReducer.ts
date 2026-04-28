import type { AppState, Load } from '@/domain/types';

export type Action =
  | { type: 'ACTIVATE_SEARCH' }
  | { type: 'MATCH_FOUND'; load: Load; rejectedIds: string[] }
  | { type: 'NO_MATCH_FOUND' }
  | { type: 'ACCEPT_LOAD' }      // match → validating (triggers race-condition check)
  | { type: 'CONFIRM_ACCEPT' }   // validating → active (load confirmed available)
  | { type: 'LOAD_TAKEN' }       // validating → searching (someone else got it first)
  | { type: 'REJECT_LOAD' }
  | { type: 'TIMER_EXPIRED' }
  | { type: 'COMPLETE_TRIP' }
  | { type: 'SEARCH_AGAIN' };

export const initialState: AppState = { status: 'idle' };

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ACTIVATE_SEARCH':
      return { status: 'searching', rejectedIds: [] };

    case 'MATCH_FOUND':
      return { status: 'match', load: action.load, rejectedIds: action.rejectedIds };

    case 'NO_MATCH_FOUND':
      return { status: 'no_match' };

    // Accept enters a brief validation step before confirming the trip
    case 'ACCEPT_LOAD':
      if (state.status !== 'match') return state;
      return { status: 'validating', load: state.load, rejectedIds: state.rejectedIds };

    // Validation passed — start the trip
    case 'CONFIRM_ACCEPT':
      if (state.status !== 'validating') return state;
      return { status: 'active', load: state.load, startedAt: Date.now() };

    // Another driver took the load while we were validating
    case 'LOAD_TAKEN':
      if (state.status !== 'validating') return state;
      // Don't add to rejectedIds — the load might free up again (demo pool stays large)
      return { status: 'searching', rejectedIds: state.rejectedIds };

    // Reject / timeout both continue searching with the load excluded
    case 'REJECT_LOAD':
    case 'TIMER_EXPIRED':
      if (state.status !== 'match') return state;
      return {
        status: 'searching',
        rejectedIds: [...state.rejectedIds, state.load.id],
      };

    case 'COMPLETE_TRIP':
      if (state.status !== 'active') return state;
      return { status: 'completed', load: state.load };

    case 'SEARCH_AGAIN':
      return { status: 'idle' };

    default:
      return state;
  }
}
