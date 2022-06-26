export type PathParams = (string | number)[] | { [key: string]: string | number };

/*
 * Example usage:
 *   formatString("Hello, {name}, are you feeling {adjective}?", { name: "Gabriel", adjective: "OK" })
 *   formatString("Hello, {0}, are you feeling {1}?", ["Gabriel", "OK"])
 *   formatString("Hi, this is i{index}M.", { index: 207 })
 * */
export function formatString(template: string, args: PathParams) {
  if (args instanceof Array) {
    const args_: { [key: string]: string | number } = {};
    args.forEach((item, index) => {
      args_[index.toString()] = item;
    });
    args = args_;
  }
  for (const key in args) {
    template = template.replace(new RegExp(`\\{${key}\\}`, "gi"), args[key].toString());
  }
  return template;
}
