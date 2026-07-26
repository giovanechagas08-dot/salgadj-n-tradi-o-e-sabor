ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_group boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS flavor_name text,
  ADD COLUMN IF NOT EXISTS quote_unit text,
  ADD COLUMN IF NOT EXISTS qty_step integer,
  ADD COLUMN IF NOT EXISTS min_qty_per_flavor integer;

CREATE INDEX IF NOT EXISTS products_parent_id_idx ON public.products(parent_id);

ALTER TABLE public.products
  ADD CONSTRAINT products_quote_unit_check
  CHECK (quote_unit IS NULL OR quote_unit IN ('pacote_50','unidade'));