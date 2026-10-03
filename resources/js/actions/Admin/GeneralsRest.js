import { Fetch } from "sode-extend-react";
import BasicRest from "../BasicRest";

class GeneralsRest extends BasicRest {
  path = 'admin/generals'

  generateSitemap = async () => {
    return await Fetch(`/api/${this.path}/generate-sitemap`, {
      method: "POST"
    });
  }
}

export default GeneralsRest