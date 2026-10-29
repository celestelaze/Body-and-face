-- Panier & wishlist : accepter les produits du Google Sheet
ALTER TABLE public.cart     DROP CONSTRAINT IF EXISTS cart_product_id_fkey;
ALTER TABLE public.wishlist DROP CONSTRAINT IF EXISTS wishlist_product_id_fkey;

ALTER TABLE public.cart     ALTER COLUMN product_id TYPE text USING product_id::text;
ALTER TABLE public.wishlist ALTER COLUMN product_id TYPE text USING product_id::text;

ALTER TABLE public.cart     ADD COLUMN IF NOT EXISTS product jsonb;
ALTER TABLE public.wishlist ADD COLUMN IF NOT EXISTS product jsonb;

-- supprime d'éventuels doublons exacts dans le panier, puis impose 1 ligne par produit
DELETE FROM public.cart a USING public.cart b
 WHERE a.ctid < b.ctid AND a.user_id = b.user_id AND a.product_id = b.product_id;
CREATE UNIQUE INDEX IF NOT EXISTS cart_user_product_uniq ON public.cart (user_id, product_id);
