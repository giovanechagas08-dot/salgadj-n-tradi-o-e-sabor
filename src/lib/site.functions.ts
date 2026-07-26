import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as site from "./site.server";

const slugSchema = z.object({ slug: z.string().min(1).max(200) });

export const getHome = createServerFn({ method: "GET" }).handler(() => site.loadHome());

export const getSettings = createServerFn({ method: "GET" }).handler(() => site.loadSettings());

export const getPage = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => slugSchema.parse(data))
  .handler(({ data }) => site.loadPage(data.slug));

export const getHistoria = createServerFn({ method: "GET" }).handler(() => site.loadHistoria());

export const getEstrutura = createServerFn({ method: "GET" }).handler(() => site.loadEstrutura());

export const getProcessos = createServerFn({ method: "GET" }).handler(() => site.loadProcessos());

export const getDiferenciais = createServerFn({ method: "GET" }).handler(() =>
  site.loadDiferenciais(),
);

export const getPartners = createServerFn({ method: "GET" }).handler(() => site.loadPartners());

export const getPartner = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => slugSchema.parse(data))
  .handler(({ data }) => site.loadPartner(data.slug));

export const getCatalog = createServerFn({ method: "GET" }).handler(() => site.loadCatalog());

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => slugSchema.parse(data))
  .handler(({ data }) => site.loadProduct(data.slug));

export const getPriceTables = createServerFn({ method: "GET" }).handler(() =>
  site.loadPriceTables(),
);

export const getGallery = createServerFn({ method: "GET" }).handler(() => site.loadGallery());

export const getPosts = createServerFn({ method: "GET" }).handler(() => site.loadPosts());

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => slugSchema.parse(data))
  .handler(({ data }) => site.loadPost(data.slug));

export const getQuoteCatalog = createServerFn({ method: "GET" }).handler(() =>
  site.loadQuoteCatalog(),
);

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        name: z.string().min(2).max(120),
        phone: z.string().min(8).max(30),
        email: z.string().email().max(160).optional().or(z.literal("")),
        company: z.string().max(160).optional(),
        city: z.string().max(120).optional(),
        event_type: z.string().max(120).optional(),
        event_date: z.string().max(20).optional().or(z.literal("")),
        guests: z.number().int().min(0).max(100000).optional(),
        message: z.string().max(4000).optional(),
        items: z
          .array(
            z.object({
              product_id: z.string().uuid(),
              product_name: z.string().max(200),
              quantity: z.number().min(0.1).max(100000),
              unit: z.string().max(20),
            }),
          )
          .max(200),
      })
      .parse(data),
  )
  .handler(({ data }) =>
    site.createQuote({
      ...data,
      email: data.email || undefined,
      event_date: data.event_date || undefined,
    }),
  );

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        name: z.string().min(2).max(120),
        email: z.string().email().max(160).optional().or(z.literal("")),
        phone: z.string().max(30).optional(),
        subject: z.string().max(160).optional(),
        message: z.string().min(5).max(4000),
      })
      .parse(data),
  )
  .handler(({ data }) => site.createContact({ ...data, email: data.email || undefined }));

export const getSitemapEntries = createServerFn({ method: "GET" }).handler(() =>
  site.loadSitemapEntries(),
);
