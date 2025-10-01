export interface MedusaCategory {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    handle: string;
    parent_category_id?: null;
    rank: number;
    metadata: CategoryMetadata;
    category_children?: (null)[] | null;
    parent_category?: null;
}

export interface MedusaProductsCategoriesResponse {
    count: number,
    limit: number,
    offset: number,
    product_categories: MedusaCategory[],
}

export interface CategoryMetadata {
}
