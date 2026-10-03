import { Fetch } from "sode-extend-react";
import BasicRest from "../BasicRest";

class GeneralsRest extends BasicRest {
  path = 'admin/generals'

  generateSitemap = async () => {
    const { status, result } = await Fetch(`/api/${this.path}/generate-sitemap`, {
      method: "POST"
    });
    return {
      status: status && (result?.status === 200 || result?.status === true),
      message: result?.message,
      data: result?.data ?? result,
    };
  }
}

export default GeneralsRest