function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;

    // Check if we're in production (Netlify)
    const isProduction = window.location.hostname === "team06x.netlify.app" ;

    // For production (Netlify), use absolute path from root
    if (isProduction) {
      this.path = `/json/${this.category}.json`;
      console.log(this.path);
    } else {
      // For local development, use relative path
      const pathDepth = window.location.pathname.split("/").length - 2;
      const pathPrefix = "../".repeat(pathDepth);
      this.path = `${pathPrefix}json/${this.category}.json`;
    }
  }

  async getData() {
    try {
      const response = await fetch(this.path);
      if (!response.ok) {
        throw new Error(`Bad Response: ${response.status}`);
      }
      return await convertToJson(response);
    } catch (error) {
      console.error(`Error fetching data from ${this.path}:`, error);
      throw error;
    }
  }

  async findProductById(id) {
    try {
      const products = await this.getData();
      const product = products.find((item) => item.Id === id);
      if (!product) {
        throw new Error(`Product not found with id: ${id}`);
      }
      return product;
    } catch (error) {
      console.error(`Error finding product ${id}:`, error);
      throw error;
    }
  }
}
