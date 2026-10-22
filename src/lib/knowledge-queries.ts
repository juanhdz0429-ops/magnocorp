import { queryOptions } from "@tanstack/react-query";
import { getKnowledgeCatalog } from "./knowledge.functions";

export const knowledgeCatalogOptions = queryOptions({ queryKey: ["knowledge-catalog"], queryFn: () => getKnowledgeCatalog(), staleTime: 30000 });