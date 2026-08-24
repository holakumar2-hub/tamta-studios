export type AgentState = { intent: string; projectType?: string; budget?: string; timeline?: string; messages: string[]; enquiry?: Record<string, unknown> };

export async function creativeAssistant(state: AgentState): Promise<AgentState> {
  return { ...state, messages: [...state.messages, "Creative Assistant ready for orchestration"] };
}