import { ComponentInterface } from "../../../lib/types.ts";
import Utils from "../../../lib/utils.ts";

const parseTemplate = function pT(current: ComponentInterface) {
  try {
    if (current.split) {
      const { split } = current;
      const open: number | undefined = split.indexOf("<template>");
      const close: number | undefined = split.indexOf("</template>");

      if (typeof open !== "number" || typeof close !== "number") {
        throw `There was an error isolating content inside of <template> tags for ${current.label}.vue`;
      }

      current.template = Utils.sliceAndTrim(split, open + 1, close);

      current.split = split.slice(close + 1);

      return "parseTemplate()=> successful";
    }
  } catch (error) {
    console.error("Error inside of parseTemplate()=>:", { error });
  }
};

export default parseTemplate;
