import { MedusaProduct } from "./medusa-product.interface";

export interface DeleteProdRespoonse {
    id: string;
    object: string;
    deleted: boolean;
    parent: MedusaProduct;
}
