import { ComponentInterface } from "../../lib/types.ts";
import Utils, { Queue, Storage } from "../../lib/utils.ts";
import { _ } from "../../lib/deps.ts";

import SiblingList from "../sibling.ts";

export default function parseScript(current: ComponentInterface) {
  try {
    if (current.split) {
      const { split } = current;

      const open: number = split.indexOf("<script>");
      const close: number = split.indexOf("</script>");

      if (open < 0 || close < 0) {
        console.warn(
          `warn: no found <script> in ${current.path}`,
        );
      }

      const script = split.slice(open + 1, close);

      const nameIndex = Utils.indexOfRegExp(/(name)/, script);

      if (nameIndex < 0) {
        current.name = _.kebabCase(current.label);
      } else {
        current.name = script[nameIndex].split(/[`'"]/)[1];
      }

      const exportStart = Utils.indexOfRegExp(/^(export)/, script);
      const exportEnd = script.lastIndexOf("}");

      current.script = Utils.sliceAndTrim(script, exportStart + 1, exportEnd);

      const componentsStart = Utils.indexOfRegExp(/(components:)/, script);
      const children = script.slice(componentsStart) || false;

      if (children) {
        const componentsEnd = children.findIndex((el) => el.includes("}")) + 1;
        const componentsStr = Utils.sliceAndTrim(children, 0, componentsEnd);

        const iter: string[] = _.compact(
          Utils.trimAndSplit(
            componentsStr,
            componentsStr.indexOf("{") + 1,
            componentsStr.indexOf("}"),
          ),
        );

        const childComponents = iter.map((child: string) => Storage[child]);

        current.child = new (SiblingList as any)();

        while (childComponents.length) {
          const component = childComponents.pop();

          if (component) {
            if (!component.isParsed) Queue.push(component);
            Utils.preorderScrub(component.label, current);
            current.child?.add(component);
          }
        }
      }
    }
    return "parseScript()=> successful";
  } catch (error) {
    console.error(
      "Error inside of Parser.script:",
      { error },
    );
  }
}