export class ProductSearchValidator {

    static validateProducts(products: any[], expectedKeywords: string) {

        const keywords =
            expectedKeywords
                .split(',')
                .map(
                    keyword =>
                        keyword
                            .trim()
                            .toLowerCase()
                );

        const matchedProducts =
            products.filter(
                product => {

                    const combinedText = `
                        ${product.Description}
                        ${product.Brand}
                        ${product.Manufacturer}
                        ${product.Category}
                    `
                        .toLowerCase();

                    return keywords.some(
                        keyword =>
                            combinedText.includes(
                                keyword
                            )
                    );
                }
            );

        return matchedProducts.length;
    }
}