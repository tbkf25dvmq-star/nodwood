-- La tabella logo_settings esiste già, aggiungiamo la colonna position_x
ALTER TABLE public.logo_settings 
ADD COLUMN IF NOT EXISTS position_x TEXT NOT NULL DEFAULT 'left';

-- Aggiorna la policy RLS se necessario (la tabella dovrebbe già avere RLS dalle migrazioni precedenti)