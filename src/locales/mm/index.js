const modules = import.meta.glob("./*.js", { eager: true });

const messages = {};

for (const path in modules) {
  if (path === "./index.js") continue;
  const module = modules[path].default;
  Object.assign(messages, module);
}
export default messages;
