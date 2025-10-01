import { MedusaVariant } from "../../interfaces/medusa-variant.interface";
import { MedusaCart } from "../../interfaces/medusa-cart.interface";
import { MedusaLineItem } from "../../interfaces/medusa-line-items.interface";

export namespace MedusaCartActions {
    export class AddToMedusaCart {
        static readonly type = '[MedusaCartActions] Add To Medusa Cart';
        constructor(public variant: MedusaVariant) { }
    }

    export class AddCartLineItems {
        static readonly type = '[MedusaCartActions] Add Cart Line Items';
        constructor(public cartId: string, public items: MedusaLineItem) { }
    }

    export class RefreshCart {
        static readonly type = '[MedusaCartActions] Refresh Cart';
    }

    export class RetriveCompletedOrder {
        static readonly type = '[MedusaCartActions] Retrive Completed Order';
        constructor(public orderId: string) { }
    }

    export class UpdateCartRegion {
        static readonly type = '[MedusaCartActions] Update Cart Region';
        constructor(public region_id: string) { }
    }

    export class UpdateMedusaCart {
        static readonly type = '[MedusaCartActions] Update Medusa Cart';
        constructor(public updateCartData: any) { }
    }

    export class AddPromotionstoCart {
        static readonly type = '[MedusaCartActions] Add Promotions to Cart';
        constructor(public promo_code: string) { }
    }

    export class RemovePromotionsfromCart {
        static readonly type = '[MedusaCartActions] Remove Promotions from Cart';
        constructor(public promo_code: string) { }
    }

    export class IncreaseCartItem {
        static readonly type = '[MedusaCartActions] Increase Cart Item';
        constructor(public cartItem: any) { }
    }

    export class DecreaseCartItem {
        static readonly type = '[MedusaCartActions] Decrease Cart Item';
        constructor(public cartItem: any) { }
    }

    export class DeleteCartItem {
        static readonly type = '[MedusaCartActions] Delete Cart Item';
        constructor(public line_id: string) { }
    }

    export class CompleteCart {
        static readonly type = '[MedusaCartActions] Complete Cart';
    }

    export class UpdateMedusaCartState {
        static readonly type = '[MedusaCartActions] Update Medusa Cart State';
        constructor(public cart: MedusaCart) { }
    }

    export class LogOut {
        static readonly type = '[MedusaCartActions] LogOut';
    }
}
