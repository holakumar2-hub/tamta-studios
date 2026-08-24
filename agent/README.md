# TAMTA Agent Architecture

Production target: a LangGraph-based enquiry agent.

START -> classify request -> collect missing project details -> optionally retrieve studio knowledge -> create enquiry -> human approval for external actions -> END.

Recommended tools: create_enquiry, get_service, search_portfolio, create_quote_draft, create_payment_order, notify_whatsapp.

Do not let the agent directly send payments, refunds, contracts or external messages without explicit authorization and guardrails.
