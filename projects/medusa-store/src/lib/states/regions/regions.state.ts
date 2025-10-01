import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { RegionsActions } from './regions.actions';
import { MedusaApiService } from '../../services/medusa-api.service';
import { MedusaRegion, MedusaRegionListResponse, NewCountryListModel } from '../../interfaces/medusa-region.interface';
import { ProductsActions } from '../products/products.actions';
import { MedusaCartActions } from '../medusa-cart/medusa-cart.actions';
import { Observable, take, tap, catchError, throwError } from 'rxjs';

// Local storage key for user's region preference
const USER_REGION_KEY = 'user_selected_region';
const DEFAULT_COUNTRY_CODE = 'us'; // Default country code

export interface RegionsStateStateModel {
    regionList: NewCountryListModel[];
    defaultRegion: NewCountryListModel;
}

@State<RegionsStateStateModel>({
    name: 'regions',
    defaults: {
        regionList: [],
        defaultRegion: {
            country: '',
            region_id: '',
            label: '',
            currency_code: '',
        }
    }
})
@Injectable()
export class RegionsState {
    private readonly medusaApi = inject(MedusaApiService);
    private store = inject(Store);

    @Selector()
    static getRegionList(state: RegionsStateStateModel): NewCountryListModel[] {
        return state.regionList;
    }

    @Selector()
    static getDefaultRegion(state: RegionsStateStateModel): NewCountryListModel {
        return state?.defaultRegion;
    }

    @Action(RegionsActions.GetCountries)
    getCountries(ctx: StateContext<RegionsStateStateModel>): Observable<any> {
        return this.medusaApi.regionsList().pipe(
            take(1),
            tap((res: MedusaRegionListResponse) => {
                console.log('Fetched regions:', res);
                const newCoutryList: NewCountryListModel[] = res.regions.map((r: any) => {
                    return r.countries?.map((c: { iso_2: String; display_name: String; }) => ({
                        currency_code: r.currency_code,
                        country: c.iso_2,
                        region_id: r.id,
                        label: c.display_name,
                    }))
                }).flat().sort((a: any, b: any) => (a?.label ?? "").localeCompare(b?.label ?? ""))

                // Get user's stored region preference
                const storedRegion = this.getStoredUserRegion();

                // Find the user's preferred region in the available regions
                let selectedRegion = null;
                if (storedRegion && newCoutryList.length > 0) {
                    selectedRegion = newCoutryList.find(region => region.country === storedRegion);
                }

                // If user's preferred region is not found or not stored, use default
                if (!selectedRegion) {
                    selectedRegion = newCoutryList.find(region => region.country === DEFAULT_COUNTRY_CODE);
                }

                // If still no region found, use the first available region
                if (!selectedRegion && newCoutryList.length > 0) {
                    selectedRegion = newCoutryList[0];
                }

                // If no regions available, create a fallback
                if (!selectedRegion) {
                    selectedRegion = {
                        country: DEFAULT_COUNTRY_CODE,
                        region_id: '',
                        label: 'Default',
                        currency_code: 'usd'
                    };
                }

                console.log('Selected region:', selectedRegion, 'Stored preference:', storedRegion);

                ctx.patchState({
                    regionList: newCoutryList,
                    defaultRegion: selectedRegion,
                });
            }),
            catchError(error => {
                console.error('Error loading regions:', error);
                // Set a default region to prevent loading issues
                const defaultRegion: NewCountryListModel = {
                    country: DEFAULT_COUNTRY_CODE,
                    region_id: '',
                    label: 'Default',
                    currency_code: 'usd'
                };
                ctx.patchState({
                    regionList: [],
                    defaultRegion: defaultRegion,
                });
                return throwError(() => error);
            })
        );
    }

    @Action(RegionsActions.SetSelectedCountry)
    SetSelectedCountry(ctx: StateContext<RegionsStateStateModel>, { country }: RegionsActions.SetSelectedCountry) {
        try {
            const state = ctx.getState();
            const filted = state.regionList.filter(value => value.country === country)
            if (filted[0]) {
                // Store user's region preference in localStorage
                this.storeUserRegion(country);

                this.store.dispatch(new MedusaCartActions.UpdateCartRegion(filted[0].region_id));
                this.store.dispatch(new ProductsActions.GetProductsId());
                return ctx.patchState({
                    defaultRegion: filted[0],
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    @Action(RegionsActions.ClearSelectedCoutry)
    clearSelectedCoutry(ctx: StateContext<RegionsStateStateModel>) {
        ctx.patchState({
            defaultRegion: undefined
        });
    }

    @Action(RegionsActions.ClearCoutryList)
    clearCoutryList(ctx: StateContext<RegionsStateStateModel>) {
        ctx.patchState({
            regionList: undefined
        });
    }

    @Action(RegionsActions.LogOut)
    logout(ctx: StateContext<RegionsStateStateModel>) {
        // Clear stored user region preference on logout
        this.clearStoredUserRegion();

        ctx.patchState({
            regionList: undefined,
            defaultRegion: undefined,
        });
    }

    /**
     * Store user's region preference in localStorage
     */
    private storeUserRegion(country: string): void {
        try {
            localStorage.setItem(USER_REGION_KEY, country);
            console.log('Stored user region preference:', country);
        } catch (error) {
            console.error('Error storing user region preference:', error);
        }
    }

    /**
     * Get user's stored region preference from localStorage
     */
    private getStoredUserRegion(): string | null {
        try {
            const stored = localStorage.getItem(USER_REGION_KEY);
            console.log('Retrieved stored user region preference:', stored);
            return stored;
        } catch (error) {
            console.error('Error retrieving user region preference:', error);
            return null;
        }
    }

    /**
     * Clear user's stored region preference
     */
    private clearStoredUserRegion(): void {
        try {
            localStorage.removeItem(USER_REGION_KEY);
            console.log('Cleared stored user region preference');
        } catch (error) {
            console.error('Error clearing user region preference:', error);
        }
    }
}
