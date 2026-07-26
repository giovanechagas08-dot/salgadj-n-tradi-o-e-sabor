insert into public.price_tables (name, slug, audience, is_active, is_public, display_order) values
('Revenda — congelado para fritar','revenda-fritos','revenda',true,false,10),
('Revenda — congelado para assar','revenda-assados','revenda',true,false,11)
on conflict (slug) do update set name=excluded.name, audience=excluded.audience, is_active=true, is_public=false, display_order=excluded.display_order;

with src(nm, price, cat, unit, tbl, ord) as (values
('bolinha de catupiry',23.00,'salgados-fritos','pacote 50 un','revenda-fritos',10),
('bolinho aipim camarão',29.00,'salgados-fritos','pacote 50 un','revenda-fritos',11),
('bolinho aipim carne',25.90,'salgados-fritos','pacote 50 un','revenda-fritos',12),
('bolinho aipim queijo',25.50,'salgados-fritos','pacote 50 un','revenda-fritos',13),
('bolinho aipim frango',24.90,'salgados-fritos','pacote 50 un','revenda-fritos',14),
('bolinho de bacalhau',99.00,'salgados-fritos','pacote 50 un','revenda-fritos',15),
('bolinho de carne',24.80,'salgados-fritos','pacote 50 un','revenda-fritos',16),
('bolinho de gorgonzola com catupiry',34.80,'salgados-fritos','pacote 50 un','revenda-fritos',17),
('bolinho de azeitona com catupiry',25.80,'salgados-fritos','pacote 50 un','revenda-fritos',18),
('bolinho de calabresa',24.80,'salgados-fritos','pacote 50 un','revenda-fritos',19),
('camarão empanado com catupiry',81.00,'salgados-fritos','pacote 50 un','revenda-fritos',20),
('camarão empanado',77.50,'salgados-fritos','pacote 50 un','revenda-fritos',21),
('coxinha de frango',24.50,'salgados-fritos','pacote 50 un','revenda-fritos',22),
('coxinha de frango com catupiry',26.50,'salgados-fritos','pacote 50 un','revenda-fritos',23),
('coxinha de costela',34.50,'salgados-fritos','pacote 50 un','revenda-fritos',24),
('croquete de calabresa',24.50,'salgados-fritos','pacote 50 un','revenda-fritos',25),
('croquete de carne',24.50,'salgados-fritos','pacote 50 un','revenda-fritos',26),
('kibe de carne',24.15,'salgados-fritos','pacote 50 un','revenda-fritos',27),
('kibe com catupiry',26.15,'salgados-fritos','pacote 50 un','revenda-fritos',28),
('muçarela',26.10,'salgados-fritos','pacote 50 un','revenda-fritos',29),
('muçarela com alho',26.00,'salgados-fritos','pacote 50 un','revenda-fritos',30),
('muçarela com presunto',25.10,'salgados-fritos','pacote 50 un','revenda-fritos',31),
('risole de creme de camarão',26.50,'salgados-fritos','pacote 50 un','revenda-fritos',32),
('risole de palmito',25.90,'salgados-fritos','pacote 50 un','revenda-fritos',33),
('risole de frango',23.00,'salgados-fritos','pacote 50 un','revenda-fritos',34),
('salsicha',21.00,'salgados-fritos','pacote 50 un','revenda-fritos',35),
('esfirra de carne',1.13,'salgados-assados','unidade','revenda-assados',110),
('esfirra de frango',1.13,'salgados-assados','unidade','revenda-assados',111),
('esfirra de queijo',1.20,'salgados-assados','unidade','revenda-assados',112),
('folhado ameixa com bacon',1.07,'salgados-assados','unidade','revenda-assados',113),
('folhado banana com canela',1.14,'salgados-assados','unidade','revenda-assados',114),
('folhado ricota com damasco',1.49,'salgados-assados','unidade','revenda-assados',115),
('folhado chocolate',1.06,'salgados-assados','unidade','revenda-assados',116),
('folhado frango com catupiry',1.02,'salgados-assados','unidade','revenda-assados',117),
('folhado queijo com goiabada',1.03,'salgados-assados','unidade','revenda-assados',118),
('italiano cachorro quente',1.07,'salgados-assados','unidade','revenda-assados',119),
('italiano frango com catupiry',1.12,'salgados-assados','unidade','revenda-assados',120),
('italiano queijo com presunto',1.18,'salgados-assados','unidade','revenda-assados',121),
('pastel de forno camarão',1.54,'salgados-assados','unidade','revenda-assados',122),
('pastel de forno frango',1.17,'salgados-assados','unidade','revenda-assados',123),
('pastel de forno frango com abacaxi',1.23,'salgados-assados','unidade','revenda-assados',124),
('pastel de forno carne',1.11,'salgados-assados','unidade','revenda-assados',125),
('pastel de forno queijo com orégano',1.16,'salgados-assados','unidade','revenda-assados',126),
('pastel de forno ricota com espinafre',1.49,'salgados-assados','unidade','revenda-assados',127),
('pastel de forno palmito',1.18,'salgados-assados','unidade','revenda-assados',128),
('mini cachorro quente',1.77,'salgados-assados','unidade','revenda-assados',129),
('mini hambúrguer',2.00,'salgados-assados','unidade','revenda-assados',130),
('mini pizza calabresa',1.60,'salgados-assados','unidade','revenda-assados',131),
('mini pizza mussarela',1.58,'salgados-assados','unidade','revenda-assados',132)
), norm as (
  select
    initcap(substr(nm,1,1)) || substr(nm,2) as name,
    regexp_replace(regexp_replace(translate(nm,'áàâãéêíóôõúüç','aaaaeeiooouuc'),'[^a-z0-9]+','-','g'),'(^-|-$)','','g') as slug,
    price, cat, unit, tbl, ord
  from src
), ins as (
  insert into public.products (name, slug, category_id, unit, display_order, is_published, is_available)
  select n.name, n.slug, c.id, n.unit, n.ord, true, true
  from norm n left join public.categories c on c.slug = n.cat
  on conflict (slug) do update set
    name = excluded.name,
    category_id = excluded.category_id,
    unit = excluded.unit,
    display_order = excluded.display_order,
    is_published = true,
    is_available = true
  returning id, slug
)
insert into public.product_prices (product_id, price_table_id, price, unit)
select i.id, pt.id, n.price, n.unit
from norm n
join ins i on i.slug = n.slug
join public.price_tables pt on pt.slug = n.tbl
on conflict do nothing;