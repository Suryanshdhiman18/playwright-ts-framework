import { expect } from '@playwright/test';

export class ProductDetailValidator {

    static validateProductDetail(searchProduct: any,requestBody: any,detailBody: any) {

        const cardInfo = detailBody.Product360CardInfo;

        // Request Validation

        expect(requestBody.SK_DIMUPC).toBe(searchProduct.SK_DimUPC);

        // Response Validation

        expect(cardInfo.SK_DimUPC).toBe(searchProduct.SK_DimUPC);

        expect(cardInfo.UPCCode).toBe(searchProduct.UPCCode);

        expect(cardInfo.Description).toBe(searchProduct.Description);

        expect(cardInfo.Brand).toBe(searchProduct.Brand);

        expect(cardInfo.Manufacturer).toBe(searchProduct.Manufacturer);

        expect(cardInfo.ClientPrice1).toBe(searchProduct.ClientPrice1);
    }
}